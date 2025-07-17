#!/bin/bash

# Check if the script is running as root (EUID is 0)
if [[ $EUID -ne 0 ]]; then
   echo "Error: This script must be run with root privileges (e.g., using sudo)." >&2
   exit 1
fi

# Stop service RKE2 agent
sudo systemctl stop rke2-agent

# Disable service agar tidak start otomatis
sudo systemctl disable rke2-agent

# Hapus service file
sudo rm -f /etc/systemd/system/rke2-agent.service

# Jalankan skrip uninstall resmi
sudo /usr/bin/rke2-uninstall.sh

# Hapus direktori konfigurasi dan data
sudo rm -rf /etc/rancher/rke2/
sudo rm -rf /var/lib/rancher/rke2/
sudo rm -rf /var/lib/kubelet/

# Hapus biner
sudo rm -f /usr/local/bin/rke2
sudo rm -f /usr/local/bin/kubectl
sudo rm -f /usr/local/bin/crictl
sudo rm -f /usr/local/bin/ctr

# Hapus file systemd
sudo rm -f /usr/lib/systemd/system/rke2*.service

sudo reboot