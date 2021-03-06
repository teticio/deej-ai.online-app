"""Define database models.
"""
import pickle
from hashlib import sha256
from sqlalchemy import Column, Float, Integer, String, DateTime

from .database import Base


class Playlist(Base):
    """Model for playlist table in the database.
    """
    __tablename__ = 'playlists'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(30), default="Deej-A.I.")
    created = Column(DateTime)
    user_id = Column(String(30), default='')
    playlist_id = Column(String(30), default='')
    av_rating = Column(Float, default=0)
    num_ratings = Column(Integer, default=0)
    track_ids = Column(String(3000))
    tracks = Column(String(8000), default='')
    waypoints = Column(String(150), default='')
    creativity = Column(Float, default=0.5)
    noise = Column(Float, default=0)
    uploads = Column(Integer, default=0)
    hash = Column(String(64), default=0, unique=True)

    @staticmethod
    def hash_it(target):
        """Generate unique hash based on playlist name, user_id, playlist_id,
           track_ids and waypoints

        Args:
            target (models.Playlist): [description]

        Returns:
            str: SHA256 digest.
        """
        blob = (target.name, target.user_id, target.playlist_id,
                target.track_ids, target.waypoints)
        return sha256(pickle.dumps(blob)).hexdigest()

    def __repr__(self):
        """Pretty print playlist object.
        """
        return f'<Playlist(id={self.id}, name={self.name}, hash={self.hash})>'
