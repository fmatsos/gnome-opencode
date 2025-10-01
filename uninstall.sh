#!/bin/bash
# Uninstallation script for GNOME OpenCode Statistics Extension

set -e

EXTENSION_UUID="opencode-stats@fmatsos.github.com"
EXTENSION_DIR="$HOME/.local/share/gnome-shell/extensions/$EXTENSION_UUID"
DATA_DIR="$HOME/.local/share/gnome-opencode"

echo "Uninstalling GNOME OpenCode Statistics Extension..."
echo ""

# Disable the extension if it's enabled
if command -v gnome-extensions &> /dev/null; then
    if gnome-extensions list --enabled | grep -q "$EXTENSION_UUID"; then
        echo "Disabling extension..."
        gnome-extensions disable "$EXTENSION_UUID" || true
        sleep 1
    fi
fi

# Remove extension directory
if [ -d "$EXTENSION_DIR" ]; then
    echo "Removing extension files..."
    rm -rf "$EXTENSION_DIR"
    echo "✓ Extension files removed"
else
    echo "Extension directory not found: $EXTENSION_DIR"
fi

# Ask about data directory
if [ -d "$DATA_DIR" ]; then
    echo ""
    echo "Extension data directory exists at: $DATA_DIR"
    read -p "Do you want to remove statistics data? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$DATA_DIR"
        echo "✓ Statistics data removed"
    else
        echo "Statistics data preserved"
    fi
fi

echo ""
echo "✓ Uninstallation complete!"
echo ""

if [ "$XDG_SESSION_TYPE" == "wayland" ]; then
    echo "Please log out and log back in to complete the removal (Wayland)"
else
    echo "Press Alt+F2, type 'r', and press Enter to restart GNOME Shell (X11)"
fi
