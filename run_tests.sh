#!/bin/sh
export SQLALCHEMY_DATABASE_URL="sqlite:///:memory:"
export CUDA_VISIBLE_DEVICES=""
pipenv run "pytest backend"
export CI=true
yarn test