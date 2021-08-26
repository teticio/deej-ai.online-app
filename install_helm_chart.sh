#!/bin/sh
helm uninstall deejai -n deejai
kubectl create namespace deejai
helm install deejai helm-chart/deejai -n deejai --values helm-chart/deejai/values.yaml
