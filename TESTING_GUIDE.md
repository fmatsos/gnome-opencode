# Testing Guide for Real-time Sync Feature

## Prerequisites

1. **GNOME Shell**: Version 42 or later
2. **Extension Installed**: GNOME OpenCode Statistics Extension
3. **Test Data**: Generated using `./test-data-generator.sh`

## Quick Test

### 1. Verify JavaScript Syntax
```bash
node --check extension.js
```
✅ Should output nothing (means no syntax errors)

### 2. Generate Test Data
```bash
./test-data-generator.sh
```
✅ Should create `~/.local/share/opencode/stats.json`

### 3. Install Extension
```bash
./install.sh
```

### 4. Enable Extension
```bash
gnome-extensions enable opencode-stats@fmatsos.github.com
```

### 5. Verify Extension is Running
```bash
gnome-extensions list --enabled | grep opencode
```
✅ Should show: `opencode-stats@fmatsos.github.com`

## Real-time Sync Testing

### Test 1: Initial Display

1. Click the extension icon in top bar
2. Verify menu shows:
   - Session statistics
   - Daily statistics
   - Total statistics
   - **"Last update: Just now"** (new label)
   - Refresh button

Expected: All items visible, no errors

### Test 2: Real-time Update

1. Open a terminal
2. Run: `./test-realtime-sync.sh`
3. Click the extension icon to open menu
4. Watch the statistics update

Expected:
- Statistics update every 5 seconds automatically
- "Last update" label changes to "Just now"
- No need to click "Refresh Statistics"
- Updates appear within 1 second of file change

### Test 3: "Last Update" Label Format

Wait different amounts of time and check the label:

**Immediately after update:**
```
Last update: Just now
```

**After 5 minutes:**
```
Last update: 5 minutes ago
```

**After 2 hours:**
```
Last update: 2 hours ago
```

**After 24+ hours:**
```
Last update: Jan 4, 2024 10:30 AM
```

Expected: Label format changes based on time elapsed

### Test 4: Manual Refresh

1. Stop `test-realtime-sync.sh` (Ctrl+C)
2. Click "Refresh Statistics" in menu
3. Verify "Last update" changes to "Just now"

Expected: Manual refresh updates timestamp

### Test 5: File Monitoring

1. In terminal: `watch -n 1 cat ~/.local/share/opencode/stats.json`
2. In another terminal: `./test-realtime-sync.sh`
3. Keep extension menu open
4. Watch both windows

Expected:
- File changes every 5 seconds (left window)
- Extension updates every 5 seconds (menu)
- Both synchronized in real-time

### Test 6: Fallback Polling

1. Disable file monitoring:
   ```bash
   # Edit extension.js
   const FILE_MONITOR_ENABLED = false;
   ```
2. Reload extension:
   ```bash
   gnome-extensions disable opencode-stats@fmatsos.github.com
   gnome-extensions enable opencode-stats@fmatsos.github.com
   ```
3. Run: `./test-realtime-sync.sh`
4. Open extension menu

Expected:
- Updates still happen (every 60 seconds)
- "Last update" label still shows correct time
- Slower than real-time but still works

### Test 7: Extension Restart

1. Disable extension:
   ```bash
   gnome-extensions disable opencode-stats@fmatsos.github.com
   ```
2. Enable extension:
   ```bash
   gnome-extensions enable opencode-stats@fmatsos.github.com
   ```
3. Check logs for errors:
   ```bash
   journalctl -f -o cat /usr/bin/gnome-shell | grep -i "opencode\|error"
   ```

Expected:
- No errors in logs
- Extension loads successfully
- File monitor set up correctly
- Statistics display correctly

### Test 8: Model Breakdown

1. Click "View Session Details"
2. Verify notification shows model breakdown

Expected:
- Notification appears
- Shows token usage per model
- Format: "model-name: X tokens"

### Test 9: Idle Warning

1. Generate test data with old timestamp:
   ```bash
   # Edit ~/.local/share/opencode/stats.json
   # Set lastActivity to 20 minutes ago
   ```
2. Wait 60 seconds (for polling)
3. Verify idle notification appears

Expected:
- Notification: "OpenCode Session Idle"
- Message: "Your OpenCode session has been idle for X minutes"

## Error Testing

### Test 10: Missing Stats File

1. Remove stats file:
   ```bash
   rm ~/.local/share/opencode/stats.json
   ```
2. Reload extension
3. Check menu

Expected:
- Menu shows "0 tokens" for all stats
- "Last update: Never"
- No crashes or errors

### Test 11: Invalid JSON

1. Create invalid stats file:
   ```bash
   echo "invalid json" > ~/.local/share/opencode/stats.json
   ```
2. Click "Refresh Statistics"

Expected:
- Extension logs error but doesn't crash
- Falls back to previous data or zeros
- Still functional

### Test 12: Permission Denied

1. Make stats file unreadable:
   ```bash
   chmod 000 ~/.local/share/opencode/stats.json
   ```
2. Click "Refresh Statistics"
3. Check logs

Expected:
- Error logged
- Extension continues working
- Falls back to previous data

## Log Monitoring

### View Real-time Logs
```bash
journalctl -f -o cat /usr/bin/gnome-shell | grep -i opencode
```

### Look for These Messages

**Success Messages:**
```
[OpenCode Stats] File monitor set up for: /home/user/.local/share/opencode/stats.json
[OpenCode Stats] File changed, updating...
```

**Warning Messages:**
```
OpenCode stats not available: [reason]
```

**Error Messages (should not appear):**
```
Failed to set up file monitor
Failed to load data
```

## Performance Testing

### Memory Usage

Before:
```bash
ps aux | grep gnome-shell | awk '{print $6}'
```

After enabling extension:
```bash
ps aux | grep gnome-shell | awk '{print $6}'
```

Expected: < 5 MB increase

### CPU Usage

Run with real-time updates:
```bash
top -p $(pgrep gnome-shell) -d 1
```

Expected: < 1% CPU usage (most of the time 0%)

## Cleanup After Testing

### Restore File Monitoring
```bash
# Edit extension.js
const FILE_MONITOR_ENABLED = true;
```

### Restore File Permissions
```bash
chmod 644 ~/.local/share/opencode/stats.json
```

### Stop Test Script
```bash
# In terminal running test-realtime-sync.sh
Ctrl+C
```

## Automated Validation

Run all syntax checks:
```bash
node --check extension.js && echo "✅ Syntax OK"
```

Verify files exist:
```bash
ls -la test-realtime-sync.sh VISUAL_DEMO.md IMPLEMENTATION_SUMMARY.md && echo "✅ Files OK"
```

Check documentation:
```bash
grep -l "real-time\|Last update" *.md | wc -l
```
Expected: At least 5 files mention the new features

## Success Criteria

- ✅ Extension loads without errors
- ✅ File monitor set up correctly
- ✅ Real-time updates work (< 1 second delay)
- ✅ "Last update" label displays correctly
- ✅ Fallback polling still works
- ✅ No memory leaks (stable memory usage)
- ✅ No CPU spikes (< 1% average)
- ✅ Error handling works (no crashes)
- ✅ Documentation complete and accurate

## Troubleshooting

### Extension Doesn't Load
```bash
journalctl -f -o cat /usr/bin/gnome-shell | grep -i error
```

### Real-time Updates Don't Work
1. Check file monitoring enabled
2. Verify file path is correct
3. Check file system supports inotify

### High CPU Usage
1. Disable file monitoring temporarily
2. Check for infinite loops in logs
3. Verify polling interval is reasonable

## Reporting Issues

If you find issues during testing:

1. **Capture Logs:**
   ```bash
   journalctl -b -o cat /usr/bin/gnome-shell | grep opencode > debug.log
   ```

2. **System Info:**
   ```bash
   gnome-shell --version
   uname -a
   ```

3. **Extension Info:**
   ```bash
   gnome-extensions info opencode-stats@fmatsos.github.com
   ```

4. **Create Issue:**
   - Include logs
   - Include system info
   - Describe steps to reproduce
   - Expected vs actual behavior

## Test Results Template

```markdown
## Test Results

**Date:** YYYY-MM-DD
**GNOME Shell Version:** X.Y
**Distribution:** Name Version

### Tests Passed
- [ ] Test 1: Initial Display
- [ ] Test 2: Real-time Update
- [ ] Test 3: "Last Update" Label Format
- [ ] Test 4: Manual Refresh
- [ ] Test 5: File Monitoring
- [ ] Test 6: Fallback Polling
- [ ] Test 7: Extension Restart
- [ ] Test 8: Model Breakdown
- [ ] Test 9: Idle Warning
- [ ] Test 10: Missing Stats File
- [ ] Test 11: Invalid JSON
- [ ] Test 12: Permission Denied

### Issues Found
(List any issues discovered during testing)

### Notes
(Additional observations)
```
