#!/bin/bash

USER=${1:-longhorn}
PASSWORD=${2:-adminlonghorn}
echo "${USER}:$(openssl passwd -stdin -apr1 <<< ${PASSWORD})" > auth

kubectl -n longhorn-system create secret generic basic-auth --from-file=auth

kubectl -n longhorn-system apply -f longhorn-ui-ingress.yaml