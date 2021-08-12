import json
import pytest
import asyncio
from .main import *
from . import schemas
from datetime import datetime

db = SessionLocal()


def test_playlist_1():
    new_playlist = schemas.NewPlaylist(
        tracks=["1O0xeZrBDbq7HPREdmYUYK", "1b7LMtXCXGc2EwOIplI35z"])
    assert asyncio.run(playlist(new_playlist)) == [
        "1O0xeZrBDbq7HPREdmYUYK", "6Y0ed41KYLRnJJyYGGaDgY",
        "5yrsBzgHkfu2idkl2ILQis", "4oW1lGOw5Q5OLvoJv92qoE",
        "1DKyFVzIh1oa1fFnEmTkIl", "6yXcmVKGjFofPWvW9ustQX",
        "5qRJD1yaLJ5s0J3JpbgnwA", "6b8hjwuGl1H9o5ZbrHJcpJ",
        "4lrQv8z3qq1Rl8bsc0Qy0y", "6kotXaSQaGYxE62hVpdHWu",
        "3PPDUkGHUJx2bxct6A3PBy", "1b7LMtXCXGc2EwOIplI35z"
    ]


def test_playlist_2():
    new_playlist = schemas.NewPlaylist(tracks=["7dEYcnW1YSBpiKofefCFCf"],
                                       size=20,
                                       creativity=0.1)
    assert asyncio.run(playlist(new_playlist)) == [
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
    search = schemas.Search(string='hello', max_items=3)
    assert asyncio.run(search_tracks(search)) == [{
        'id': '6BbTfV6NXacNelIcVLXu9t',
        'track': '1takejay - Hello'
    }, {
        'id':
        '4EtaPmMHMtjcx3FJhKzbZv',
        'track':
        '86 - Peng Ting Hello'
    }, {
        'id':
        '6g0v0NzLaCtvqDSwWny6CV',
        'track':
        'A Day To Remember - You Had Me @ Hello'
    }]


def test_add_playlist():
    new_playlist = schemas.NewPlaylist(tracks=["7dEYcnW1YSBpiKofefCFCf"],
                                       size=10,
                                       creativity=0.)
    new_playlist = asyncio.run(playlist(new_playlist))
    new_playlist = schemas.Playlist(created=datetime.now(),
                                    tracks=json.dumps(new_playlist))
    create_playlist(new_playlist, db)
    assert (get_latest_playlists(1, db)[0].tracks == json.dumps([
        "7dEYcnW1YSBpiKofefCFCf", "66LPSGwq2MKuFLSjAnclmg",
        "1Ulk1RYwszH5PliccyN5pF", "3ayr466SicYLcMRSCuiOSL",
        "6ijkogEt87TOoFEUdTpYxD", "2hq28hLmCPFxg2FamW6KA3",
        "4ClVhgWezpuyGhACLGBkEA", "0SzvtL65Itcs1wZrQI7hf6",
        "5bPjleBV2VtjRnc0ogJ5ib", "4tXRVDlgAhxuEmsxuW4oiQ"
    ]))


# assumes test_add_playlist has already been run
def test_update_playlist():
    id = get_latest_playlists(1, db)[0].id
    playlist_name = schemas.PlaylistName(id=id, name="Test")
    update_playlist_name(playlist_name, db)
    playlist_rating = schemas.PlaylistRating(id=id,
                                             av_rating=4.5,
                                             num_ratings=1)
    update_playlist_rating(playlist_rating, db)
    playlist = get_playlist(id, db)
    assert (playlist.name == "Test" and playlist.av_rating == 4.5
            and playlist.num_ratings == 1)
