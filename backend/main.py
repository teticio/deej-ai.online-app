import os
import re
import urllib
import aiohttp
import logging
from . import models
from . import schemas
from . import credentials
from .deejai import DeejAI
from typing import Optional
from base64 import b64encode
from starlette.types import Scope
from sqlalchemy.orm import Session
from sqlalchemy import desc, event
from starlette.responses import Response
from sqlalchemy.exc import IntegrityError
from .database import SessionLocal, engine
from fastapi.staticfiles import StaticFiles
from starlette.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends, FastAPI, HTTPException
from fastapi.exception_handlers import http_exception_handler
from starlette.exceptions import HTTPException as StarletteHTTPException

# create tables if necessary
models.Base.metadata.create_all(bind=engine)

deejai = DeejAI()
app = FastAPI(docs_url=os.environ.get('DOCS_URL', None),
              redoc_url=os.environ.get('REDOC_URL', None))


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@event.listens_for(models.Playlist, "before_update")
def receive_before_update(mapper, connection, target):
    target.hash = models.Playlist.hash_it(target)


@event.listens_for(models.Playlist, "before_insert")
def receive_before_update(mapper, connection, target):
    target.hash = models.Playlist.hash_it(target)


origins = [
    "http://deej-ai.online",
    "https://deej-ai.online",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://127.0.0.1:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/healthz")
async def health_check():
    return {'status': 'pass'}


@app.get("/api/v1/login")
async def spotify_login(state: Optional[str] = None):
    scope = "playlist-modify-public user-read-currently-playing"
    body = {
        'response_type': 'code',
        'client_id': credentials.client_id,
        'scope': scope,
        'redirect_uri': credentials.redirect_uri,
    }
    if state:
        body['state'] = state
    url = "https://accounts.spotify.com/authorize?" + urllib.parse.urlencode(
        body)
    return RedirectResponse(url=url)


@app.get("/api/v1/callback")
async def spotify_callback(code: str, state: Optional[str] = '/'):
    data = {
        'code': code,
        'redirect_uri': credentials.redirect_uri,
        'grant_type': 'authorization_code'
    }
    headers = {
        'Authorization':
        'Basic ' +
        b64encode(f'{credentials.client_id}:{credentials.client_secret}'.
                  encode('utf-8')).decode('utf-8')
    }
    async with aiohttp.ClientSession() as session:
        try:
            async with session.post('https://accounts.spotify.com/api/token',
                                    data=data,
                                    headers=headers) as response:
                if response.status != 200:
                    raise HTTPException(status_code=response.status,
                                        detail=response.reason)
                json = await response.json()
        except aiohttp.ClientError as error:
            raise HTTPException(status_code=400, detail=str(error))
    body = {
        'access_token': json['access_token'],
        'refresh_token': json['refresh_token'],
        'route': state
    }
    url = os.environ.get('APP_URL', '') + "#" + urllib.parse.urlencode(body)
    return RedirectResponse(url=url)


@app.get("/api/v1/refresh_token")
async def spotify_refresh_token(refresh_token: str):
    data = {'refresh_token': refresh_token, 'grant_type': 'refresh_token'}
    headers = {
        'Authorization':
        'Basic ' +
        b64encode(f'{credentials.client_id}:{credentials.client_secret}'.
                  encode('utf-8')).decode('utf-8')
    }
    async with aiohttp.ClientSession() as session:
        try:
            async with session.post('https://accounts.spotify.com/api/token',
                                    data=data,
                                    headers=headers) as response:
                if response.status != 200:
                    raise HTTPException(status_code=response.status,
                                        detail=response.reason)
                json = await response.json()
        except aiohttp.ClientError as error:
            raise HTTPException(status_code=400, detail=str(error))
    return json


@app.get("/api/v1/widget")
async def widget(track_id: str):
    headers = {
        'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36'
    }
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(
                    f'https://open.spotify.com/embed/track/{track_id}',
                    headers=headers) as response:
                if response.status != 200:
                    raise HTTPException(status_code=response.status,
                                        detail=response.reason)
                text = await response.text()
        except aiohttp.ClientError as error:
            raise HTTPException(status_code=400, detail=str(error))
    return b64encode(text.encode('ascii'))


@app.get("/api/v1/search")
async def search_tracks(string: str, max_items: int):
    ids = await deejai.search(string, max_items)
    return [{'track_id': id, 'track': deejai.get_tracks()[id]} for id in ids]


@app.get("/api/v1/search_similar")
async def search_similar_tracks(url: str, max_items: int):
    ids = await deejai.get_similar_vec(url, max_items)
    return [{'track_id': id, 'track': deejai.get_tracks()[id]} for id in ids]


@app.post("/api/v1/playlist")
async def playlist(playlist: schemas.NewPlaylist):
    ids = await deejai.playlist(playlist.track_ids, playlist.size,
                                playlist.creativity, playlist.noise)
    return {
        'track_ids': ids,
        'tracks': [deejai.get_tracks()[id] for id in ids]
    }


@app.post("/api/v1/create_playlist")
def create_playlist(playlist: schemas.Playlist, db: Session = Depends(get_db)):
    db_item = models.Playlist(**playlist.dict())
    try:
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
    except IntegrityError:  # duplicate
        db.rollback()
        db_item = db.query(models.Playlist).filter(
            models.Playlist.hash == models.Playlist.hash_it(playlist))
        db_item.update({'created': playlist.created})
        db.commit()  # doesn't call hook but that's ok
        db_item = db_item.first()
    except:
        logging.error(f"Unable to create playlist {playlist}")
        db.rollback()
    return db_item


@app.get("/api/v1/read_playlist")
def get_playlist(id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.Playlist).get(id)
    return db_item


@app.post("/api/v1/update_playlist_name")
def update_playlist_name(playlist: schemas.PlaylistName,
                         db: Session = Depends(get_db)):
    db.query(models.Playlist).get(playlist.id).name = playlist.name
    try:
        db.commit()
    except:
        logging.error(f"Unable to update playlist name {playlist}")
        db.rollback()


@app.post("/api/v1/update_playlist_rating")
def update_playlist_rating(playlist: schemas.PlaylistRating,
                           db: Session = Depends(get_db)):
    db_item = db.query(models.Playlist).get(playlist.id)
    db_item.av_rating = playlist.av_rating
    db_item.num_ratings = playlist.num_ratings
    try:
        db.commit()
    except:
        logging.error(f"Unable to update playlist rating {playlist}")
        db.rollback()


@app.post("/api/v1/update_playlist_id")
def update_playlist_id(playlist: schemas.PlaylistId,
                       db: Session = Depends(get_db)):
    db_item = db.query(models.Playlist).get(playlist.id)
    db_item.user_id = playlist.user_id
    db_item.playlist_id = playlist.playlist_id
    try:
        db.commit()
    except:
        logging.error(f"Unable to update playlist id {playlist}")
        db.rollback()


@app.get("/api/v1/latest_playlists")
def get_latest_playlists(top_n: int, db: Session = Depends(get_db)):
    db_items = db.query(models.Playlist).order_by(desc(
        models.Playlist.created)).limit(top_n).all()
    return db_items


@app.get("/api/v1/top_playlists")
def get_top_playlists(top_n: int, db: Session = Depends(get_db)):
    db_items = db.query(models.Playlist).order_by(
        desc(models.Playlist.av_rating)).limit(top_n).all()
    return db_items


@app.get("/api/v1/search_playlists")
def search_playlists(string: str,
                     max_items: int,
                     db: Session = Depends(get_db)):
    db_items = []
    search_string = re.sub(r'([^\s\w]|_)+', '', string.lower()).split()
    for db_item in db.query(models.Playlist).all():
        if all(word in re.sub(r'([^\s\w]|_)+', '', db_item.name.lower())
               for word in search_string) or all(
                   word in re.sub(r'([^\s\w]|_)+', '', db_item.tracks.lower())
                   for word in search_string):
            db_items += [db_item]
            if len(db_items) >= max_items:
                break
    return db_items


# let front end handle 404
@app.exception_handler(StarletteHTTPException)
async def custom_http_exception_handler(request, exc):
    if exc.status_code == 404:
        url = os.environ.get('APP_URL', '') + "/#" + urllib.parse.urlencode(
            {'route': request.url.path})
        return RedirectResponse(url=url)
    else:
        return await http_exception_handler(request, exc)


# hack because starlette StaticFiles returns PlainTextReponse instead of Exception in case of 404
class _StaticFiles(StaticFiles):
    async def get_response(self, path: str, scope: Scope) -> Response:
        response = await super().get_response(path, scope)
        if response.status_code == 404:
            raise StarletteHTTPException(404, "Not found")
        else:
            return response


# must be last
app.mount("/", _StaticFiles(directory="build", html=True), name="app")
