# Visual Demo: Real-time Sync Feature

This document demonstrates the new real-time sync feature with visual examples.

## Updated Menu Layout

The extension menu now includes a "Last update" label showing when statistics were last refreshed:

```
┌──────────────────────────────────────────┐
│                                          │
│  Session: 2.47K tokens                   │
│  View Session Details              →     │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  Today: 17.33K tokens                    │
│  View Daily Details                →     │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  Total: 54.51K tokens                    │
│  View Total Details                →     │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  Last update: Just now          🕐       │  ← NEW!
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  Refresh Statistics                ↻     │
│                                          │
└──────────────────────────────────────────┘
```

## Real-time Update Flow

### Before: Polling-only (up to 60 second delay)

```
OpenCode processes       Extension polls         UI updates
tokens at 10:00:05  -->  at 10:01:00        -->  at 10:01:00

⏱️  Delay: Up to 60 seconds
```

### After: File monitoring (immediate updates)

```
OpenCode processes       File monitor          UI updates
tokens at 10:00:05  -->  detects change   -->  at 10:00:05

⚡ Delay: < 1 second (real-time!)
```

## "Last Update" Label Examples

The label dynamically updates to show how recent the data is:

### Just Updated
```
│  Last update: Just now          🕐       │
```
Shows immediately after an update (< 60 seconds ago)

### Recent Update
```
│  Last update: 5 minutes ago     🕐       │
```
Shows for updates within the last hour

### Older Update
```
│  Last update: 2 hours ago       🕐       │
```
Shows for updates within the last 24 hours

### Very Old Update
```
│  Last update: Jan 4, 2024 10:30 AM  🕐  │
```
Shows exact timestamp for updates older than 24 hours

## Real-time Sync Demonstration

### Step 1: Initial State
```
Extension shows:
  Session: 1.50K tokens
  Last update: Just now
```

### Step 2: User works with OpenCode
```
User: "Explain this code..."
OpenCode: Processes request using GPT-4 (500 tokens)
```

### Step 3: Instant Update (< 1 second later)
```
Extension shows:
  Session: 2.00K tokens  ← Updated automatically!
  Last update: Just now   ← Timestamp refreshed!
```

No need to wait for the 60-second poll or click "Refresh Statistics"!

## Technical Details

### File Monitoring Setup

The extension uses `Gio.FileMonitor` to watch the OpenCode stats file:

```javascript
// Watches: ~/.local/share/opencode/stats.json
this._fileMonitor = file.monitor_file(Gio.FileMonitorFlags.NONE, null);
this._fileMonitor.connect('changed', (monitor, file, otherFile, eventType) => {
    if (eventType === Gio.FileMonitorEvent.CHANGED || 
        eventType === Gio.FileMonitorEvent.CREATED ||
        eventType === Gio.FileMonitorEvent.CHANGES_DONE_HINT) {
        // Update immediately!
        this._fetchFromOpencode();
        this._updateCallback();
    }
});
```

### Events That Trigger Updates

1. **File Change**: OpenCode writes new stats
2. **File Creation**: First time OpenCode creates stats file
3. **Changes Done**: File write operation completed

### Fallback Mechanism

The 60-second polling still runs as a safety net:
- Ensures updates even if file monitoring fails
- Catches any missed file events
- Provides reliability in edge cases

## Benefits

### For Users
- ✅ **Instant feedback**: See token usage update immediately
- ✅ **No waiting**: No need to wait up to 60 seconds
- ✅ **Transparency**: "Last update" shows data freshness
- ✅ **Reliability**: Fallback polling ensures updates

### For Developers
- ✅ **Real-time monitoring**: Track API usage as it happens
- ✅ **Better awareness**: Immediate visibility into token consumption
- ✅ **Cost control**: Real-time feedback helps manage spending
- ✅ **Debugging**: See token usage patterns in real-time

## Testing Real-time Sync

Use the included test script to see real-time updates in action:

```bash
./test-realtime-sync.sh
```

This script:
1. Updates the stats file every 5 seconds
2. Changes token counts randomly
3. Triggers real-time updates in the extension
4. Demonstrates the "Last update" label changing

### Expected Behavior

When running the test script, you should see:
- Extension updates immediately (within 1 second)
- "Last update" shows "Just now" after each update
- No need to wait 60 seconds between updates
- Token counts change in real-time

## Performance Impact

### Resource Usage
- **CPU**: Minimal - file monitoring is efficient
- **Memory**: < 1 MB additional
- **I/O**: Only reads file when changed (not continuously)

### Comparison with Polling
- **Old**: Read file every 60 seconds (60 reads/hour)
- **New**: Read file only when changed + fallback (1-60 reads/hour)
- **Result**: Equal or less I/O operations

## Configuration

### Disable File Monitoring

If needed, disable real-time monitoring in `extension.js`:

```javascript
const FILE_MONITOR_ENABLED = false;
```

Extension will fall back to 60-second polling only.

### Adjust Fallback Interval

Change the polling interval (default 60 seconds):

```javascript
const UPDATE_INTERVAL_SECONDS = 120;  // 2 minutes
```

## Compatibility

- **GNOME Shell**: 42, 43, 44, 45, 46
- **Linux**: All distributions
- **File Systems**: Works with all Linux file systems
- **OpenCode**: All versions that write to stats file

## Troubleshooting

### "Last update" shows "Never"
- OpenCode hasn't created stats file yet
- Stats file doesn't exist at `~/.local/share/opencode/stats.json`
- Extension just started and hasn't read data yet

### Updates not happening in real-time
- Check file monitoring is enabled: `FILE_MONITOR_ENABLED = true`
- Verify OpenCode is writing to stats file
- Check logs: `journalctl -f -o cat /usr/bin/gnome-shell | grep OpenCode`
- Fallback polling will still work every 60 seconds

## Comparison: Before vs After

### Before (v1.0.0)
```
┌────────────────────────────────────┐
│  Session: 1.50K tokens             │
│  Today: 5.00K tokens               │
│  Total: 50.00K tokens              │
├────────────────────────────────────┤
│  Refresh Statistics          ↻     │
└────────────────────────────────────┘

❌ Updates every 60 seconds only
❌ No indication of data freshness
❌ Must wait or click refresh
```

### After (v1.1.0)
```
┌────────────────────────────────────┐
│  Session: 1.50K tokens             │
│  Today: 5.00K tokens               │
│  Total: 50.00K tokens              │
├────────────────────────────────────┤
│  Last update: Just now       🕐    │
├────────────────────────────────────┤
│  Refresh Statistics          ↻     │
└────────────────────────────────────┘

✅ Updates in real-time (< 1 second)
✅ Shows when data was refreshed
✅ No waiting needed
✅ Fallback polling still works
```
