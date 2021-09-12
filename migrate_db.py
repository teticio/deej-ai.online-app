"""Migrate from one database to another.

   Usage: python migrate.py <FROM_DATABASE_URL> <TO_DATABASE_URL>
"""
import logging
import argparse

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, class_mapper
from sqlalchemy_utils import database_exists, create_database

from backend import models

logging.basicConfig(format='%(levelname)s:%(message)s', level=logging.INFO)


def copy_objects(db_from, db_to, cls):
    """Copy all items in a table from one databse to another.

    Args:
        db_from (Session): SQLAlchemy session of databsse to copy from.
        db_to (Session): SQLAlchemy session of databsse to copy to.
        cls (type): Class of table schema.
    """
    db_to_items = []
    db_items = db_from.query(cls)
    mapper = class_mapper(cls)
    for db_item in db_items:
        db_to_item = cls()
        for _ in mapper.iterate_properties:
            setattr(db_to_item, _.key, getattr(db_item, _.key))
        db_to_items.append(db_to_item)
    db_to.bulk_save_objects(db_to_items)
    db_to.commit()
    logging.info("Migrated %d %s", len(db_to_items), cls)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description="Migrate from one database to another.")
    parser.add_argument('from_database_url',
                        type=str,
                        help="URL for the database you want to migrate from")
    parser.add_argument('to_database_url',
                        type=str,
                        help="URL for the database you want to migrate to")
    args = parser.parse_args()

    from_engine = create_engine(args.from_database_url,
                                connect_args={'check_same_thread': False}
                                if 'sqlite' in args.from_database_url else {})
    to_engine = create_engine(args.to_database_url,
                              connect_args={'check_same_thread': False}
                              if 'sqlite' in args.to_database_url else {})
    if not database_exists(to_engine.url):  # needed for MySql
        create_database(to_engine.url)
    FromSessionLocal = sessionmaker(autocommit=False,
                                    autoflush=False,
                                    bind=from_engine)
    ToSessionLocal = sessionmaker(autocommit=False,
                                  autoflush=False,
                                  bind=to_engine)

    models.Base.metadata.drop_all(bind=to_engine,
                                  tables=[models.Playlist.__table__])
    models.Base.metadata.create_all(bind=to_engine)

    copy_objects(FromSessionLocal(), ToSessionLocal(), models.Playlist)
