#!/bin/bash

# Find all disk devices more comprehensively
devices=$(find /dev -maxdepth 1 \( \
    -name 'sd[a-z]' -o \
    -name 'sd[a-z][a-z]' -o \
    -name 'nvme[0-9]n[0-9]' -o \
    -name 'nvme[0-9]n[0-9]p[0-9]' -o \
    -name 'sg[0-9]' -o \
    -name 'sg[0-9][0-9]' \
    \) 2>/dev/null)

# Alternative method as backup if find returns nothing
if [ -z "$devices" ]; then
    devices=$(ls -1 /dev/sd[a-z] /dev/sd[a-z][a-z] /dev/nvme[0-9]n[0-9] /dev/nvme[0-9]n[0-9]p[0-9] /dev/sg[0-9] /dev/sg[0-9][0-9] 2>/dev/null)
fi

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