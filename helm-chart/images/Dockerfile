FROM python:3.8
ENV APP_URL=http://localhost:8080
ENV CUDA_VISIBLE_DEVICES ""
ENV SQLALCHEMY_DATABASE_URL mysql+pymysql://root:password@mysql:3306/deejai
COPY . /deej-ai.online-app
WORKDIR "/deej-ai.online-app"
RUN sed -i "s|\(http\)[^/]*/[^/]*/[^/]*/|${APP_URL}/|g" .env.production && \
    sed -i "s|\(http\)[^/]*/[^/]*/[^/]*/|${APP_URL}/|g" backend/credentials.py
RUN apt update && \
    apt install ffmpeg libsndfile-dev nodejs npm -y
RUN npm install --global yarn && \
    rm -rf node_modules deejai.db && \
    yarn install && \
    yarn build && \
    pip install -r requirements-lock.txt
CMD ["uvicorn", "backend.main:app", "--reload", "--host=0.0.0.0"]
EXPOSE 8000
