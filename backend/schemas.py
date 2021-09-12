"""Schemas for pydantic API calls.
"""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel  # pylint: disable=no-name-in-module


class NewPlaylist(BaseModel):  # pylint: disable=too-few-public-methods
    """Schema for generating a new playlist.
    """
    track_ids: list
    size: Optional[int] = 10
    creativity: Optional[float] = 0.5
    noise: Optional[float] = 0


class PlaylistName(BaseModel):  # pylint: disable=too-few-public-methods
    """Schema for updating playlist name.
    """
    id: int
    name: Optional[str] = 'Deej-A.I.'


class PlaylistRating(BaseModel):  # pylint: disable=too-few-public-methods
    """Schema for updating playlist rating.
    """
    id: int
    av_rating: float
    num_ratings: int


class PlaylistId(BaseModel):  # pylint: disable=too-few-public-methods
    """Schema for updating playlist Spotif playlist an2d user IDs.
    """
    id: int
    user_id: Optional[str] = None
    playlist_id: Optional[str] = None


class Playlist(BaseModel):  # pylint: disable=too-few-public-methods
    """Schema for storing a new playlist in the database.
    """
    name: Optional[str] = "Deej-A.I."
    created: datetime
    user_id: Optional[str] = ""
    playlist_id: Optional[str] = ""
    av_rating: Optional[float] = 0
    num_ratings: Optional[int] = 0
    track_ids: str
    tracks: Optional[str] = ""
    waypoints: Optional[str] = ""
    creativity: Optional[float] = 0.5
    noise: Optional[float] = 0
    