#!/bin/sh
eval $(minikube -p minikube docker-env)
docker build . \
  --file helm-chart/images/Dockerfile \
  --tag teticio/deejai
