#!/bin/bash
# Validation script for GNOME OpenCode Extension files

set -e

echo "🔍 Validating extension files..."

# Check required files exist
required_files=(
  "extension.js"
  "prefs.js"
  "metadata.json"
  "schemas/org.gnome.shell.extensions.opencode-stats.gschema.xml"
)

for file in "${required_files[@]}"; do
  if [ ! -f "$file" ]; then
    echo "❌ Missing required file: $file"
    exit 1
  fi
  echo "✓ Found: $file"
done

# Validate metadata.json
echo ""
echo "🔍 Checking metadata.json..."
if ! jq . metadata.json > /dev/null 2>&1; then
  echo "❌ Invalid JSON in metadata.json"
  exit 1
fi
echo "✓ Valid JSON"

# Check required metadata fields
required_fields=("uuid" "name" "description")
for field in "${required_fields[@]}"; do
  if ! jq -e ".$field" metadata.json > /dev/null 2>&1; then
    echo "❌ Missing required field in metadata.json: $field"
    exit 1
  fi
  echo "✓ Field present: $field"
done

# Check shell-version separately (can be string or array)
if ! jq -e '."shell-version"' metadata.json > /dev/null 2>&1; then
  echo "❌ Missing required field in metadata.json: shell-version"
  exit 1
fi
echo "✓ Field present: shell-version"

# Validate GSettings schema (if glib-compile-schemas is available)
if command -v glib-compile-schemas &> /dev/null; then
  echo ""
  echo "🔍 Checking GSettings schema..."
  if glib-compile-schemas --dry-run --strict schemas/ 2>&1 | grep -q "error"; then
    echo "❌ GSettings schema validation failed"
    exit 1
  fi
  echo "✓ GSettings schema valid"
else
  echo "⚠️  Skipping GSettings validation (glib-compile-schemas not found)"
fi

# Check for basic JavaScript syntax (if node is available)
if command -v node &> /dev/null; then
  echo ""
  echo "🔍 Checking JavaScript syntax..."
  for jsfile in extension.js prefs.js; do
    if ! node -c "$jsfile" 2>&1 | grep -q "SyntaxError"; then
      echo "✓ Syntax OK: $jsfile"
    else
      echo "❌ Syntax error in $jsfile"
      exit 1
    fi
  done
else
  echo "⚠️  Skipping JavaScript syntax check (node not found)"
fi

echo ""
echo "✅ Extension validation passed!"
