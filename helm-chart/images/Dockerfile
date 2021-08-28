FROM python:3.8
COPY . /deej-ai.online-app
WORKDIR "/deej-ai.online-app"
RUN apt update
RUN apt install ffmpeg libsndfile-dev nodejs npm -y
RUN npm install --global yarn
RUN rm -rf node_modules deejai.db
RUN yarn install
RUN pip install -r requirements-lock.txt
RUN sed -i 's|\(http\)[^/]*/[^/]*/[^/]*/|http://localhost:8080/|g' .env.production
RUN sed -i 's|\(http\)[^/]*/[^/]*/[^/]*/|http://localhost:8080/|g' backend/credentials.py
RUN yarn build
ENV APP_URL http://localhost:8080
ENV CUDA_VISIBLE_DEVICES ""
ENV SQLALCHEMY_DATABASE_URL mysql+pymysql://root:password@mysql:3306/deejai
CMD ["uvicorn", "backend.main:app", "--reload", "--port=80"]
EXPOSE 80
