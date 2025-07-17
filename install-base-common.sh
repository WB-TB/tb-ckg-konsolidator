#!/bin/bash

# Check if the script is running as root (EUID is 0)
if [[ $EUID -ne 0 ]]; then
   echo "Error: This script must be run with root privileges (e.g., using sudo)." >&2
   exit 1
fi

NODE_IP=$(ip addr show ens160 | grep 'inet ' | awk '{print $2}'|cut -d'/' -f1)

# Get the absolute path of the script
SCRIPT_PATH="${BASH_SOURCE[0]}"

# Resolve any symbolic links and get the true path
while [ -L "${SCRIPT_PATH}" ]; do
  SCRIPT_DIR="$(cd -P "$(dirname "${SCRIPT_PATH}")" >/dev/null 2>&1 && pwd)"
  SCRIPT_PATH="$(readlink "${SCRIPT_PATH}")"
  [[ ${SCRIPT_PATH} != /* ]] && SCRIPT_PATH="${SCRIPT_DIR}/${SCRIPT_PATH}"
done

# Get the directory of the script
SCRIPT_DIR="$(cd -P "$(dirname "${SCRIPT_PATH}")" >/dev/null 2>&1 && pwd)"

NODE_NAME=$1
if [ -z "$NODE_NAME" ]; then
    NODE_NAME=$(cat $SCRIPT_DIR/hosts | grep $NODE_IP | awk '{print $2}')
fi
# Cek sekali lagi
if [ -z "$NODE_NAME" ]; then
    NODE_NAME=node1
fi

echo "Set hostname to $NODE_NAME"
sudo hostnamectl set-hostname $NODE_NAME

# Tambahkan ke /etc/hosts semua server
cat $SCRIPT_DIR/hosts | sudo tee -a /etc/hosts
sudo reboot