FROM python:3.8
# ARG APP_URL
# ENV SPOTIFY_REDIRECT_URI $APP_URL/api/v1/callback
# ENV REACT_APP_API_URL $APP_URL/api/v1
ENV CUDA_VISIBLE_DEVICES ""
COPY . /deej-ai.online-app
WORKDIR "/deej-ai.online-app"
RUN apt update && \
    apt install ffmpeg nodejs npm -y
RUN npm install --global yarn && \
    rm -rf node_modules deejai.db && \
    yarn install && \
    yarn build && \
    pip install -r requirements-lock.txt
CMD yarn build && uvicorn backend.main:app --host=0.0.0.0
EXPOSE 8000
