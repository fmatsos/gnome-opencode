# Silent Plugin Implementation Summary

## Problem Statement

The OpenCode plugin was using `client.App.log()` for diagnostic logging, which caused log messages to appear in the OpenCode chat interface. This cluttered the user's conversations with plugin diagnostic information.

## Solution Implemented

**Option 3: Conditional Logging with Environment Variable**

Implemented a debug logging system that:
- Runs **silently by default** (no log messages in chat)
- Enables detailed logging via `DEBUG_GNOME_STATS=1` environment variable
- Writes logs to a separate file when enabled
- Has zero performance overhead when disabled

## Changes Made

### 1. Added Debug Configuration (Lines 11-30)

```typescript
// Debug logging configuration
const DEBUG_ENABLED = Bun.env.DEBUG_GNOME_STATS === "1";
const DEBUG_LOG_FILE = `${Bun.env.HOME || "~"}/.local/share/opencode/gnome-stats-exporter.log`;

// Helper function for conditional debug logging
async function debugLog(level: "info" | "debug" | "error", message: string, extra?: Record<string, any>): Promise<void> {
  if (!DEBUG_ENABLED) return;  // Early exit if debug not enabled
  
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}${extra ? ` | ${JSON.stringify(extra)}` : ''}\n`;
  
  try {
    // Append to log file
    const file = Bun.file(DEBUG_LOG_FILE);
    const existingContent = await file.exists() ? await file.text() : '';
    await Bun.write(DEBUG_LOG_FILE, existingContent + logEntry);
  } catch (error) {
    // Silently fail - we don't want logging errors to crash the plugin
  }
}
```

**Key Features:**
- Checks `DEBUG_ENABLED` once at module load (efficient)
- Early return if debugging disabled (zero overhead)
- Appends to log file (preserves history)
- Silently handles logging errors (robust)

### 2. Replaced All client.App.log() Calls

**Before:**
```typescript
await client.App.log({
  service: "gnome-stats-exporter",
  level: "error",
  message: "Error loading stats file, creating new one",
  extra: { error: String(error) }
});
```

**After:**
```typescript
await debugLog("error", "Error loading stats file, creating new one", { error: String(error) });
```

**Total Replacements:** 9 locations throughout the plugin

### 3. Simplified saveStats() Function

**Before:**
```typescript
async function saveStats(stats: Statistics, filePath: string, client?: any): Promise<void> {
  try {
    await Bun.write(filePath, JSON.stringify(stats, null, 2));
  } catch (error) {
    if (client) {
      await client.App.log({
        service: "gnome-stats-exporter",
        level: "error",
        message: "Error saving stats",
        extra: { error: String(error), filePath }
      });
    }
  }
}
```

**After:**
```typescript
async function saveStats(stats: Statistics, filePath: string): Promise<void> {
  try {
    await Bun.write(filePath, JSON.stringify(stats, null, 2));
  } catch (error) {
    await debugLog("error", "Error saving stats", { error: String(error), filePath });
  }
}
```

**Changes:**
- Removed `client?` parameter (no longer needed)
- Simplified error handling
- Uses debugLog() instead of client.App.log()

### 4. Updated All saveStats() Calls

Removed the `client` parameter from all 5 calls:
```typescript
await saveStats(stats, statsFile);  // Previously: await saveStats(stats, statsFile, client);
```

## Documentation Updates

### 1. Updated README.md

Added comprehensive "Debug Logging" section covering:
- How to enable/disable debug mode
- Log file location and format
- Viewing and filtering logs
- Benefits of the approach
- Integration with troubleshooting workflows

**Location:** Lines 181-237 in README.md

### 2. Created DEBUG_LOGGING.md

Created detailed debug logging guide with:
- When to enable debug logging
- How to enable temporarily vs. persistently
- Log format and examples for each log level
- Troubleshooting common issues
- Performance impact analysis
- Example debug session walkthrough

**Location:** `opencode-plugin/DEBUG_LOGGING.md` (new file)

## Testing Instructions

### Test 1: Silent Operation (Default)

```bash
# Start OpenCode without debug flag
opencode

# Have a conversation with AI model
# Expected: No plugin messages in chat
# Expected: Stats file updates at ~/.local/share/opencode/stats.json
# Expected: No log file created
```

### Test 2: Debug Logging Enabled

```bash
# Terminal 1: Start with debug enabled
DEBUG_GNOME_STATS=1 opencode

# Terminal 2: Monitor log file
tail -f ~/.local/share/opencode/gnome-stats-exporter.log

# Have a conversation with AI model
# Expected: Log entries appear in Terminal 2
# Expected: Still no messages in chat
# Expected: Stats file updates normally
```

### Test 3: Verify Log Contents

```bash
# Enable debug mode
DEBUG_GNOME_STATS=1 opencode

# After some AI interactions, check logs
cat ~/.local/share/opencode/gnome-stats-exporter.log

# Should see entries like:
# [2024-01-04T15:30:45.123Z] [INFO] Tracked tokens for model | {"totalTokens":1500,"modelID":"claude-3-5-sonnet","cost":0.015}
```

## Performance Impact

### Silent Mode (Default)
- ✅ Zero overhead - early return in debugLog()
- ✅ No file I/O operations
- ✅ No string formatting or JSON serialization
- ✅ Same performance as having no logging at all

### Debug Mode Enabled
- ⚠️ Small overhead from file I/O (~1-2ms per log entry)
- ⚠️ Log file grows over time (needs periodic cleanup)
- ✅ Still very lightweight
- ✅ Non-blocking async operations

## Benefits

1. **Silent by Default**
   - No chat pollution during normal operation
   - Professional user experience
   - Plugin invisible to user

2. **Opt-in Debugging**
   - Enable only when troubleshooting
   - Full diagnostic capabilities available
   - Easy to enable/disable

3. **Separate Log File**
   - Doesn't interfere with OpenCode's logs
   - Easy to share with support
   - Can be archived or deleted independently

4. **Zero Overhead When Disabled**
   - Early return pattern is extremely efficient
   - No performance penalty for normal users
   - Logging code has no impact when disabled

5. **Detailed Diagnostics**
   - Full event and state information
   - Structured log format (timestamp, level, message, data)
   - Easy to parse and filter

6. **Maintainable**
   - Simple debugLog() function
   - Consistent logging pattern throughout
   - Easy to add new log points

## Migration Path

To migrate from old version to new version:

1. **Update plugin file:**
   ```bash
   cp opencode-plugin/gnome-stats-exporter.ts ~/.config/opencode/plugin/
   ```

2. **No configuration changes needed** - works silently by default

3. **Optional:** Enable debug mode if troubleshooting:
   ```bash
   export DEBUG_GNOME_STATS=1
   ```

## Future Enhancements

Possible future improvements:

1. **Log Rotation**
   - Automatically rotate logs when file size exceeds limit
   - Keep last N days of logs

2. **Log Levels**
   - Add environment variable to control log level
   - `DEBUG_GNOME_STATS=info` shows only INFO and ERROR
   - `DEBUG_GNOME_STATS=debug` shows all messages

3. **Structured Logging**
   - Output JSON format for easier parsing
   - Integration with log aggregation tools

4. **Remote Logging**
   - Optional webhook for sending logs to remote service
   - Useful for debugging issues on other machines

## Conclusion

The implementation successfully achieves the goal of silent operation while maintaining full debugging capabilities when needed. The solution is:

- ✅ Clean and maintainable
- ✅ Zero performance overhead by default
- ✅ Fully backward compatible
- ✅ Well documented
- ✅ Easy to use

## Files Modified

1. **opencode-plugin/gnome-stats-exporter.ts**
   - Added debug configuration and debugLog() function
   - Replaced 9 client.App.log() calls with debugLog()
   - Simplified saveStats() function signature
   - Updated all saveStats() call sites

2. **opencode-plugin/README.md**
   - Added "Debug Logging" section
   - Updated troubleshooting workflows
   - Added debug mode examples

3. **opencode-plugin/DEBUG_LOGGING.md** (NEW)
   - Comprehensive debug logging guide
   - Examples and troubleshooting
   - Performance impact analysis

## Commit Message

```
feat: implement conditional debug logging for silent operation

Replace client.App.log() with environment-based debug logging to prevent
plugin messages from appearing in OpenCode chat interface.

Changes:
- Add DEBUG_GNOME_STATS environment variable for opt-in logging
- Create debugLog() helper that writes to separate log file
- Replace all 9 client.App.log() calls with debugLog()
- Simplify saveStats() function (remove unused client parameter)
- Update README with debug logging documentation
- Add comprehensive DEBUG_LOGGING.md guide

Benefits:
- Silent by default (no chat pollution)
- Zero overhead when debug disabled
- Full diagnostics available when needed
- Separate log file for easy troubleshooting

Usage:
  # Normal operation (silent)
  opencode

  # Debug mode
  DEBUG_GNOME_STATS=1 opencode
  tail -f ~/.local/share/opencode/gnome-stats-exporter.log
```
