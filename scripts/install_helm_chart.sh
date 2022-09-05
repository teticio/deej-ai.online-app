#!/usr/bin/env bash
helm uninstall deejai -n deejai
kubectl delete namespace deejai
export $(grep -v '^#' backend/credentials.py | xargs)
helm upgrade \
  --install deejai helm-chart/deejai \
  --create-namespace \
  --namespace deejai \
  --values helm-chart/deejai/values.yaml \
  --set app.url=http://localhost:8080 \
  --set mysqlRootPassword=password \
  --set spotifyClientId=$SPOTIFY_CLIENT_ID \
  --set spotifyClientSecret=$SPOTIFY_CLIENT_SECRET
