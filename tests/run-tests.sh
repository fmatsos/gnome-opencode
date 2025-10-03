#!/bin/bash
# Main test runner for GNOME OpenCode Extension

set -e

echo "🧪 Running GNOME OpenCode Extension Tests"
echo "=========================================="

# Check if running in CI
if [ "${CI}" = "true" ]; then
  echo "Running in CI environment"
fi

# Run extension unit tests
echo ""
echo "📋 Running Extension Unit Tests..."
npm test || exit 1

# Run plugin tests
echo ""
echo "📦 Running OpenCode Plugin Tests..."
cd opencode-plugin
npm test || exit 1
cd ..

# Run validation checks
echo ""
echo "✅ Running Extension Validation..."
./tests/validate-extension.sh || exit 1

echo ""
echo "✅ All tests passed!"
echo "=========================================="
echo ""
echo "Test Summary:"
echo "  ✓ Extension unit tests"
echo "  ✓ Plugin unit tests"  
echo "  ✓ Extension validation"
