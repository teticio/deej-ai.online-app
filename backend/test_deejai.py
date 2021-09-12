"""Unit tests using pytest.
"""
import os
import json
import asyncio
from datetime import datetime

import pytest  # pylint: disable=unused-import

from . import main
from . import schemas

os.environ["SQLALCHEMY_DATABASE_URL"] = "sqlite:///./deejai-test.db"
if os.path.exists('deejai-test.db'):
    os.remove('deejai-test.db')

db = main.SessionLocal()


def test_playlist_1():
    """Test joining the dots between two waypoints.
    """
    new_playlist = schemas.NewPlaylist(
        track_ids=["1O0xeZrBDbq7HPREdmYUYK", "1b7LMtXCXGc2EwOIplI35z"])
    assert asyncio.run(main.generate_playlist(new_playlist))['track_ids'] == [
        "1O0xeZrBDbq7HPREdmYUYK", "6Y0ed41KYLRnJJyYGGaDgY",
        "5yrsBzgHkfu2idkl2ILQis", "6yXcmVKGjFofPWvW9ustQX",
        "1DKyFVzIh1oa1fFnEmTkIl", "6b8hjwuGl1H9o5ZbrHJcpJ",
        "5qRJD1yaLJ5s0J3JpbgnwA", "6kotXaSQaGYxE62hVpdHWu",
        "4lrQv8z3qq1Rl8bsc0Qy0y", "2nmaEzFZrSm2aMLtfJDzyG",
        "3PPDUkGHUJx2bxct6A3PBy", "1b7LMtXCXGc2EwOIplI35z"
    ]


def test_playlist_2():
    """Test varying creativity.
    """
    new_playlist = schemas.NewPlaylist(track_ids=["7dEYcnW1YSBpiKofefCFCf"],
                                       size=20,
                                       creativity=0.1)
    assert asyncio.run(main.generate_playlist(new_playlist))['track_ids'] == [
        "7dEYcnW1YSBpiKofefCFCf", "7u9szLn7CWcWtiYcRLy0Ab",
        "34QkdRnLmpTp3GemmSXPkz", "0sQ9MCD0ichtBCSi8Khn3h",
        "0hwEeMnAgwEvClAXOl3Sgh", "63Iv8NhccFc2qXgIsrDo4Q",
        "1gMDcG1YDw5Ib1BS8Op9S3", "2hq28hLmCPFxg2FamW6KA3",
        "6K6rqLZ7PBDx3PNA4snQzK", "6ODS67X5qVcK29FnNoFdDh",
        "0SzvtL65Itcs1wZrQI7hf6", "0drokAUhKfiMnu20UKQnFZ",
        "7uoRp3NMtZORvxOI16Vr4u", "4x8vLLF0UI953H5Z0p2Rwo",
        "0ZRroF8QnXbmEb1VRcqZnR", "3HdrN4xHTPhxQGdTSo2spQ",
        "0jikR0eJKtOF504fKD2tyi", "41QEnBlGuGnos5no5qGKBy",
        "4tXRVDlgAhxuEmsxuW4oiQ", "4fGz81hlNLXwzO3L8GGaop"
    ]


def test_search():
    """Test searching for tracks.
    """
    assert asyncio.run(main.search_tracks(string='hello', max_items=3)) == [{
        'track_id':
        '6BbTfV6NXacNelIcVLXu9t',
        'track':
        '1takejay - Hello'
    }, {
        'track_id':
        '4EtaPmMHMtjcx3FJhKzbZv',
        'track':
        '86 - Peng Ting Hello'
    }, {
        'track_id':
        '6g0v0NzLaCtvqDSwWny6CV',
        'track':
        'A Day To Remember - You Had Me @ Hello'
    }]


def test_add_playlist():
    """Test adding playlist to the databsse.
    """
    new_playlist = schemas.NewPlaylist(track_ids=["7dEYcnW1YSBpiKofefCFCf"],
                                       size=10,
                                       creativity=0.)
    new_playlist = asyncio.run(main.generate_playlist(new_playlist))
    new_playlist = schemas.Playlist(created=datetime.now(),
                                    track_ids=json.dumps(
                                        new_playlist['track_ids']))
    main.create_playlist(new_playlist, db)
    assert (main.get_latest_playlists(1, db)[0].track_ids == json.dumps([
        "7dEYcnW1YSBpiKofefCFCf", "66LPSGwq2MKuFLSjAnclmg",
        "1Ulk1RYwszH5PliccyN5pF", "3ayr466SicYLcMRSCuiOSL",
        "6ijkogEt87TOoFEUdTpYxD", "2hq28hLmCPFxg2FamW6KA3",
        "4ClVhgWezpuyGhACLGBkEA", "0SzvtL65Itcs1wZrQI7hf6",
        "5bPjleBV2VtjRnc0ogJ5ib", "4tXRVDlgAhxuEmsxuW4oiQ"
    ]))


def test_update_playlist():
    """Test updating an existing playlist. Assumes test_add_playlist has already been run.
    """
    playlist_id = main.get_latest_playlists(1, db)[0].id
    playlist_name = schemas.PlaylistName(id=playlist_id, name="Test")
    main.update_playlist_name(playlist_name, db)
    playlist_rating = schemas.PlaylistRating(id=playlist_id,
                                             av_rating=4.5,
                                             num_ratings=1)
    main.update_playlist_rating(playlist_rating, db)
    playlist = main.get_playlist(playlist_id, db)
    assert (playlist.name == "Test" and playlist.av_rating == 4.5
            and playlist.num_ratings == 1)


def test_search_similar():
    """Test searching for a similar sounding track.
    """
    assert asyncio.run(
        main.search_similar_tracks(
            url=
            "https://p.scdn.co/mp3-preview/04b28b12174a4c4448486070962dae74494c0f70?" \
            "cid=194086cb37be48ebb45b9ba4ce4c5936",
            max_items=10)) == [{
                "track_id": "1a9SiOELQS7YsBQwdEPMuq",
                "track": "Luis Fonsi - Despacito"
            }, {
                "track_id": "6rPO02ozF3bM7NnOV4h6s2",
                "track": "Luis Fonsi - Despacito - Remix"
            }, {
                "track_id": "5AgTL2WmiCvoObA8fpncKs",
                "track": "Luis Fonsi - Despacito"
            }, {
                "track_id": "7dx0Funwrd0LRvquDFQ8fv",
                "track": "Cali Y El Dandee - Lumbra"
            }, {
                "track_id":
                "7CUYHcu0RnbOnMz4RuN07w",
                "track":
                "Luis Fonsi - Despacito (Featuring Daddy Yankee)"
            }, {
                "track_id": "2YFOm3hznEzQsIMmEwGyUg",
                "track": "Leon - Legalna"
            }, {
                "track_id": "1tJw60G9KHl7fYVdQ2JDgo",
                "track": "J Balvin - Ginza - Remix"
            }, {
                "track_id": "1v3fyyGJRlblbobabiXxIs",
                "track": "Latifah - On My Way"
            }, {
                "track_id": "3jWfGOOUffq51fWGQdPV68",
                "track": "Achille Lauro - Non sei come me"
            }, {
                "track_id": "2HR9Ih2IjpGEQ3YZl7aRUQ",
                "track": "Jeano - Abow"
            }]
