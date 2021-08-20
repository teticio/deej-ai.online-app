import os
import re
import base64
import urllib
import aiohttp
from . import models
from . import schemas
from . import credentials
from .deejai import DeejAI
from typing import Optional
from sqlalchemy import desc
from sqlalchemy.orm import Session
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


origins = [
    "http://deej-ai.online",
    "https://deej-ai.online",
    "http://localhost:8000",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
        base64.b64encode(f'{credentials.client_id}:{credentials.client_secret}'
                         .encode('utf-8')).decode('utf-8')
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
    }
    url = os.environ.get('APP_URL',
                         '') + state + "#" + urllib.parse.urlencode(body)
    return RedirectResponse(url=url)


@app.get("/api/v1/refresh_token")
async def spotify_refresh_token(refresh_token: str):
    data = {'refresh_token': refresh_token, 'grant_type': 'refresh_token'}
    headers = {
        'Authorization':
        'Basic ' +
        base64.b64encode(f'{credentials.client_id}:{credentials.client_secret}'
                         .encode('utf-8')).decode('utf-8')
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


@app.post("/api/v1/search")
async def search_tracks(search: schemas.Search):
    ids = await deejai.search(search.string, search.max_items)
    return [{'track_id': id, 'track': deejai.get_tracks()[id]} for id in ids]


@app.post("/api/v1/search_similar")
async def search_similar_tracks(search: schemas.SearchSimilar):
    ids = await deejai.get_similar_vec(search.url, search.max_items)
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
    except:  # duplicate
        db.rollback()
        db_item = db.query(models.Playlist).filter(
            models.Playlist.name == playlist.name,
            models.Playlist.user_id == playlist.user_id,
            models.Playlist.playlist_id == playlist.playlist_id,
            models.Playlist.av_rating == playlist.av_rating,
            models.Playlist.num_ratings == playlist.num_ratings,
            models.Playlist.track_ids == playlist.track_ids,
            models.Playlist.tracks == playlist.tracks,
            models.Playlist.waypoints == playlist.waypoints).first()
    return db_item


@app.get("/api/v1/read_playlist")
def get_playlist(id: int, db: Session = Depends(get_db)):
    db_item = db.query(
        models.Playlist).filter(models.Playlist.id == id).first()
    return db_item


@app.post("/api/v1/update_playlist_name")
def update_playlist_name(playlist: schemas.PlaylistName,
                         db: Session = Depends(get_db)):
    db_item = db.query(
        models.Playlist).filter(models.Playlist.id == playlist.id)
    db_item.update({'name': playlist.name})
    db.commit()


@app.post("/api/v1/update_playlist_rating")
def update_playlist_rating(playlist: schemas.PlaylistRating,
                           db: Session = Depends(get_db)):
    db_item = db.query(
        models.Playlist).filter(models.Playlist.id == playlist.id)
    db_item.update({
        'av_rating': playlist.av_rating,
        'num_ratings': playlist.num_ratings
    })
    db.commit()


@app.post("/api/v1/update_playlist_id")
def update_playlist_id(playlist: schemas.PlaylistId,
                       db: Session = Depends(get_db)):
    db_item = db.query(
        models.Playlist).filter(models.Playlist.id == playlist.id)
    db_item.update({
        'user_id': playlist.user_id,
        'playlist_id': playlist.playlist_id
    })
    db.commit()


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


@app.post("/api/v1/search_playlists")
def search_playlists(search: schemas.SearchPlaylists,
                     db: Session = Depends(get_db)):
    db_items = []
    search_string = re.sub(r'([^\s\w]|_)+', '', search.string.lower()).split()
    for db_item in db.query(models.Playlist).all():
        if all(word in re.sub(r'([^\s\w]|_)+', '', db_item.name.lower())
               for word in search_string) or all(
                   word in re.sub(r'([^\s\w]|_)+', '', db_item.tracks.lower())
                   for word in search_string):
            db_items += [db_item]
            if len(db_items) >= search.max_items:
                break
    return db_items


# must be last
app.mount("/", StaticFiles(directory="build", html=True), name="app")
