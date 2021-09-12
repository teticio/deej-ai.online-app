import os
import requests


def download_file_from_google_drive(id, destination):
    if os.path.isfile(destination):
        return None
    print(f'Downloading {destination}')
    URL = 'https://docs.google.com/uc?export=download'
    session = requests.Session()
    response = session.get(URL, params={'id': id}, stream=True)
    token = get_confirm_token(response)
    if token:
        params = {'id': id, 'confirm': token}
        response = session.get(URL, params=params, stream=True)
    save_response_content(response, destination)


def get_confirm_token(response):
    for key, value in response.cookies.items():
        if key.startswith('download_warning'):
            return value
    return None


def save_response_content(response, destination):
    CHUNK_SIZE = 32768
    with open(destination, 'wb') as f:
        for chunk in response.iter_content(CHUNK_SIZE):
            if chunk:  # filter out keep-alive new chunks
                f.write(chunk)


if __name__ == '__main__':
    download_file_from_google_drive('1Mg924qqF3iDgVW5w34m6Zaki5fNBdfSy',
                                    'spotifytovec.p')
    download_file_from_google_drive('1geEALPQTRBNUvkpI08B-oN4vsIiDTb5I',
                                    'tracktovec.p')
    download_file_from_google_drive('1Qre4Lkym1n5UTpAveNl5ffxlaAmH1ntS',
                                    'spotify_tracks.p')
    download_file_from_google_drive('1LM1WW1GCGKeFD1AAHS8ijNwahqH4r4xV',
                                    'speccy_model')
    if not os.path.exists(os.path.join('backend', 'credentials.py')):
        with open(os.path.join('backend', 'credentials.py'), 'wt') as file:
            file.write("""CLIENT_ID = '<Your client ID>'
CLIENT_SECRET = '<Your secret>'
REDIRECT_URL = '<Your external webpage URL>/api/v1/callback'
""")
