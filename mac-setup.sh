#!/bin/bash

# Install Homebrew if not already installed
if ! command -v brew &> /dev/null; then
    echo "Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
    echo "Homebrew already installed."
fi

# Install smartmontools
echo "Installing smartmontools..."
brew install smartmontools

# List available disks
echo "Available disks on your Mac:"
diskutil list

echo "Setup complete! You can now run the application with:"
echo "docker-compose -f docker-compose.mac.yml up"

