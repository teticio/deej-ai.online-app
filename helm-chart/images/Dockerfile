FROM python:3.8
COPY . /deej-ai.online-app
WORKDIR "/deej-ai.online-app"
RUN apt update
RUN apt install libsndfile1 nodejs npm -y
RUN npm install --global yarn
RUN rm -rf node_modules deejai.db
RUN yarn install
RUN pip install -r requirements-lock.txt
RUN sed -i 's@https://deej-ai.online@http://localhost:3000@g' .env.production
RUN sed -i 's@https://deej-ai.online@http://localhost:3000@g' backend/credentials.py
RUN yarn build
ENV APP_URL http://localhost:3000
ENV CUDA_VISIBLE_DEVICES ""
CMD ["uvicorn", "backend.main:app", "--reload", "--port=3000"]

# docker build . -f helm-chart/images/Dockerfile -t deejai
# docker run --rm --network="host" deejai