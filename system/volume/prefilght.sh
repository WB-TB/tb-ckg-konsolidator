#!/bin/bash

EXEC=/tmp/longhornctl
ARCH=$(hostnamectl status|grep Architecture|cut -d' ' -f6)
if [ "$ARCH" == "x86-64" ]; then
    ARCH="amd64"
fi

curl -sSfL -o $EXEC https://github.com/longhorn/cli/releases/download/v1.9.0/longhornctl-linux-$ARCH
chmod +x $EXEC
$EXEC check preflight