from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class Search(BaseModel):
    string: str
    max_items: Optional[int] = 100


class NewPlaylist(BaseModel):
    tracks: list
    size: Optional[int] = 10
    creativity: Optional[float] = 0.5
    noise: Optional[float] = 0
    seed: Optional[int] = None

    class Config:
        orm_mode = True

class Playlist(BaseModel):
    name: Optional[str] = "Deej-A.I."
    created: datetime
    spotify_user: Optional[str] = None
    spotify_id: Optional[str] = None
    av_rating: Optional[float] = 0
    num_ratings: Optional[int] = 0
    tracks: str

    class Config:
        orm_mode = True