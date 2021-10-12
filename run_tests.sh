#!/bin/sh
pipenv run flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics && \
pipenv run flake8 . --count --exit-zero --max-complexity=10 --max-line-length=127 --statistics && \
export SQLALCHEMY_DATABASE_URL="sqlite:///:memory:" && \
export CUDA_VISIBLE_DEVICES="" && \
export NO_CACHE='1' && \
pipenv run "pytest backend" &&\
export CI=true && \
yarn test
