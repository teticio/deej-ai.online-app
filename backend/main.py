# pytest
# re-factor join_the_dots and make_playlist
# faiss
# bug in join the dots?
# get_similar
# ci/cd

import re
from deejai import DeejAI
from typing import Optional
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


class Search(BaseModel):
    string: str
    max_items: Optional[int] = 100


class Playlist(BaseModel):
    tracks: list
    size: Optional[int] = 10
    creativity: Optional[float] = 0.5
    noise: Optional[float] = 0
    seed: Optional[int] = None


deejai = DeejAI()
app = FastAPI()

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
async def search_tracks(search: Search):
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
async def create_playlist(playlist: Playlist):
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
