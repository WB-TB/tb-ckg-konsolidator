#!/bin/bash

# Tambahkan repo Helm
helm repo add longhorn https://charts.longhorn.io
helm repo update

# Instal Longhorn
helm install longhorn longhorn/longhorn \
  --namespace longhorn-system \
  --create-namespace \
  --version 1.9.0