#!/bin/bash
# Installation script for GNOME OpenCode Statistics Extension

set -e

EXTENSION_UUID="opencode-stats@fmatsos.github.com"
EXTENSION_DIR="$HOME/.local/share/gnome-shell/extensions/$EXTENSION_UUID"

echo "Installing GNOME OpenCode Statistics Extension..."
echo ""

# Check if GNOME Shell is installed
if ! command -v gnome-shell &> /dev/null; then
    echo "Error: GNOME Shell is not installed or not in PATH"
    echo "This extension requires GNOME Shell 42 or later"
    exit 1
fi

# Get GNOME Shell version
GNOME_VERSION=$(gnome-shell --version | grep -oP '\d+' | head -1)
echo "Detected GNOME Shell version: $GNOME_VERSION"

if [ "$GNOME_VERSION" -lt 42 ]; then
    echo "Warning: This extension is designed for GNOME Shell 42 or later"
    echo "Your version ($GNOME_VERSION) may not be compatible"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Create extension directory
echo "Creating extension directory..."
mkdir -p "$EXTENSION_DIR"

# Copy extension files
echo "Copying extension files..."
cp -v extension.js "$EXTENSION_DIR/"
cp -v metadata.json "$EXTENSION_DIR/"
cp -v stylesheet.css "$EXTENSION_DIR/"

echo ""
echo "✓ Extension files installed to: $EXTENSION_DIR"
echo ""

# Check if extension is already enabled
if gnome-extensions list --enabled | grep -q "$EXTENSION_UUID"; then
    echo "Extension is already enabled. Reloading..."
    gnome-extensions disable "$EXTENSION_UUID" || true
    sleep 1
fi

# Enable the extension
echo "Enabling extension..."
gnome-extensions enable "$EXTENSION_UUID"

echo ""
echo "✓ Extension enabled successfully!"
echo ""
echo "Next steps:"
echo "  1. Restart GNOME Shell:"

if [ "$XDG_SESSION_TYPE" == "wayland" ]; then
    echo "     - Log out and log back in (Wayland)"
else
    echo "     - Press Alt+F2, type 'r', and press Enter (X11)"
fi

echo "  2. Look for the terminal icon in your top bar"
echo "  3. (Optional) Generate test data:"
echo "     ./test-data-generator.sh"
echo ""
echo "For more information, see README.md"
