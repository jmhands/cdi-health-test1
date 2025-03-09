#!/bin/bash

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root"
  exit 1
fi

# Install required packages
echo "Installing required packages..."
apt-get update
apt-get install -y smartmontools docker.io docker-compose

# Enable and start Docker service
systemctl enable docker
systemctl start docker

# Check for NVMe devices
echo "Checking for NVMe devices..."
nvme_devices=$(ls /dev/nvme* 2>/dev/null || echo "None found")
echo "NVMe devices: $nvme_devices"

# Check for SATA/SAS devices
echo "Checking for SATA/SAS devices..."
sata_devices=$(ls /dev/sd* 2>/dev/null | grep -v [0-9] || echo "None found")
echo "SATA/SAS devices: $sata_devices"

# Run smartctl on each device
echo "Running smartctl on detected devices..."
for device in $nvme_devices $sata_devices; do
  if [ -b "$device" ]; then
    echo "Device: $device"
    smartctl -x $device | head -20
    echo "------------------------"
  fi
done

echo "Setup complete! You can now run the application with:"
echo "docker-compose up -d"

