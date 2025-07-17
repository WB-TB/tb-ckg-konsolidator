#!/bin/bash

# Check if the script is running as root (EUID is 0)
if [[ $EUID -ne 0 ]]; then
   echo "Error: This script must be run with root privileges (e.g., using sudo)." >&2
   exit 1
fi

# Parse named arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        --token=*)
            TOKEN="${1#*=}"
            ;;
        --server=*)
            NODE_MASTER="${1#*=}"
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
    shift # Move to the next argument
done

# Persiapan variabel
INTERFACE=$(ip -o -4 addr show | awk -v ip="192.168" '$0 ~ ip {print $2}'|grep ens)
NODE_IP=$(ip addr show $INTERFACE | grep 'inet ' | awk '{print $2}'|cut -d'/' -f1)

# Install RKE2 agent
curl -sfL https://get.rke2.io | sudo INSTALL_RKE2_TYPE="agent" sh -

# Buat konfigurasi
sudo mkdir -p /etc/rancher/rke2/
cat <<EOF | sudo tee /etc/rancher/rke2/config.yaml
server: https://$NODE_MASTER:9345
token: $TOKEN  # Ganti dengan token yang didapat sebelumnya
node-ip: $NODE_IP             # Sesuaikan dengan IP node
EOF

# Enable dan start service
sudo systemctl enable rke2-agent.service
sudo systemctl start rke2-agent.service

# Verifikasi
sudo timeout 30 journalctl -u rke2-agent -f
