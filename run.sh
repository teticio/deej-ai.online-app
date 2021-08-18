#!/bin/sh
yarn build
export APP_URL=http://localhost:8000
export CUDA_VISIBLE_DEVICES=""
pipenv run -- uvicorn backend.main:app --reload
