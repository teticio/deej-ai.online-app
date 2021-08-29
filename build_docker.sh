#!/bin/sh
eval $(minikube -p minikube docker-env)
docker build . -f helm-chart/images/Dockerfile --build-arg APP_URL=${1-http://localhost:8080} -t teticio/deejai
