# Debug Logging Guide

## Overview

The GNOME Stats Exporter plugin runs **silently by default** - it does not produce any log messages in the OpenCode chat interface. This prevents cluttering your conversations with plugin diagnostic information.

## When to Enable Debug Logging

Enable debug logging when you need to:
- **Troubleshoot** plugin issues
- **Verify** the plugin is receiving events
- **Diagnose** why statistics aren't updating
- **Understand** what tokens are being tracked

## How to Enable Debug Logging

### Temporary (Current Session Only)

```bash
# Set environment variable and start OpenCode
DEBUG_GNOME_STATS=1 opencode
```

### Persistent (All Sessions)

Add to your shell configuration file (`~/.bashrc`, `~/.zshrc`, etc.):

```bash
# Enable GNOME Stats Exporter debug logging
export DEBUG_GNOME_STATS=1
```

Then reload your shell:
```bash
source ~/.bashrc  # or ~/.zshrc
```

## Log File Location

When enabled, logs are written to:
```
~/.local/share/opencode/gnome-stats-exporter.log
```

## Viewing Debug Logs

### View Entire Log File
```bash
cat ~/.local/share/opencode/gnome-stats-exporter.log
```

### Tail in Real-Time
```bash
tail -f ~/.local/share/opencode/gnome-stats-exporter.log
```

### Filter by Log Level
```bash
# Show only errors
grep ERROR ~/.local/share/opencode/gnome-stats-exporter.log

# Show only info messages
grep INFO ~/.local/share/opencode/gnome-stats-exporter.log

# Show only debug messages
grep DEBUG ~/.local/share/opencode/gnome-stats-exporter.log
```

### Search for Specific Events
```bash
# Check if tokens are being tracked
grep "Tracked tokens" ~/.local/share/opencode/gnome-stats-exporter.log

# Check idle detection
grep "idle" ~/.local/share/opencode/gnome-stats-exporter.log

# View last 20 log entries
tail -n 20 ~/.local/share/opencode/gnome-stats-exporter.log
```

## Log Format

Each log entry follows this format:
```
[timestamp] [LEVEL] message | {"extra": "data"}
```

**Example:**
```
[2024-01-04T15:30:45.123Z] [INFO] Tracked tokens for model | {"totalTokens":1500,"modelID":"claude-3-5-sonnet","cost":0.015}
[2024-01-04T15:45:00.456Z] [INFO] Session marked as idle (real-time event)
[2024-01-04T15:46:12.789Z] [DEBUG] Received session.idle event from OpenCode
[2024-01-04T15:47:23.012Z] [ERROR] Error processing event | {"error":"Unexpected format"}
```

## Log Levels

### INFO
- Token tracking events
- Session idle state changes
- Activity status updates

**Example:**
```
[2024-01-04T15:30:45.123Z] [INFO] Tracked tokens for model | {"totalTokens":1500,"modelID":"gpt-4","cost":0.03}
```

### DEBUG
- Event type received
- Message data inspection
- Internal state checks

**Example:**
```
[2024-01-04T15:30:44.000Z] [DEBUG] Received session.idle event from OpenCode
```

### ERROR
- Plugin initialization errors
- File operation failures
- Event processing errors

**Example:**
```
[2024-01-04T15:30:50.000Z] [ERROR] Error saving stats | {"error":"EACCES: permission denied","filePath":"/home/user/.local/share/opencode/stats.json"}
```

## Troubleshooting Common Issues

### Plugin Not Logging Anything

**Problem:** No log file created even with `DEBUG_GNOME_STATS=1`

**Solution:**
1. Verify environment variable is set:
   ```bash
   echo $DEBUG_GNOME_STATS
   # Should output: 1
   ```

2. Check directory permissions:
   ```bash
   ls -la ~/.local/share/opencode/
   ```

3. Try creating the directory manually:
   ```bash
   mkdir -p ~/.local/share/opencode
   ```

### Logs Show "No message data in event"

**Problem:** Plugin receives events but can't find message data

**Solution:**
- This is normal for some event types
- Look for DEBUG logs showing what event keys are present
- The plugin only processes `message.updated` events with completed assistant messages

### "Tracked tokens" Messages Missing

**Problem:** Plugin is running but not tracking tokens

**Possible Causes:**
1. OpenCode hasn't completed any AI interactions yet
2. Messages aren't from assistant role
3. Messages don't have token usage data

**Solution:**
1. Have a conversation with an AI model in OpenCode
2. Check for DEBUG messages showing event processing
3. Look for ERROR messages indicating why tracking failed

### Permission Denied Errors

**Problem:** `ERROR` logs show permission denied when writing

**Solution:**
```bash
# Check ownership
ls -la ~/.local/share/opencode/

# Fix permissions
chmod 755 ~/.local/share/opencode
chmod 644 ~/.local/share/opencode/stats.json  # if file exists
chmod 644 ~/.local/share/opencode/gnome-stats-exporter.log
```

## Disabling Debug Logging

### Temporary (Current Session)
```bash
unset DEBUG_GNOME_STATS
opencode
```

### Persistent
Remove or comment out the export line from your shell config:
```bash
# ~/.bashrc or ~/.zshrc
# export DEBUG_GNOME_STATS=1  # <-- Comment this out
```

Then reload:
```bash
source ~/.bashrc  # or ~/.zshrc
```

## Cleaning Up Old Logs

The log file grows indefinitely when debug mode is enabled. To clean it up:

### Delete Entire Log File
```bash
rm ~/.local/share/opencode/gnome-stats-exporter.log
```

### Keep Only Recent Entries
```bash
# Keep last 1000 lines
tail -n 1000 ~/.local/share/opencode/gnome-stats-exporter.log > /tmp/recent.log
mv /tmp/recent.log ~/.local/share/opencode/gnome-stats-exporter.log
```

### Archive Old Logs
```bash
# Create timestamped backup
mv ~/.local/share/opencode/gnome-stats-exporter.log \
   ~/.local/share/opencode/gnome-stats-exporter-$(date +%Y%m%d).log
```

## Performance Impact

**Silent Mode (Default):**
- ✅ Zero overhead
- ✅ No file I/O operations
- ✅ No string formatting
- ✅ Minimal memory usage

**Debug Mode Enabled:**
- ⚠️ Small overhead from file I/O
- ⚠️ Log file grows over time
- ✅ Still very lightweight (~milliseconds per log entry)
- ✅ Non-blocking operations

**Recommendation:** Only enable debug logging when actively troubleshooting.

## Example Debug Session

```bash
# 1. Enable debug logging
export DEBUG_GNOME_STATS=1

# 2. Start OpenCode and open log in another terminal
# Terminal 1:
opencode

# Terminal 2:
tail -f ~/.local/share/opencode/gnome-stats-exporter.log

# 3. Have a conversation with an AI model in OpenCode

# 4. Watch for log entries like:
# [2024-01-04T15:30:45.123Z] [INFO] Tracked tokens for model | {"totalTokens":1500,...}

# 5. Disable debug logging when done
unset DEBUG_GNOME_STATS
```

## Benefits of This Approach

✅ **Silent by Default** - No chat pollution during normal operation  
✅ **Opt-in Debugging** - Enable only when needed  
✅ **Separate Log File** - Doesn't interfere with OpenCode's logs  
✅ **Detailed Diagnostics** - Full event and state information when troubleshooting  
✅ **No Performance Impact** - Zero overhead when disabled  
✅ **Easy to Enable/Disable** - Simple environment variable toggle  

## Support

For issues:
- Check this guide first
- Enable debug logging to gather diagnostics
- Open an issue on [GitHub](https://github.com/fmatsos/gnome-opencode/issues) with relevant log excerpts
