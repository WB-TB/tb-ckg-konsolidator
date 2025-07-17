sudo dnf install -y iscsi-initiator-utils nfs-utils
sudo systemctl enable iscsid
sudo systemctl start iscsid

sudo modprobe iscsi_tcp

# Semua node: Nonaktifkan THP
sudo sh -c 'echo never > /sys/kernel/mm/transparent_hugepage/enabled'
sudo sh -c 'echo never > /sys/kernel/mm/transparent_hugepage/defrag'

sudo dnf install -y cryptsetup device-mapper
sudo modprobe dm_crypt