#!/bin/sh
yarn build
pipenv run "pytest backend"
