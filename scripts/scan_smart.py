#!/usr/bin/env python3
import json
import subprocess
import os
from datetime import datetime
from pathlib import Path

LOG_DIR = Path("/tmp/cdi/logs")

def setup_dirs():
    """Create log directory structure"""
    LOG_DIR.mkdir(parents=True, exist_ok=True)

def get_all_drives():
    """Find all disk devices"""
    print("Scanning for drives...")
    cmd = "find /dev -regex '/dev/\(sd[a-z]\|sd[a-z][a-z]\|nvme[0-9]n[0-9]\|nvme[0-9]n[0-9]p[0-9]\|sg[0-9]\|sg[0-9][0-9]\)'"
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    drives = result.stdout.strip().split('\n')
    print(f"Found {len(drives)} drive(s): {', '.join(drives)}")
    return drives

def get_smart_data(device):
    """Get SMART data for a device"""
    try:
        print(f"Getting SMART data for {device}...")
        cmd = f"smartctl -a -j {device}"
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return json.loads(result.stdout)
    except Exception as e:
        print(f"Error getting SMART data for {device}: {str(e)}")
        return None

def main():
    print("Starting drive scan...")
    setup_dirs()
    timestamp = datetime.now().isoformat()
    
    for device in get_all_drives():
        if not device: continue
        
        smart_data = get_smart_data(device)
        if not smart_data: 
            print(f"No SMART data available for {device}")
            continue
        
        # Get serial number for filename
        serial = smart_data.get('serial_number', 'unknown')
        
        # Add timestamp and device path to data
        smart_data['timestamp'] = timestamp
        smart_data['device_path'] = device
        
        # Save to individual JSON file
        output_file = LOG_DIR / f"{serial}.json"
        with open(output_file, 'w') as f:
            json.dump(smart_data, f, indent=2)
        print(f"Saved SMART data for {device} (Serial: {serial})")

    print("Drive scan complete!")

if __name__ == "__main__":
    main() 