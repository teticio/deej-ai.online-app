#!/usr/bin/env bash
yarn build
pipenv run -- tmux new-session -d -s deejai 'CUDA_VISIBLE_DEVICES="" APP_URL=https://deej-ai.online EMBEDDINGS_MODEL=jepa HACKINTOSH=1 uvicorn backend.main:app --reload'
