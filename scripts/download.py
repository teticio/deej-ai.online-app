"""Download artifacts needed for models to run from Google Drive.
"""
import os
import requests

from bs4 import BeautifulSoup

CHUNK_SIZE = 32768


def download_file_from_google_drive(file_id, destination, size):
    """Download file from Google Drive if not present.

    Args:
        file_id (str): Google Drive file id.
        destination (str): Download destination.
        size (int): Size of file in bytes.
    """
    if os.path.isfile(destination) and os.path.getsize(destination) == size:
        print(f'{destination} already exists')
        return
    print(f'Downloading {destination}')
    session = requests.Session()
    url = 'https://docs.google.com/uc'
    params = {'export': 'dowloand', 'id': file_id, 'confirm': 't'}
    response = session.get(url, params=params, stream=True)

    soup = BeautifulSoup(response.text, 'html.parser')
    form = soup.find('form')
    if form:
        url = form['action']
        inputs = form.find_all('input')
        params = {input['name']: input.get('value', '') for input in inputs if input.get('name')}
        response = session.get(url, params=params, stream=True)

    with open(destination, 'wb') as file:
        for chunk in response.iter_content(CHUNK_SIZE):
            if chunk:  # Filter out keep-alive new chunks
                file.write(chunk)
    if not os.path.isfile(destination) or os.path.getsize(destination) != size:
        print('Download failed')


if __name__ == '__main__':
    os.makedirs('model', exist_ok=True)
    download_file_from_google_drive('1Mg924qqF3iDgVW5w34m6Zaki5fNBdfSy',
                                    os.path.join('model', 'spotifytovec.p'),
                                    824046049)
    download_file_from_google_drive('1geEALPQTRBNUvkpI08B-oN4vsIiDTb5I',
                                    os.path.join('model', 'tracktovec.p'),
                                    438330031)
    download_file_from_google_drive('1Qre4Lkym1n5UTpAveNl5ffxlaAmH1ntS',
                                    os.path.join('model', 'spotify_tracks.p'),
                                    69208997)
    download_file_from_google_drive('1tLT_wmATWMC5UU-kERLsUNNcz0Vo19J3',
                                    os.path.join('model', 'spotify_urls.p'),
                                    155088622)
    download_file_from_google_drive('1LM1WW1GCGKeFD1AAHS8ijNwahqH4r4xV',
                                    os.path.join('model', 'speccy_model'),
                                    170401888)

    if not os.path.exists(os.path.join('backend', 'credentials.py')):
        print('Created dummy credentials file in backend/credentials.py')
        with open(os.path.join('backend', 'credentials.py'),
                  'wt',
                  encoding='utf8') as _file:
            _file.write("""# pylint: disable=missing-module-docstring
# flake8: noqa
# This file is also "sourced" from bash, so do not add spaces around "="
SPOTIFY_CLIENT_ID='<Your client ID>'
SPOTIFY_CLIENT_SECRET='<Your secret>'
SPOTIFY_REDIRECT_URI='<Your external webpage URL>/api/v1/callback'
""")
