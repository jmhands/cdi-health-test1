#!/bin/bash

# Find all disk devices
devices=$(find /dev -regex '/dev/\(sd[a-z]\|nvme[0-9]n[0-9]\|sg[0-9]\)')

# Initialize empty JSON array
echo "{"
echo "  \"devices\": ["
first=true

for device in $devices; do
    if [ "$first" = true ]; then
        first=false
    else
        echo ","
    fi
    # Get SMART data for each device
    smartctl_output=$(smartctl -a -j "$device")
    echo "    {\"device\": \"$device\", \"data\": $smartctl_output}"
done

echo "  ]"
echo "}" 