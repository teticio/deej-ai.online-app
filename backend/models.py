import pickle
from hashlib import sha256
from .database import Base
from sqlalchemy import Column, Float, Integer, String, DateTime


class Playlist(Base):
    __tablename__ = "playlists"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(30), default="Deej-A.I.")
    created = Column(DateTime)
    user_id = Column(String(30), default="")
    playlist_id = Column(String(30), default="")
    av_rating = Column(Float, default=0)
    num_ratings = Column(Integer, default=0)
    track_ids = Column(String(3000))
    tracks = Column(String(8000), default="")
    waypoints = Column(String(150), default="")
    creativity = Column(Float, default=0.5)
    noise = Column(Float, default=0)
    hash = Column(String(64), default=0, unique=True)

    def hash_it(target):
        blob = (target.name, target.user_id, target.playlist_id,
                target.av_rating, target.num_ratings, target.track_ids,
                target.waypoints)
        return sha256(pickle.dumps(blob)).hexdigest()

    def __repr__(self):
        return "<Playlist(id='%d', name='%s', hash='%s')>" % (
            self.id, self.name, self.hash)
