"""Connect to database.
"""
import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy_utils import database_exists, create_database

SQLALCHEMY_DATABASE_URL = os.environ.get('SQLALCHEMY_DATABASE_URL',
                                         'sqlite:///./deejai.db')
engine = create_engine(SQLALCHEMY_DATABASE_URL,
                       connect_args={'check_same_thread': False}
                       if 'sqlite' in SQLALCHEMY_DATABASE_URL else {})
if not database_exists(engine.url):  # Needed for MySql
    create_database(engine.url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
