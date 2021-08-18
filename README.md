# Deej-A.I. React App

This is the source code for my webpage which is hosted at https://deej-ai.online/. If you are interested in the deep learning models that are used in the backend, have a look at my other repo https://github.com/teticio/Deej-A.I./.

In order to run this, you wil need to create a `credentials.py` file in the `backend` directory with your Spotify Developer API credentials, which can be obtained from https://developer.spotify.com/dashboard/login. You will also need to download the following files to the root directory:

* `https://drive.google.com/file/d/1geEALPQTRBNUvkpI08B-oN4vsIiDTb5I/view?usp=sharing`
* `https://drive.google.com/file/d/1Mg924qqF3iDgVW5w34m6Zaki5fNBdfSy/view?usp=sharing`
* `https://drive.google.com/file/d/16JKjDGW2BMP-0KKJLFvwRvJdKhwukBeB/view?usp=sharing`
* `https://drive.google.com/file/d/1LM1WW1GCGKeFD1AAHS8ijNwahqH4r4xV/view?usp=sharing`

You should also set `REACT_APP_API_URL` in `.env.production` to point to the external URL where you are hosting the web app. The `redirect_uri` in your Developer API account needs to be set to `<REACT_APP_API_URL>\callback` for the Spotify authentication flow to work.

If you have `pipenv` and `yarn` already installed you can then type

`.\install.sh`

and

`.\run.sh`

(In Windows, you will either have to run these commands in a Git Bash shell, or adapt the scripts as appropriate). As a final step, you can then set up a reverse proxy to `http://localhost:8000/`.