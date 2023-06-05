"""Unit tests using pytest.
"""
import json
import asyncio
from datetime import datetime

from . import main
from . import schemas

db = main.SessionLocal()


def test_playlist_1():
    """Test joining the dots between two waypoints.
    """
    new_playlist = schemas.NewPlaylist(
        track_ids=["1O0xeZrBDbq7HPREdmYUYK", "1b7LMtXCXGc2EwOIplI35z"])
    assert asyncio.run(main.generate_playlist(new_playlist))['track_ids'] == [
        '1O0xeZrBDbq7HPREdmYUYK', '0JyCyKN7bG2z4EHN09nciG',
        '1CAO7hiNOxJRPW4nFv2aRO', '0moQVPOSwTaTeFFaRPH7ap',
        '4XcUADpOth9Wroq5EVMFJq', '23ObLnkIhZaM41ML4Hyg8u',
        '3QLRbcPezeE6FP5KRM1EvM', '38llcrfX1arUqrEe0DRRzW',
        '7pLPpTvMosiIheeOOr13TZ', '3bJdTkdwntcf7PT3NiUHKH',
        '6wXjxDLgVU6xHlupqiIAf3', '1b7LMtXCXGc2EwOIplI35z'
    ]


def test_playlist_2():
    """Test varying creativity.
    """
    new_playlist = schemas.NewPlaylist(track_ids=['7dEYcnW1YSBpiKofefCFCf'],
                                       size=20,
                                       creativity=0.1)
    assert asyncio.run(main.generate_playlist(new_playlist))['track_ids'] == [
        '7dEYcnW1YSBpiKofefCFCf', '5A4SGrOG20WpDhndWggzWC',
        '6FUxwe1CaTVbYodFSnBspP', '0tYXk4VOpa03GoZFDGXj28',
        '4bRQh0iVgAXnKgdWfTVDsd', '6LrPl1nylKSnNC1QZfKt6P',
        '5gR4tgz8hWNxOOKP4S2082', '1PlQoMb3iPgnBz0cp0lbAI',
        '0QgGueWsvOXjq3AnNRvTGq', '013h5m8bGW9opdh0vJf2Nv',
        '3TvWfyDcfNMBawO353CWgO', '7iTLhXr4Rs0RU1k2JEFTzZ',
        '0NHwaZ5w79FzhEUT9wzIXw', '5GbXS6bOXtjCbQUtw4hW82',
        '2DBK1d7wWcGTOtZCZ1Llzc', '5HMJupBqcCBfCmvP5Nc1lQ',
        '56KPYkBUA0GWxUQwMTJlNU', '76Fd8M61yOmMMTmMhKEUTh',
        '0cYK4Ddcrv9RFAV3wfUtwZ', '5JBmP6qfn4L83A13m1i2u3'
    ]


def test_search():
    """Test searching for tracks.
    """
    assert asyncio.run(main.search_tracks(string='hello', max_items=3)) == [{
        'track_id':
        '0tbhCoiQz53REV3AUZz7TX',
        'track':
        '!!! - Hello? Is This Thing On?'
    }, {
        'track_id':
        '2VaBYo1q2A9kHEIGit0FT8',
        'track':
        '!!! - Hello? Is This Thing On? (Thomas N’ Eric’s Rub and Tug Throwdown) - Mixed'
    }, {
        'track_id':
        '5yaH9nq2cEqeIXbiamL0fW',
        'track':
        '3mmy - Hello Cat'
    }]


def test_add_playlist():
    """Test adding playlist to the databsse.
    """
    new_playlist = schemas.NewPlaylist(track_ids=['7dEYcnW1YSBpiKofefCFCf'],
                                       size=10,
                                       creativity=0.)
    new_playlist = asyncio.run(main.generate_playlist(new_playlist))
    new_playlist = schemas.Playlist(created=datetime.now(),
                                    track_ids=json.dumps(
                                        new_playlist['track_ids']))
    main.create_playlist(new_playlist, db)
    assert (main.get_latest_playlists(1, db)[0].track_ids == json.dumps([
        "7dEYcnW1YSBpiKofefCFCf", "5A4SGrOG20WpDhndWggzWC",
        "6FUxwe1CaTVbYodFSnBspP", "0tYXk4VOpa03GoZFDGXj28",
        "4bRQh0iVgAXnKgdWfTVDsd", "6LrPl1nylKSnNC1QZfKt6P",
        "1PlQoMb3iPgnBz0cp0lbAI", "5gR4tgz8hWNxOOKP4S2082",
        "013h5m8bGW9opdh0vJf2Nv", "0QgGueWsvOXjq3AnNRvTGq"
    ]))


def test_update_playlist():
    """Test updating an existing playlist. Assumes test_add_playlist has already been run.
    """
    playlist_id = main.get_latest_playlists(1, db)[0].id
    playlist_name = schemas.PlaylistName(id=playlist_id, name='Test')
    main.update_playlist_name(playlist_name, db)
    playlist_rating = schemas.PlaylistRating(id=playlist_id,
                                             av_rating=4.5,
                                             num_ratings=1)
    main.update_playlist_rating(playlist_rating, db)
    playlist = main.get_playlist(playlist_id, db)
    assert (playlist.name == 'Test' and playlist.av_rating == 4.5
            and playlist.num_ratings == 1)


def test_search_similar():
    """Test searching for a similar sounding track.
    """
    assert asyncio.run(
        main.search_similar_tracks(
            url='https://p.scdn.co/mp3-preview'
            '/04b28b12174a4c4448486070962dae74494c0f70?'
            'cid=194086cb37be48ebb45b9ba4ce4c5936',
            max_items=10)) == [{
                'track': 'Emily Roberts - In This Together',
                'track_id': '4vSVqPMIHi0Brmv3uS0UJF'
            }, {
                'track': 'Luis Fonsi - Despacito',
                'track_id': '6habFhsOp2NvshLv26DqMb'
            }, {
                'track': 'Morgan Sulele - Seriøst (feat. Admiral P)',
                'track_id': '6nIoVkKodp1UX5rHQvqE5G'
            }, {
                'track': 'Alexandra Joner - Bottoms Up',
                'track_id': '0zpv4XzaN6uMEBAIZvD9dz'
            }, {
                'track': 'NGHTMRE - Wrist',
                'track_id': '616cbA6RE0erFWHfzbYj5g'
            }, {
                'track': 'Lt. Stitchie - Dem No Good',
                'track_id': '4UehXb6021WcsH3HfNFrYs'
            }, {
                'track': 'Michael Calfan - Body',
                'track_id': '4hFyPSsdp4d7ywbxxknKqo'
            }, {
                'track': 'Daniel Blume - Kardashian',
                'track_id': '5sJWJ132Ya4i2xR5cW0B6a'
            }, {
                'track': 'Rihanna - Phresh Out The Runway',
                'track_id': '2qJeiWIZhb3FqREoDPPFPu'
            }, {
                'track': 'Lali - Sin Querer Queriendo (feat. Mau y Ricky)',
                'track_id': '5rUNrHC5b0oYanaw370Ncz'
            }]
