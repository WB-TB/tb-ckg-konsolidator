#!/bin/bash

# Check if the script is running as root (EUID is 0)
if [[ $EUID -ne 0 ]]; then
   echo "Error: This script must be run with root privileges (e.g., using sudo)." >&2
   exit 1
fi

# Aktifkan NTP
sudo dnf install -y chrony
sudo service chronyd restart
sudo timedatectl set-ntp true

# Nonaktifkan SELinux
sudo setenforce 0
sudo sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config

# Matikan swap
sudo swapoff -a
sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab

# Konfigurasi firewall
sudo firewall-cmd --permanent --add-port=6443/tcp
sudo firewall-cmd --permanent --add-port=9345/tcp
sudo firewall-cmd --permanent --add-port=8472/udp
sudo firewall-cmd --permanent --add-port=4789/udp
sudo firewall-cmd --permanent --add-port=10250/tcp
sudo firewall-cmd --permanent --add-port=2379-2381/tcp
sudo firewall-cmd --permanent --add-port=9099/tcp
sudo firewall-cmd --permanent --add-port=51820-51821/udp
sudo firewall-cmd --permanent --add-port=30000-32767/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --reload

# Load kernel modules
echo -e "overlay\nbr_netfilter" | sudo tee /etc/modules-load.d/rke2.conf
sudo modprobe overlay
sudo modprobe br_netfilter

# Konfigurasi sysctl
echo -e "net.bridge.bridge-nf-call-iptables=1\nnet.bridge.bridge-nf-call-ip6tables=1\nnet.ipv4.ip_forward=1" | sudo tee /etc/sysctl.d/99-kubernetes.conf
sudo sysctl --system