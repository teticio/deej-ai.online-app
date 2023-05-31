"""Backend to handle calls to DeejAI, Spotify authentication and database functionality.
"""

import os
import re
import json
import urllib
import logging
from typing import Optional
from base64 import b64encode

from starlette.types import Scope
from starlette.responses import Response, RedirectResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exception_handlers import http_exception_handler

from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from fastapi_cache.coder import JsonCoder

from sqlalchemy import desc, event
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

import aiohttp
import aioredis

from bs4 import BeautifulSoup

from . import models  # pylint: disable=relative-beyond-top-level
from . import schemas  # pylint: disable=relative-beyond-top-level
from .deejai import DeejAI  # pylint: disable=relative-beyond-top-level
from .database import SessionLocal, engine  # pylint: disable=relative-beyond-top-level

try:
    from . import credentials  # pylint: disable=relative-beyond-top-level
    if 'SPOTIFY_REDIRECT_URI' in os.environ:
        credentials.SPOTIFY_REDIRECT_URI = os.environ['SPOTIFY_REDIRECT_URI']
except ImportError:

    class credentials:  # pylint: disable=invalid-name
        """Spotify credentials
        """
        SPOTIFY_CLIENT_ID = os.environ['SPOTIFY_CLIENT_ID']
        SPOTIFY_CLIENT_SECRET = os.environ['SPOTIFY_CLIENT_SECRET']
        SPOTIFY_REDIRECT_URI = os.environ['SPOTIFY_REDIRECT_URI']


REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost')
REDIS_NAMESPACE = os.environ.get('REDIS_NAMESPACE', 'deejai')

if 'NO_CACHE' not in os.environ:
    from fastapi_cache.decorator import cache  # pylint: disable=ungrouped-imports
else:

    def cache(**kwargs):  # pylint: disable=unused-argument
        """Override cache decorator
        """

        def do_nothing(func):
            """Don't cache
            """
            return func

        return do_nothing


# Create tables if necessary
models.Base.metadata.create_all(bind=engine)

deejai = DeejAI()
with open('widget/playlist.html', 'rt', encoding='utf8') as file:
    playlist_widget = file.read()
app = FastAPI(docs_url=os.environ.get('DOCS_URL', None),
              redoc_url=os.environ.get('REDOC_URL', None))


# Dependency
def get_db():
    """Connect to database.

    Yields:
        Session: SQLAlchemy session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@event.listens_for(models.Playlist, 'before_update')
def receive_before_update(mapper, connection, target):  # pylint: disable=unused-argument
    """Ensure hash is calculated before an update.
    """
    target.hash = models.Playlist.hash_it(target)


@event.listens_for(models.Playlist, 'before_insert')
def receive_before_insert(mapper, connection, target):  # pylint: disable=unused-argument
    """Ensure hash is calculated before an insert.
    """
    target.hash = models.Playlist.hash_it(target)


@app.on_event('startup')
async def startup():
    """Initialize cache.
    """
    if 'NO_CACHE' not in os.environ:
        redis = aioredis.from_url(REDIS_URL,
                                  encoding='utf8',
                                  decode_responses=True)
        FastAPICache.init(RedisBackend(redis), prefix='fastapi-cache')


class HTMLCoder(JsonCoder):
    """Cache HTMLResponse.
    """

    @classmethod
    def decode(cls, value):
        """Decode HTMLResponse.
        """
        response = JsonCoder.decode(value)
        return HTMLResponse(content=response['body'],
                            status_code=response['status_code'])


origins = [
    'http://deej-ai.online',
    'https://deej-ai.online',
    'http://localhost:8000',
    'http://localhost:3000',
    'http://127.0.0.1:8080',
    'http://localhost',
    'http://localhost:19006',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


class EndpointFilter(logging.Filter):  # pylint: disable=too-few-public-methods
    """Filter out endpoints (e.g. /healthz) from logging
    """

    def filter(self, record: logging.LogRecord) -> bool:
        return record.getMessage().find('/healthz') == -1


# Filter out /endpoint
logging.getLogger('uvicorn.access').addFilter(EndpointFilter())


@app.get('/healthz')
async def health_check():
    """Am I alive?

    Returns:
        dict: {'status': 'pass'}
    """
    return {'status': 'pass'}


@app.get('/api/v1/login')
async def spotify_login(state: Optional[str] = None):
    """Initiate Spotify authentication.

    Args:
        state (Optional[str], optional): State that is passed to callback. Defaults to None.

    Returns:
        RedirectResponse: Redirection to Spotify authentication URL.
    """
    scope = 'playlist-modify-public user-read-currently-playing'
    body = {
        'response_type': 'code',
        'client_id': credentials.SPOTIFY_CLIENT_ID,
        'scope': scope,
        'redirect_uri': credentials.SPOTIFY_REDIRECT_URI,
    }
    if state:
        body['state'] = state
    url = 'https://accounts.spotify.com/authorize?' + urllib.parse.urlencode(
        body)
    return RedirectResponse(url=url)


@app.get('/api/v1/callback')
async def spotify_callback(code: str, state: Optional[str] = '/'):
    """Handle callback from Spotify. This endpoint must correspond to credentials.redirect_uri.

    Args:
        code (str): Authorization code.
        state (Optional[str], optional): State passed in from login. Defaults to '/'.

    Returns:
        RedirectResponse: Redirection to application root with hash parameters.
    """
    data = {
        'code': code,
        'redirect_uri': credentials.SPOTIFY_REDIRECT_URI,
        'grant_type': 'authorization_code'
    }
    headers = {
        'Authorization':
        'Basic ' + b64encode(
            f'{credentials.SPOTIFY_CLIENT_ID}:{credentials.SPOTIFY_CLIENT_SECRET}'
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
                _json = await response.json()
        except aiohttp.ClientError as error:
            raise HTTPException(status_code=400, detail=str(error)) from error
    body = {
        'access_token': _json['access_token'],
        'refresh_token': _json['refresh_token'],
        'route': state
    }
    if state.startswith('deejai://'):
        url = state + '?' + urllib.parse.urlencode(body)
    else:
        url = os.environ.get('APP_URL',
                             '') + '#' + urllib.parse.urlencode(body)
    return RedirectResponse(url=url)


@app.get('/api/v1/refresh_token')
async def spotify_refresh_token(refresh_token: str):
    """Get a new access token using the refresh token.

    Args:
        refresh_token (str): Spotify refresh token.

    Returns:
        str: Access token in JSON format.
    """
    data = {'refresh_token': refresh_token, 'grant_type': 'refresh_token'}
    headers = {
        'Authorization':
        'Basic ' + b64encode(
            f'{credentials.SPOTIFY_CLIENT_ID}:{credentials.SPOTIFY_CLIENT_SECRET}'
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
                _json = await response.json()
        except aiohttp.ClientError as error:
            raise HTTPException(status_code=400, detail=str(error)) from error
    return _json


@app.get('/get_access_token')
async def get_access_token(request: Request):
    """Proxy
    """
    headers = {
        'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) '
        'Chrome/92.0.4515.159 Safari/537.36'
    }
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(
                    f'https://open.spotify.com/get_access_token?{request.query_params}',
                    headers=headers) as response:
                if response.status != 200:
                    raise HTTPException(status_code=response.status,
                                        detail=response.reason)
                text = await response.text()
        except aiohttp.ClientError as error:
            raise HTTPException(status_code=400, detail=str(error)) from error
    return HTMLResponse(content=text, status_code=200)


@app.get('/api/v1/widget')
@cache(namespace=REDIS_NAMESPACE, expire=24 * 60 * 60)
async def widget(track_id: str):
    """Get Spotify track widget.
    (Deprecated.)

    Args:
        track_id (str): Spotify track ID.

    Returns:
        str: Base64 encoded HTML which can be embedded in an iframe.
    """
    return await make_playlist_widget(f'["{track_id}"]')


@app.get('/api/v1/track_widget')
@cache(namespace=REDIS_NAMESPACE, expire=24 * 60 * 60, coder=HTMLCoder)
async def track_widget(track_id: str):
    """Get Spotify track widget.

    Args:
        track_id (str): Spotify track ID.

    Returns:
        str: HTML which can be embedded in an iframe.
    """
    return await make_playlist_widget(f'["{track_id}"]')


@app.get('/api/v1/playlist_widget')
@cache(namespace=REDIS_NAMESPACE, expire=24 * 60 * 60, coder=HTMLCoder)
async def make_playlist_widget(track_ids, waypoints='[]', playlist_id=''):
    """Make a new Spotify playlist widget.

    Args:
        track_ids (str): JSONified list of track IDs
        waypoints (str): JSONified list of waypoints
        playlist_id (str): Playlist id

    Returns:
        str: HTML which can be embedded in an iframe.
    """
    track_ids = json.loads(track_ids)
    waypoints = json.loads(waypoints)
    assert len(track_ids) > 0
    headers = {
        'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) '
        'Chrome/92.0.4515.159 Safari/537.36'
    }
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(
                    f'https://open.spotify.com/embed/track/{track_ids[0]}',
                    headers=headers) as response:
                if response.status != 200:
                    raise HTTPException(status_code=response.status,
                                        detail=response.reason)
                text = await response.text()
        except aiohttp.ClientError as error:
            raise HTTPException(status_code=400, detail=str(error)) from error
    image_url = re.findall(r'(https://i\.scdn\.co/image/[a-z0-9]*)', text)[0]
    dominant_color = re.findall(r'--background-color:(#[A-F0-9]{1,6})', text)
    dominant_color = dominant_color[0] if len(dominant_color) > 0 else '#000000'
    text = playlist_widget
    soup = BeautifulSoup(text, 'html.parser')
    tag = soup.find(id="resource")
    track = json.loads(urllib.parse.unquote(tag.string))
    if playlist_id == "":
        playlist_id = "2p8cnjuIgVpsWln5HfbqTk"
    playlist = {
        'images': [
            {
                'height': 640,
                'width': 640,
                'url': image_url
            },
            {
                'height': 300,
                'width': 300,
                'url': image_url
            },
            {
                'height': 64,
                'width': 64,
                'url': image_url
            },
        ],
        'tracks': {},
        'type':
        'playlist',
        'uri':
        f'spotify:playlist:{playlist_id}',
        'href':
        f'https://api.spotify.com/v1/playlist/{playlist_id}',
        'dominantColor':
        dominant_color
    }
    playlist['tracks']['items'] = []
    for track_id in track_ids:
        title = deejai.tracks[track_id]
        track = {
            'is_local':
            True,
            'is_playable':
            True,
            'name': ('* ' if track_id in waypoints else '') +
            title[title.find(' - ') + 3:],
            'preview_url':
            deejai.urls.get(track_id, ''),
            'artists': [{
                'name': title[:title.find(' - ')]
            }],
            'duration_ms':
            '30000',
            'uri':
            f'spotify:track{track_id}'
        }
        playlist['tracks']['items'].append({'track': track})
    playlist['name'] = playlist['tracks']['items'][0]['track']['name']
    playlist['owner'] = {
        'display_name':
        playlist['tracks']['items'][0]['track']['artists'][0]['name']
    }
    tag.string.replace_with(urllib.parse.quote(json.dumps(playlist)))
    return HTMLResponse(content=str(soup), status_code=200)


@app.get('/api/v1/search')
async def search_tracks(string: str, max_items: int):
    """Search database of tracks for artists and titles including words in string.

    Args:
        string (str): String of case insensitive words to search for.
        max_items (int): Maximum number of items to return.

    Returns:
        list: List of track IDs and tracks.
    """
    ids = await deejai.search(string, max_items)
    return [{'track_id': id, 'track': deejai.get_tracks()[id]} for id in ids]


@app.get('/api/v1/search_similar')
async def search_similar_tracks(url: str, max_items: int):
    """Search for tracks that sound similar using Deep Learning model.

    Args:
        url (str): URL of MP3 (for example, Spotify preview URL).
        max_items (int): Maximum number of items to return.

    Returns:
        list: List of track IDs and tracks.
    """
    ids = await deejai.get_similar_vec(url, max_items)
    return [{'track_id': id, 'track': deejai.get_tracks()[id]} for id in ids]


@app.post('/api/v1/playlist')
async def generate_playlist(playlist: schemas.NewPlaylist):
    """Generate a playlist that joins the dots between the waypoints.

    Args:
        playlist (schemas.NewPlaylist): List of track IDs, size, "creativity" and "noise".

    Returns:
        dict: Separate list of track IDs and tracks.
    """
    ids = await deejai.playlist(playlist.track_ids, playlist.size,
                                playlist.creativity, playlist.noise)
    return {
        'track_ids': ids,
        'tracks': [deejai.get_tracks()[id] for id in ids]
    }


@app.post('/api/v1/create_playlist')
def create_playlist(playlist: schemas.Playlist, db: Session = Depends(get_db)):
    """Store new playlist in database

    Args:
        playlist (schemas.Playlist): Playlist fields.
        db (Session, optional): SQLAlchemy session. Defaults to Depends(get_db).

    Returns:
        models.Playlist: Newly created playlist from database.
    """
    db_item = models.Playlist(**playlist.dict())
    try:
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
    except IntegrityError:  # Duplicate
        db.rollback()
        db_item = db.query(models.Playlist).filter(
            models.Playlist.hash == models.Playlist.hash_it(playlist))
        db_item.update({'created': playlist.created})
        if playlist.num_ratings > 0:
            db_item.update({
                'num_ratings':
                db_item.first().num_ratings + playlist.num_ratings,
                'av_rating':
                (db_item.first().av_rating * db_item.first().num_ratings +
                 playlist.av_rating * playlist.num_ratings) /
                (db_item.first().num_ratings + playlist.num_ratings)
            })
        db.commit()  # Doesn't call hook but that's ok
        db_item = db_item.first()
    return db_item


@app.get('/api/v1/read_playlist')
def get_playlist(playlist_id: int, db: Session = Depends(get_db)):
    """Get playlist by ID from the database.

    Args:
        playlist_id (int): Playlist ID.
        db (Session, optional): SQLAlchemy session. Defaults to Depends(get_db).

    Returns:
        models.Playlist: Playlist from database.
    """
    db_item = db.query(models.Playlist).get(playlist_id)
    return db_item


@app.post('/api/v1/update_playlist_name')
def update_playlist_name(playlist: schemas.PlaylistName,
                         db: Session = Depends(get_db)):
    """Update name of playlist with given ID in the database.

    Args:
        playlist (schemas.PlaylistName): id and name should be specified.
        db (Session, optional): SQLAlchemy session. Defaults to Depends(get_db).
    """
    db.query(models.Playlist).get(playlist.id).name = playlist.name
    try:
        db.commit()
    except SQLAlchemyError:
        logging.error("Unable to update playlist name %s", playlist)
        db.rollback()


@app.post('/api/v1/update_playlist_rating')
def update_playlist_rating(playlist: schemas.PlaylistRating,
                           db: Session = Depends(get_db)):
    """Update rating of playlist with given ID in the database.

    Args:
        playlist (schemas.PlaylistRating): id, av_rating and num_ratings should
                                           be specified.
        db (Session, optional): SQLAlchemy session. Defaults to Depends(get_db).
    """
    db_item = db.query(models.Playlist).get(playlist.id)
    db_item.av_rating = playlist.av_rating
    db_item.num_ratings = playlist.num_ratings
    try:
        db.commit()
    except SQLAlchemyError:
        logging.error("Unable to update playlist rating %s", playlist)
        db.rollback()


@app.post('/api/v1/update_playlist_id')
def update_playlist_id(playlist: schemas.PlaylistId,
                       db: Session = Depends(get_db)):
    """Update Spotify playlist and user IDs of playlist with given ID in the database.

    Args:
        playlist (schemas.PlaylistId): id, playlist_id and playlist.user_id
                                       should be specified.
        db (Session, optional): SQLAlchemy session. Defaults to Depends(get_db).
    """
    db_item = db.query(models.Playlist).get(playlist.id)
    db_item.user_id = playlist.user_id
    db_item.playlist_id = playlist.playlist_id
    try:
        db.commit()
    except SQLAlchemyError:
        logging.error("Unable to update playlist id %s", playlist)
        db.rollback()


@app.post('/api/v1/update_playlist_uploads')
def update_playlist_uploads(playlist: schemas.PlaylistUploads,
                            db: Session = Depends(get_db)):
    """Update number of times playlist has been uploaded to Spotify.

    Args:
        playlist (schemas.PlaylistUploads): id and uploads should be specified.
        db (Session, optional): SQLAlchemy session. Defaults to Depends(get_db).
    """
    db_item = db.query(models.Playlist).get(playlist.id)
    db_item.uploads = playlist.uploads
    try:
        db.commit()
    except SQLAlchemyError:
        logging.error("Unable to update playlist uploads %s", playlist)
        db.rollback()


@app.get('/api/v1/latest_playlists')
def get_latest_playlists(top_n: int, db: Session = Depends(get_db)):
    """Get the most recently added playlists from the database.

    Args:
        top_n (int): Maximum number of playlists to return.
        db (Session, optional): SQLAlchemy session. Defaults to Depends(get_db).

    Returns:
        list: List of models.Playlist items.
    """
    try:
        db_items = db.query(models.Playlist).order_by(
            desc(models.Playlist.created)).limit(top_n).all()
    except SQLAlchemyError:
        return []
    return db_items


@app.get('/api/v1/top_playlists')
def get_top_playlists(top_n: int, db: Session = Depends(get_db)):
    """Get the most highly rated playlists from the database.

    Args:
        top_n (int): Maximum number of playlists to return.
        db (Session, optional): SQLAlchemy session. Defaults to Depends(get_db).

    Returns:
        list: List of models.Playlist items.
    """
    try:
        db_items = db.query(models.Playlist).order_by(
            desc(models.Playlist.av_rating), desc(models.Playlist.num_ratings),
            desc(models.Playlist.created)).limit(top_n).all()
    except SQLAlchemyError:
        return []
    return db_items


@app.get('/api/v1/most_uploads')
def get_most_uploads(top_n: int, db: Session = Depends(get_db)):
    """Get the most uploaded playlists from the database.

    Args:
        top_n (int): Maximum number of playlists to return.
        db (Session, optional): SQLAlchemy session. Defaults to Depends(get_db).

    Returns:
        list: List of models.Playlist items.
    """
    try:
        db_items = db.query(models.Playlist).order_by(
            desc(models.Playlist.uploads),
            desc(models.Playlist.created)).limit(top_n).all()
    except SQLAlchemyError:
        return []
    return db_items


@app.get('/api/v1/search_playlists')
def search_playlists(string: str,
                     max_items: int,
                     db: Session = Depends(get_db)):
    """Search for playlists in the database with a name or tracks with words in string.

    Args:
        string (str): String of case insensitive words to search for.
        max_items (int): Maximum number of playlists to return.
        db (Session, optional): SQLAlchemy session. Defaults to Depends(get_db).

    Returns:
        list: List of models.Playlist items.
    """
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


# Let front end handle 404
@app.exception_handler(StarletteHTTPException)
async def custom_http_exception_handler(request, exc):
    """Intercept 404 not found and redirect to application 404 page.
    """
    if exc.status_code == 404:
        url = os.environ.get('APP_URL', '') + '/#' + urllib.parse.urlencode(
            {'route': request.url.path})
        return RedirectResponse(url=url)
    return await http_exception_handler(request, exc)


class _StaticFiles(StaticFiles):
    """Hack because starlette StaticFiles returns PlainTextReponse instead of Exception
       in case of 404
       Also handle gzipped responses for js and css files
    """

    async def get_response(self, path: str, scope: Scope) -> Response:
        response = await super().get_response(path, scope)
        if response.status_code == 404:
            raise StarletteHTTPException(404, "Not found")
        if (path[-3:] == '.js'
                or path[-4:] == '.css') and 'static' not in path:
            response.headers['Content-Encoding'] = 'gzip'
        return response


# Must be last
app.mount('/', _StaticFiles(directory='build', html=True), name='app')
