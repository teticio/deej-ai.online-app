#!/bin/sh
eval $(minikube -p minikube docker-env)
docker build . -f helm-chart/images/Dockerfile -t teticio/deejai
