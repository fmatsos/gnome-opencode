# Debug Logging - Quick Reference

## TL;DR

**Plugin is silent by default.** To enable debug logging:

```bash
DEBUG_GNOME_STATS=1 opencode
```

Log file: `~/.local/share/opencode/gnome-stats-exporter.log`

---

## Quick Commands

### Enable Debug Mode
```bash
# One-time
DEBUG_GNOME_STATS=1 opencode

# Persistent
echo 'export DEBUG_GNOME_STATS=1' >> ~/.bashrc
source ~/.bashrc
```

### View Logs
```bash
# View all logs
cat ~/.local/share/opencode/gnome-stats-exporter.log

# Watch live
tail -f ~/.local/share/opencode/gnome-stats-exporter.log

# Last 20 entries
tail -n 20 ~/.local/share/opencode/gnome-stats-exporter.log

# Errors only
grep ERROR ~/.local/share/opencode/gnome-stats-exporter.log

# Token tracking
grep "Tracked tokens" ~/.local/share/opencode/gnome-stats-exporter.log

# Idle detection events
grep "session.idle" ~/.local/share/opencode/gnome-stats-exporter.log

# Idle detection troubleshooting
If you see `session.idle` events but the extension does not show idle state:
1. Ensure the OpenCode plugin is writing `session.idle` events to the log
2. Verify `~/.local/share/opencode/stats.json` is being updated
3. Check permissions on the stats file and parent directory

Example log lines to look for:
[2024-01-04T15:30:44.000Z] [DEBUG] Received session.idle event from OpenCode
[2024-01-04T15:30:45.123Z] [INFO] Session marked as idle (real-time event)
```

### Disable Debug Mode
```bash
unset DEBUG_GNOME_STATS
```

### Clean Up Logs
```bash
# Delete log file
rm ~/.local/share/opencode/gnome-stats-exporter.log

# Keep last 100 lines
tail -n 100 ~/.local/share/opencode/gnome-stats-exporter.log > /tmp/log.tmp
mv /tmp/log.tmp ~/.local/share/opencode/gnome-stats-exporter.log
```

---

## When to Enable Debug Mode

✅ **Enable when:**
- Plugin not working
- Statistics not updating
- Need to verify token tracking
- Troubleshooting idle detection

❌ **Not needed for:**
- Normal daily use
- Plugin working correctly
- Performance-sensitive scenarios

---

## What You'll See in Logs

**Normal operation:**
```
[2024-01-04T15:30:45.123Z] [INFO] Tracked tokens for model | {"totalTokens":1500,"modelID":"claude-3-5-sonnet","cost":0.015}
[2024-01-04T15:45:00.456Z] [INFO] Session marked as idle (real-time event)
```

**Errors:**
```
[2024-01-04T15:30:50.000Z] [ERROR] Error saving stats | {"error":"EACCES: permission denied"}
```

**Debug details:**
```
[2024-01-04T15:30:44.000Z] [DEBUG] Received session.idle event from OpenCode
[2024-01-04T15:30:44.100Z] [DEBUG] No message data in event | {"eventKeys":["type","timestamp"]}
```

---

## Troubleshooting

**No log file created?**
```bash
# Check environment variable
echo $DEBUG_GNOME_STATS  # Should show: 1

# Check directory permissions
ls -la ~/.local/share/opencode/
```

**No "Tracked tokens" messages?**
- Have a conversation with AI in OpenCode first
- Check for ERROR messages in logs
- Verify plugin is loaded

**Permission errors?**
```bash
chmod 755 ~/.local/share/opencode
```

---

## Performance Impact

**Debug OFF (default):** Zero overhead ✅  
**Debug ON:** ~1-2ms per log entry ⚠️

💡 **Tip:** Only enable when actively troubleshooting.

---

## More Help

See detailed documentation:
- [DEBUG_LOGGING.md](./DEBUG_LOGGING.md) - Complete guide
- [README.md](./README.md) - Plugin documentation
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Technical details
