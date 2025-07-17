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
        --tls-san=*)
            NODE_MASTER="${1#*=}"
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
    shift # Move to the next argument
done

INTERFACE=$(ip -o -4 addr show | awk -v ip="192.168" '$0 ~ ip {print $2}'|grep ens)
NODE_IP=$(ip addr show $INTERFACE | grep 'inet ' | awk '{print $2}'|cut -d'/' -f1)
# NODE_IP=$(ip addr show ens160 | grep 'inet ' | awk '{print $2}'|cut -d'/' -f1)
NODE_MASTER=${NODE_MASTER:-$NODE_IP}
TOKEN=${TOKEN:-semanggi}

# Install RKE2 server
curl -sfL https://get.rke2.io | sudo INSTALL_RKE2_TYPE="server" sh -

# Buat konfigurasi
sudo mkdir -p /etc/rancher/rke2/
cat <<EOF | sudo tee /etc/rancher/rke2/config.yaml
token: $TOKEN
tls-san:
  - "$NODE_MASTER"
node-ip: "$NODE_IP"
#advertise-address: "$NODE_IP"
#server: https://$NODE_MASTER:6443
EOF

USER=${SUDO_USER:-$USER}
USER_HOME=$(getent passwd "$USER" | cut -d: -f6)
# # Set PATH untuk kubectl
grep -q KUBECONFIG $USER_HOME/.bashrc
if [ $? -eq 1 ]; then
    echo 'export PATH=$PATH:/var/lib/rancher/rke2/bin' >> $USER_HOME/.bashrc
    echo 'export KUBECONFIG=/etc/rancher/rke2/rke2.yaml' >> $USER_HOME/.bashrc
    source $USER_HOME/.bashrc
fi
grep -q KUBECONFIG $USER_HOME/.zshrc
if [ $? -eq 1 ]; then
    echo 'export PATH=$PATH:/var/lib/rancher/rke2/bin' >> $USER_HOME/.zshrc
    echo 'export KUBECONFIG=/etc/rancher/rke2/rke2.yaml' >> $USER_HOME/.zshrc
    source $USER_HOME/.zshrc
fi

# Enable dan start service
sudo systemctl enable rke2-server.service
sudo systemctl start rke2-server.service

# Verifikasi instalasi
sudo timeout 40 journalctl -u rke2-server -f

# Set kube config
sudo vim /etc/rancher/rke2/rke2.yaml
sudo chown $USER:$USER /etc/rancher/rke2/rke2.yaml
sudo cp /etc/rancher/rke2/rke2.yaml $USER_HOME/.kube/config
sudo chown $USER:$USER $USER_HOME/.kube/config

# Restart service
#sudo systemctl restart rke2-server.service

# Verifikasi instalasi
#sudo timeout 5 journalctl -u rke2-server -f

# Tampilkan TOKEN SERVER
echo "Token Server"
sudo cat /var/lib/rancher/rke2/server/node-token