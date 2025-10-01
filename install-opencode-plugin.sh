#!/bin/bash
# SPDX-License-Identifier: GPL-3.0-or-later
# SPDX-FileCopyrightText: 2024 fmatsos
#
# Install the GNOME Stats Exporter plugin for OpenCode
#
# This script installs the OpenCode plugin that tracks token usage
# and exports statistics for the GNOME OpenCode Statistics Extension.

set -e

PLUGIN_FILE="gnome-stats-exporter.ts"
PLUGIN_DIR=".opencode/plugin"
GLOBAL_PLUGIN_DIR="$HOME/.config/opencode/plugin"

echo "================================================"
echo "OpenCode Plugin Installer"
echo "GNOME Stats Exporter"
echo "================================================"
echo ""

# Check if plugin file exists
if [ ! -f "$PLUGIN_DIR/$PLUGIN_FILE" ]; then
    echo "Error: Plugin file not found at $PLUGIN_DIR/$PLUGIN_FILE"
    echo "Please run this script from the gnome-opencode repository root."
    exit 1
fi

echo "This script will install the GNOME Stats Exporter plugin for OpenCode."
echo ""
echo "Choose installation method:"
echo "  1) Global (works for all OpenCode sessions)"
echo "  2) Current project only (already available in this directory)"
echo "  3) Cancel"
echo ""
read -p "Enter choice [1-3]: " choice

case $choice in
    1)
        echo ""
        echo "Installing plugin globally to $GLOBAL_PLUGIN_DIR..."
        
        # Create directory if it doesn't exist
        mkdir -p "$GLOBAL_PLUGIN_DIR"
        
        # Copy plugin file
        cp "$PLUGIN_DIR/$PLUGIN_FILE" "$GLOBAL_PLUGIN_DIR/"
        
        echo ""
        echo "✅ Plugin installed successfully!"
        echo ""
        echo "Location: $GLOBAL_PLUGIN_DIR/$PLUGIN_FILE"
        echo ""
        echo "The plugin will be loaded automatically when you start OpenCode."
        echo "Statistics will be exported to: ~/.local/share/opencode/stats.json"
        ;;
    2)
        echo ""
        echo "Project-level installation is already complete!"
        echo ""
        echo "The plugin is located at: $PLUGIN_DIR/$PLUGIN_FILE"
        echo ""
        echo "When you use OpenCode in this directory, the plugin will be"
        echo "loaded automatically and statistics will be exported to:"
        echo "  ~/.local/share/opencode/stats.json"
        ;;
    3)
        echo ""
        echo "Installation cancelled."
        exit 0
        ;;
    *)
        echo ""
        echo "Invalid choice. Installation cancelled."
        exit 1
        ;;
esac

echo ""
echo "================================================"
echo "Next Steps:"
echo "================================================"
echo ""
echo "1. Start or restart OpenCode"
echo "2. Have a conversation with an AI model"
echo "3. Check the stats file:"
echo "   cat ~/.local/share/opencode/stats.json"
echo ""
echo "4. View statistics in GNOME:"
echo "   - Look for the terminal icon in your top bar"
echo "   - Click to view token usage"
echo ""
echo "For more information, see:"
echo "  - .opencode/plugin/README.md"
echo "  - OPENCODE_INTEGRATION.md"
echo ""
echo "Enjoy tracking your OpenCode usage! 🚀"
echo ""
