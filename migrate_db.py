import logging
import argparse
from backend import models
from sqlalchemy import event
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, class_mapper
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy_utils import database_exists, create_database

logging.basicConfig(format="%(levelname)s:%(message)s", level=logging.INFO)


def copy_objects(db_from, db_to, cls):
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
    logging.info(f"Migrated {len(db_to_items)} {cls}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Migrate from one database to another.")
    parser.add_argument("from_database_url",
                        type=str,
                        help="URL for the database you want to migrate from")
    parser.add_argument("to_database_url",
                        type=str,
                        help="URL for the database you want to migrate to")
    args = parser.parse_args()

    from_engine = create_engine(args.from_database_url,
                                connect_args={"check_same_thread": False}
                                if "sqlite" in args.from_database_url else {})
    to_engine = create_engine(args.to_database_url,
                              connect_args={"check_same_thread": False}
                              if "sqlite" in args.to_database_url else {})
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
    db_from = FromSessionLocal()
    db_to = ToSessionLocal()

    copy_objects(db_from, db_to, models.Playlist)
