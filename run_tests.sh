#!/bin/sh
yarn build
export SQLALCHEMY_DATABASE_URL=sqlite:///:memory:
export CUDA_VISIBLE_DEVICES=""
pipenv run "pytest backend"
