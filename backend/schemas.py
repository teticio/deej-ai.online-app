from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class Search(BaseModel):
    string: str
    max_items: Optional[int] = 100


class NewPlaylist(BaseModel):
    track_ids: list
    size: Optional[int] = 10
    creativity: Optional[float] = 0.5
    noise: Optional[float] = 0
    seed: Optional[int] = None


class PlaylistName(BaseModel):
    id: int
    name: Optional[str] = 'Deej-A.I.'


class PlaylistRating(BaseModel):
    id: int
    av_rating: float
    num_ratings: int


class PlaylistId(BaseModel):
    id: int
    user_id: Optional[str] = None
    playlist_id: Optional[str] = None


class Playlist(BaseModel):
    name: Optional[str] = "Deej-A.I."
    created: datetime
    user_id: Optional[str] = None
    playlist_id: Optional[str] = None
    av_rating: Optional[float] = 0
    num_ratings: Optional[int] = 0
    track_ids: str
    tracks: Optional[str] = None
    waypoints: Optional[str] = None


class SearchPlaylists(BaseModel):
    string: str
    max_items: Optional[int] = 10
