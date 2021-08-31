#!/bin/sh
helm uninstall deejai -n deejai
kubectl delete namespace deejai
helm upgrade \
  --install deejai helm-chart/deejai \
  --create-namespace \
  --namespace deejai \
  --values helm-chart/deejai/values.yaml \
  --set mysqlRootPassword=password
