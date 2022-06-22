"""Download artifacts needed for models to run from Google Drive.
"""
import os
import requests

CHUNK_SIZE = 32768


def download_file_from_google_drive(file_id, destination, size):
    """Download file from Google Drive if not present.

    Args:
        file_id (str): Google Drive file id.
        destination (str): Download destination.
    """
    if os.path.isfile(destination) and os.path.getsize(destination) == size:
        return
    print(f'Downloading {destination}')
    url = 'https://docs.google.com/uc?export=download'
    session = requests.Session()
    response = session.get(url,
                           params={
                               'id': file_id,
                               'confirm': 't'
                           },
                           stream=True)
    token = get_confirm_token(response)
    if token:
        params = {'id': file_id, 'confirm': token}
        response = session.get(url, params=params, stream=True)
    save_response_content(response, destination)
    if not os.path.isfile(destination) or os.path.getsize(destination) != size:
        print('Download failed')


def get_confirm_token(response):
    """Get confirmation token.
    """
    for key, value in response.cookies.items():
        if key.startswith('download_warning'):
            return value
    return None


def save_response_content(response, destination):
    """Save response content.
    """
    with open(destination, 'wb') as file:
        for chunk in response.iter_content(CHUNK_SIZE):
            if chunk:  # Filter out keep-alive new chunks
                file.write(chunk)


if __name__ == '__main__':
    download_file_from_google_drive('1Mg924qqF3iDgVW5w34m6Zaki5fNBdfSy',
                                    'spotifytovec.p', 157907310)
    download_file_from_google_drive('1geEALPQTRBNUvkpI08B-oN4vsIiDTb5I',
                                    'tracktovec.p', 157907310)
    download_file_from_google_drive('1Qre4Lkym1n5UTpAveNl5ffxlaAmH1ntS',
                                    'spotify_tracks.p', 23264992)
    download_file_from_google_drive('1tLT_wmATWMC5UU-kERLsUNNcz0Vo19J3',
                                    'spotify_urls.p', 43335116)
    download_file_from_google_drive('1LM1WW1GCGKeFD1AAHS8ijNwahqH4r4xV',
                                    'speccy_model', 170408640)

    if not os.path.exists(os.path.join('backend', 'credentials.py')):
        with open(os.path.join('backend', 'credentials.py'),
                  'wt',
                  encoding='utf8') as _file:
            _file.write("""CLIENT_ID = '<Your client ID>'
CLIENT_SECRET = '<Your secret>'
REDIRECT_URL = '<Your external webpage URL>/api/v1/callback'
""")
