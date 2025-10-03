#!/bin/bash
# Package the extension for distribution

set -e

EXTENSION_UUID="opencode-stats@fmatsos.github.com"
VERSION=$(grep -oP '"version":\s*\K\d+' metadata.json)
PACKAGE_NAME="opencode-stats-v${VERSION}.zip"

echo "Packaging GNOME OpenCode Statistics Extension v${VERSION}..."
echo ""

# Create a temporary directory for packaging
TEMP_DIR=$(mktemp -d)
PACKAGE_DIR="$TEMP_DIR/$EXTENSION_UUID"

# Create package directory
mkdir -p "$PACKAGE_DIR"

# Copy extension files
echo "Copying extension files..."
cp extension.js "$PACKAGE_DIR/"
cp prefs.js "$PACKAGE_DIR/"
cp metadata.json "$PACKAGE_DIR/"
cp stylesheet.css "$PACKAGE_DIR/"

# Copy schemas directory
echo "Copying schemas..."
mkdir -p "$PACKAGE_DIR/schemas"
cp schemas/*.xml "$PACKAGE_DIR/schemas/"
glib-compile-schemas "$PACKAGE_DIR/schemas/" 2>/dev/null || echo "⚠️  glib-compile-schemas not available, schema will be compiled on installation"

# Create the zip file
echo "Creating package: $PACKAGE_NAME"
cd "$TEMP_DIR"
zip -r "$PACKAGE_NAME" "$EXTENSION_UUID"

# Move to current directory
mv "$PACKAGE_NAME" "$OLDPWD/"

# Cleanup
rm -rf "$TEMP_DIR"

cd "$OLDPWD"

echo ""
echo "✓ Package created: $PACKAGE_NAME"
echo ""
echo "You can now:"
echo "  1. Upload to extensions.gnome.org"
echo "  2. Share the zip file for manual installation"
echo "  3. Test installation with: gnome-extensions install $PACKAGE_NAME"
