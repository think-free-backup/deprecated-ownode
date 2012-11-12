#!/bin/bash

sed -i 's|Subsystem sftp /usr/lib/openssh/sftp-server|Subsystem sftp internal-sftp|' /etc/ssh/sshd_config

groupadd sftpusergroup

echo "Match Group sftpusergroup" >> /etc/ssh/sshd_config
echo "    ChrootDirectory /sftp/%u" >> /etc/ssh/sshd_config
echo "    AllowTCPForwarding no" >> /etc/ssh/sshd_config
echo "    X11Forwarding no" >> /etc/ssh/sshd_config
echo "    ForceCommand internal-sftp" >> /etc/ssh/sshd_config

mkdir /sftp
chown -R root:root /sftp
chmod 755 /sftp
