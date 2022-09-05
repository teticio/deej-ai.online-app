#!/usr/bin/env bash
APP_URL=http://localhost:3000 NO_CACHE=1 uvicorn backend.main:app --port=8001 &
backendPID=$!
pipenv run flake8 . \
    --count \
    --select=E9,F63,F7,F82 \
    --show-source \
    --statistics \
    --exclude=node_modules && \
pipenv run flake8 . \
    --count \
    --exit-zero \
    --max-complexity=10 \
    --max-line-length=127 \
    --statistics \
    --exclude=node_modules && \
export SQLALCHEMY_DATABASE_URL="sqlite:///:memory:" && \
export CUDA_VISIBLE_DEVICES="" && \
export NO_CACHE='1' && \
pipenv run pytest backend &&\
export CI=true && \
yarn test
kill $backendPID
