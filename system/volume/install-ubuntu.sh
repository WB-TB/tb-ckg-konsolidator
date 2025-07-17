sudo apt update
sudo apt install -y open-iscsi nfs-common
sudo systemctl enable iscsid
sudo systemctl start iscsid

sudo modprobe iscsi_tcp

# Semua node: Nonaktifkan THP
sudo sh -c 'echo never > /sys/kernel/mm/transparent_hugepage/enabled'
sudo sh -c 'echo never > /sys/kernel/mm/transparent_hugepage/defrag'

sudo apt install -y cryptsetup dmsetup
sudo modprobe dm_crypt
sudo reboot