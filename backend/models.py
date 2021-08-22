from .database import Base
from sqlalchemy import UniqueConstraint, Column, Float, Integer, String, DateTime


class Playlist(Base):
    __tablename__ = "playlists"
    __table_args__ = (UniqueConstraint('name', 'user_id', 'playlist_id',
                                       'av_rating', 'num_ratings', 'track_ids',
                                       'tracks', 'waypoints'), )
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="Deej-A.I.")
    created = Column(DateTime)
    user_id = Column(String, default="")
    playlist_id = Column(String, default="")
    av_rating = Column(Float, default=0)
    num_ratings = Column(Integer, default=0)
    track_ids = Column(String)
    tracks = Column(String, default="")
    waypoints = Column(String, default="")
    creativity = Column(Float, default=0.5)
    noise = Column(Float, default=0)
