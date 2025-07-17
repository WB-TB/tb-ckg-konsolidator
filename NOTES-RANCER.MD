# Persiapan Server
Setup semua server dengan Rocky Linux 9.6

```
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
sudo firewall-cmd --permanent --add-port=10250/tcp
sudo firewall-cmd --permanent --add-port=2379-2380/tcp
sudo firewall-cmd --permanent --add-port=30000-32767/tcp
sudo firewall-cmd --reload

# Load kernel modules
echo -e "overlay\nbr_netfilter" | sudo tee /etc/modules-load.d/rke2.conf
sudo modprobe overlay
sudo modprobe br_netfilter

# Konfigurasi sysctl
echo -e "net.bridge.bridge-nf-call-iptables=1\nnet.ipv4.ip_forward=1" | sudo tee /etc/sysctl.d/99-kubernetes.conf
sudo sysctl --system

# Set hostname (sesuaikan per server)
# Di master, node1, ...
$NODE_NAME=master
sudo hostnamectl set-hostname $NODE_NAME

# Tambahkan ke /etc/hosts semua server
echo "192.168.143.130 master
192.168.143.131 worker1
192.168.143.132 worker2
192.168.143.133 worker3" | sudo tee -a /etc/hosts
```