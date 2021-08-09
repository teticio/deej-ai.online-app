import pytest
import asyncio
from main import search_tracks, Search
from main import create_playlist, Playlist


def test_playlist_1():
    playlist = Playlist(
        tracks=["21QIUV4JxFRym3XDhUxO52", "0rTkE0FmT4zT2xL6GXwosU"])
    assert asyncio.run(create_playlist(playlist)) == [
        "21QIUV4JxFRym3XDhUxO52", "3pqRRxH5x9oVPwh9i9UFZA",
        "62GSnbTt2ZpLCNbmtq1NLN", "1XOPuXMpoo2gQ3LNRr4IJq",
        "5e30YC94NPxaxNunhAsQZp", "3ZClafX6fRAkQjo8Pldq37",
        "3UD4sghkq8dHUwvKxln1nB", "2hEwjc5DZVPcC4cVVBuMr5",
        "61w1Ry5X8UUsbNoPG7zRP1", "1INWPr855fwWdAOeecbu0W",
        "6yqThFsiJG2jUEA6jdhruE", "0rTkE0FmT4zT2xL6GXwosU"
    ]


def test_playlist_2():
    playlist = Playlist(tracks=["21QIUV4JxFRym3XDhUxO52"])
    assert asyncio.run(create_playlist(playlist)) == [
        "21QIUV4JxFRym3XDhUxO52", "4ZaaR70axeHwTnZ90BEmQy",
        "62GSnbTt2ZpLCNbmtq1NLN", "5WO4u8XmvXocAsK9rIMTwJ",
        "4QyTAToGczngpDZBhlU7AJ", "6SApDiUzGpwgsWsdEvIKnS",
        "6ywkWCLbtW0dNw1IfVCW8F", "3JnCoJcz2aWFuGMDxWYG5d",
        "5igni06exn4vGL8zVvT5yk", "3agKh63j5o6i4kq8zNEGLg"
    ]


def test_search():
    search = Search(string='hello', max_items=3)
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
