#!/bin/bash

adduser $1
usermod -G sftpusergroup $1
mkdir /sftp/$1
chown -R root:root /sftp/$1
chmod 755 /sftp/$1
mkdir /sftp/$1/data

echo "[ownode-$1]" >> /etc/samba/smb.conf
echo "   comment = Ownode $1 " >> /etc/samba/smb.conf
echo "   browsable = yes" >> /etc/samba/smb.conf
echo "   path = /sftp/$1/data" >> /etc/samba/smb.conf
echo "   guest ok = yes" >> /etc/samba/smb.conf
echo "   read only = no" >> /etc/samba/smb.conf
echo "   create mask = 0777" >> /etc/samba/smb.conf
/etc/init.d/smbd restart
