#!/bin/sh
yarn build
cd backend
pipenv run "pytest ."
