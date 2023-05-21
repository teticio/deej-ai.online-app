#!/usr/bin/env bash
yarn build
export APP_URL=https://deej-ai.online
export CUDA_VISIBLE_DEVICES=""
pipenv run -- tmux new-session -d -s deejai uvicorn backend.main:app --reload
