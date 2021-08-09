from .database import Base
from sqlalchemy import Column, Float, Integer, String, DateTime


class Playlist(Base):
    __tablename__ = "playlists"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="Deej-A.I.")
    created = Column(DateTime)
    spotify_user = Column(String, default="")
    spotify_id = Column(String, default="")
    av_rating = Column(Float, default=0)
    num_ratings = Column(Integer, default=0)
    tracks = Column(String)
