#!/usr/bin/env bash
eval $(minikube -p minikube docker-env)
docker build . \
  --file helm-chart/images/Dockerfile \
  --tag teticio/deejai
