#!/bin/sh
yarn build
export SQLALCHEMY_DATABASE_URL=sqlite:///:memory:
pipenv run "pytest backend"
