# Package Testing Guide

This document provides instructions for testing the packaged extension before submission to extensions.gnome.org.

## Prerequisites

- GNOME Shell 42 or later
- `gnome-extensions` command available
- Terminal access
- Extension currently NOT installed (or uninstalled for testing)

## Testing Procedure

### Step 1: Create Package

```bash
cd /home/runner/work/gnome-opencode/gnome-opencode
./package.sh
```

Expected output:
```
Packaging GNOME OpenCode Statistics Extension v1...
Copying extension files...
Copying schemas...
Creating package: opencode-stats-v1.zip
✓ Package created: opencode-stats-v1.zip
```

### Step 2: Verify Package Contents

```bash
unzip -l opencode-stats-v1.zip
```

Expected files (8 total):
1. ✓ opencode-stats@fmatsos.github.com/
2. ✓ opencode-stats@fmatsos.github.com/extension.js
3. ✓ opencode-stats@fmatsos.github.com/prefs.js
4. ✓ opencode-stats@fmatsos.github.com/metadata.json
5. ✓ opencode-stats@fmatsos.github.com/stylesheet.css
6. ✓ opencode-stats@fmatsos.github.com/schemas/
7. ✓ opencode-stats@fmatsos.github.com/schemas/org.gnome.shell.extensions.opencode-stats.gschema.xml
8. ✓ opencode-stats@fmatsos.github.com/schemas/gschemas.compiled

### Step 3: Uninstall Existing Extension (if installed)

```bash
gnome-extensions disable opencode-stats@fmatsos.github.com
gnome-extensions uninstall opencode-stats@fmatsos.github.com
```

Verify uninstallation:
```bash
gnome-extensions list | grep opencode
# Should return no results
```

### Step 4: Install from Package

```bash
gnome-extensions install opencode-stats-v1.zip --force
```

Expected output:
```
Extension installed successfully
```

Verify installation:
```bash
gnome-extensions list | grep opencode
# Should show: opencode-stats@fmatsos.github.com
```

### Step 5: Enable Extension

```bash
gnome-extensions enable opencode-stats@fmatsos.github.com
```

Check status:
```bash
gnome-extensions info opencode-stats@fmatsos.github.com
```

Expected status: `ENABLED`

### Step 6: Check for Errors

Monitor logs for any errors:
```bash
journalctl -f -o cat /usr/bin/gnome-shell | grep opencode
```

Expected: No error messages

Acceptable messages:
- Loading extension
- Extension enabled
- Data loading messages

Not acceptable:
- JavaScript errors
- Missing file errors
- Schema compilation errors

### Step 7: Test Functionality

#### 7.1 Check UI Elements

1. Look for terminal icon in top bar (right side, system area)
2. Click icon - dropdown menu should appear
3. Menu should show:
   - Session statistics
   - Daily statistics
   - Total statistics
   - Last update timestamp
   - Refresh button

#### 7.2 Test Menu Items

1. Click "View Session Details" - notification should appear
2. Click "View Daily Details" - notification should appear
3. Click "View Total Details" - notification should appear
4. Click "Refresh Statistics" - should trigger data refresh

#### 7.3 Test Preferences

```bash
gnome-extensions prefs opencode-stats@fmatsos.github.com
```

Preferences window should open showing:
- Idle threshold slider
- Polling interval setting
- File monitoring toggle
- Other configuration options

Make changes and verify they persist after:
```bash
gnome-extensions disable opencode-stats@fmatsos.github.com
gnome-extensions enable opencode-stats@fmatsos.github.com
```

#### 7.4 Test Data Updates

Generate test data:
```bash
./test-data-generator.sh
```

Within 60 seconds, statistics should update in the menu.

### Step 8: Test Disable/Enable Cycle

```bash
# Disable extension
gnome-extensions disable opencode-stats@fmatsos.github.com

# Check logs for cleanup
journalctl -f -o cat /usr/bin/gnome-shell | grep opencode

# Icon should disappear from top bar

# Re-enable
gnome-extensions enable opencode-stats@fmatsos.github.com

# Icon should reappear
```

### Step 9: Test on Multiple GNOME Versions (if available)

Repeat Steps 4-8 on:
- GNOME Shell 42 (minimum supported)
- GNOME Shell 45 (middle version)
- GNOME Shell 46+ (latest)

### Step 10: Cleanup

```bash
gnome-extensions disable opencode-stats@fmatsos.github.com
gnome-extensions uninstall opencode-stats@fmatsos.github.com
rm -f opencode-stats-v1.zip
```

## Common Issues and Solutions

### Issue: "Extension not compatible"

**Cause:** GNOME Shell version not in metadata.json shell-version array

**Solution:** Check `metadata.json` includes your GNOME Shell version

### Issue: "Schema compilation failed"

**Cause:** gschemas.compiled missing or corrupted

**Solution:** Verify package.sh copies schemas correctly

### Issue: "Extension failed to load"

**Cause:** JavaScript syntax error or missing dependency

**Solution:** Run `./tests/validate-extension.sh` before packaging

### Issue: Icon doesn't appear

**Cause:** Extension not properly enabled or error during initialization

**Solution:** Check logs with `journalctl -f -o cat /usr/bin/gnome-shell | grep opencode`

### Issue: Preferences won't open

**Cause:** prefs.js missing from package

**Solution:** Verify `unzip -l` shows prefs.js in package

## Automated Testing Checklist

Use this checklist for each test run:

### Package Creation
- [ ] Package.sh runs without errors
- [ ] Package file created (opencode-stats-v1.zip)
- [ ] Package size reasonable (< 100KB)
- [ ] All 8 files present in package

### Installation
- [ ] Extension installs without errors
- [ ] Extension appears in gnome-extensions list
- [ ] No errors in journalctl during installation

### Functionality
- [ ] Icon appears in top bar
- [ ] Menu opens when icon clicked
- [ ] Statistics display correctly
- [ ] Detail views work (all 3)
- [ ] Refresh button works
- [ ] Preferences window opens
- [ ] Settings persist after disable/enable

### Stability
- [ ] No errors in logs during normal operation
- [ ] Extension disables cleanly
- [ ] Extension re-enables without issues
- [ ] No memory leaks during 5-minute test

### Cleanup
- [ ] Extension uninstalls cleanly
- [ ] No residual files left behind (except data in ~/.local/share/gnome-opencode/)

## Test Results Template

```
## Test Results

**Date:** YYYY-MM-DD
**Tester:** Name
**GNOME Shell Version:** X.Y
**Distribution:** Distribution Name

### Package Creation
Status: PASS/FAIL
Notes: 

### Installation
Status: PASS/FAIL
Notes:

### Functionality
Status: PASS/FAIL
Notes:

### Stability
Status: PASS/FAIL
Notes:

### Overall Result
Status: PASS/FAIL
Ready for submission: YES/NO

### Errors Encountered
(List any errors)

### Recommendations
(Any suggestions)
```

## Pre-Submission Final Check

Before submitting to extensions.gnome.org:

1. [ ] Package tested on at least one GNOME version
2. [ ] All functionality verified working
3. [ ] No errors in logs
4. [ ] Preferences work correctly
5. [ ] Extension disables/enables cleanly
6. [ ] Screenshots created (see screenshots/README.md)
7. [ ] SUBMISSION.md reviewed
8. [ ] Ready to upload to extensions.gnome.org

---

**Document Version:** 1.0  
**Last Updated:** October 2025  
**Purpose:** Package validation before extensions.gnome.org submission
