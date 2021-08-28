#!/bin/sh
helm uninstall deejai -n deejai
helm upgrade --install deejai helm-chart/deejai --create-namespace -n deejai --values helm-chart/deejai/values.yaml
