# pytest
# re-factor join_the_dots and make_playlist
# set seed in noise
# bug in join the dots?
# get_similar
# ci/cd

import re
import random
from . import models
from . import schemas
from .deejai import DeejAI
from sqlalchemy.orm import Session
from fastapi import Depends, FastAPI
from .database import SessionLocal, engine
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
        return deejai.join_the_dots(
            [playlist.creativity, 1 - playlist.creativity],
            playlist.tracks,
            n=playlist.size,
            noise=playlist.noise)
    else:
        return deejai.make_playlist(
            [playlist.creativity, 1 - playlist.creativity],
            playlist.tracks,
            size=playlist.size,
            noise=playlist.noise)


@app.post("/create_playlist")
async def create_playlist(playlist: schemas.Playlist,
                          db: Session = Depends(get_db)):
    db_item = models.Playlist(**playlist.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


@app.post("/update_playlist_name")
async def update_playlist_name(playlist: schemas.PlaylistName,
                               db: Session = Depends(get_db)):
    db_item = db.query(
        models.Playlist).filter(models.Playlist.id == playlist.id)
    db_item.update({'name': playlist.name})
    db.commit()
