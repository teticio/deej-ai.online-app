#!/usr/bin/env bash
yarn build
export APP_URL=https://deej-ai.online
export CUDA_VISIBLE_DEVICES=""
pipenv run -- uvicorn backend.main:app --reload
