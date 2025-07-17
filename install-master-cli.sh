# Check if the script is running as root (EUID is 0)
if [[ $EUID -ne 0 ]]; then
   echo "Error: This script must be run with root privileges (e.g., using sudo)." >&2
   exit 1
fi

# Instal paket tambahan
dnf install -y git tar

# Install CLI Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Install CLI Rancher (ARM64 belum support)
#sudo curl -sL https://github.com/rancher/cli/releases/download/v2.11.2/rancher-linux-amd64-v2.7.0.tar.gz | tar xz -C /usr/local/bin/
#sudo mv /usr/local/bin/rancher-v2.11.2/rancher /usr/local/bin/