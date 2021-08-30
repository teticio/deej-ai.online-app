#!/bin/sh
eval $(minikube -p minikube docker-env)
docker build . \
  --file helm-chart/images/Dockerfile \
  --tag teticio/deejai \
  --build-arg APP_URL=${1-http://localhost:8080}  
