#!/bin/bash

# Check if the script is running as root (EUID is 0)
if [[ $EUID -ne 0 ]]; then
   echo "Error: This script must be run with root privileges (e.g., using sudo)." >&2
   exit 1
fi

sudo apt update

# Aktifkan NTP
sudo timedatectl set-ntp true

# Matikan swap
sudo swapoff -a
sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab

# Konfigurasi firewall
sudo ufw allow 6443/tcp
sudo ufw allow 9345/tcp
sudo ufw allow 8472/udp
sudo ufw allow 4789/udp
sudo ufw allow 10250/tcp
sudo ufw allow 2379:2381/tcp
sudo ufw allow 9099/tcp
sudo ufw allow 51820:51821/udp
sudo ufw allow 30000:32767/tcp
sudo ufw allow 443/tcp
sudo ufw allow 80/tcp

# Load kernel modules
echo -e "overlay\nbr_netfilter" | sudo tee /etc/modules-load.d/rke2.conf
sudo modprobe overlay
sudo modprobe br_netfilter

# Konfigurasi sysctl
echo -e "net.bridge.bridge-nf-call-iptables=1\nnet.bridge.bridge-nf-call-ip6tables=1\nnet.ipv4.ip_forward=1" | sudo tee /etc/sysctl.d/99-kubernetes.conf
sudo sysctl --system