import os
import re
import base64
import random
import urllib
import aiohttp
from . import models
from . import schemas
from . import credentials
from .deejai import DeejAI
from sqlalchemy import desc
from sqlalchemy.orm import Session
from fastapi import Depends, FastAPI
from .database import SessionLocal, engine
from fastapi.staticfiles import StaticFiles
from starlette.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

# create tables if necessary
models.Base.metadata.create_all(bind=engine)

deejai = DeejAI()
app = FastAPI()


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


@app.get("/login")
async def spotify_login():
    scope = "playlist-modify-public user-read-currently-playing"
    url = "https://accounts.spotify.com/authorize?" + urllib.parse.urlencode(
        {
            'response_type': 'code',
            'client_id': credentials.client_id,
            'scope': scope,
            'redirect_uri': credentials.redirect_uri,
            # state: state
        })
    return RedirectResponse(url=url)


@app.get("/callback")
async def spotify_callback(code: str):
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
        async with session.post('https://accounts.spotify.com/api/token',
                                data=data,
                                headers=headers) as response:
            json = await response.json()
    url = os.environ.get('URL', '') + "/#" + urllib.parse.urlencode(
        {
            'access_token': json['access_token'],
            'refresh_token': json['refresh_token']
        })
    return RedirectResponse(url=url)


@app.get("/refresh_token")
async def spotify_refresh_token(refresh_token: str):
    data = {'refresh_token': refresh_token, 'grant_type': 'refresh_token'}
    headers = {
        'Authorization':
        'Basic ' +
        base64.b64encode(f'{credentials.client_id}:{credentials.client_secret}'
                         .encode('utf-8')).decode('utf-8')
    }
    async with aiohttp.ClientSession() as session:
        async with session.post('https://accounts.spotify.com/api/token',
                                data=data,
                                headers=headers) as response:
            json = await response.json()
    return json


@app.post("/search")
async def search_tracks(search: schemas.Search):
    search_string = re.sub(r'([^\s\w]|_)+', '', search.string.lower()).split()
    ids = sorted([
        track for track in deejai.tracks if all(
            word in re.sub(r'([^\s\w]|_)+', '', deejai.tracks[track].lower())
            for word in search_string)
    ],
                 key=lambda x: deejai.tracks[x])[:search.max_items]
    response = []
    for id in ids:
        response.append({'track': deejai.tracks[id], 'id': id})
    return response


@app.post("/playlist")
async def playlist(playlist: schemas.NewPlaylist):
    if len(playlist.tracks) == 0:
        playlist.tracks = [random.choice(deejai.track_ids)]
    if len(playlist.tracks) > 1:
        return await deejai.join_the_dots(
            [playlist.creativity, 1 - playlist.creativity],
            playlist.tracks,
            n=playlist.size,
            noise=playlist.noise)
    else:
        return await deejai.make_playlist(
            [playlist.creativity, 1 - playlist.creativity],
            playlist.tracks,
            size=playlist.size,
            noise=playlist.noise)


@app.post("/create_playlist")
def create_playlist(playlist: schemas.Playlist, db: Session = Depends(get_db)):
    db_item = models.Playlist(**playlist.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


@app.get("/read_playlist")
def get_playlist(id: int, db: Session = Depends(get_db)):
    db_item = db.query(
        models.Playlist).filter(models.Playlist.id == id).first()
    return db_item


@app.post("/update_playlist_name")
def update_playlist_name(playlist: schemas.PlaylistName,
                         db: Session = Depends(get_db)):
    db_item = db.query(
        models.Playlist).filter(models.Playlist.id == playlist.id)
    db_item.update({'name': playlist.name})
    db.commit()


@app.post("/update_playlist_rating")
def update_playlist_rating(playlist: schemas.PlaylistRating,
                           db: Session = Depends(get_db)):
    db_item = db.query(
        models.Playlist).filter(models.Playlist.id == playlist.id)
    db_item.update({
        'av_rating': playlist.av_rating,
        'num_ratings': playlist.num_ratings
    })
    db.commit()


@app.get("/latest_playlists")
def get_latest_playlists(top_n: int, db: Session = Depends(get_db)):
    db_items = db.query(models.Playlist).order_by(desc(
        models.Playlist.created)).limit(top_n).all()
    return db_items


@app.get("/top_playlists")
def get_top_playlists(top_n: int, db: Session = Depends(get_db)):
    db_items = db.query(models.Playlist).order_by(
        desc(models.Playlist.av_rating)).limit(top_n).all()
    return db_items


# must be last
app.mount("/", StaticFiles(directory="build", html = True), name="app")
