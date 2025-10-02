# Fix Summary: GNOME Stats Exporter Plugin

## Issue
Plugin was installed but not tracking token usage - `stats.json` file remained empty.

## Root Cause
**Incorrect event property access path at Line 147**

```typescript
// WRONG ❌
const message = event.info || event.payload || event.data || event.message;

// CORRECT ✅
const message = event.properties?.info;
```

## Why This Matters

According to OpenCode SDK v0.4.44, the event structure is:
```typescript
EventMessageUpdated = {
  type: "message.updated",
  properties: {
    info: Message  // ← Data is nested here, not at root
  }
}
```

## The Fix

**File**: `gnome-stats-exporter.ts`

### Change 1 (Line 147):
```diff
- const message = event.info || event.payload || event.data || event.message;
+ const message = event.properties?.info;
```

### Change 2 (Line 156):
```diff
- if (message.role === "assistant" && message.time?.completed) {
+ if (message?.role === "assistant" && message.time?.completed) {
```

## Installation Status

✅ **Plugin Fixed and Installed**

- **Source**: `/srv/www/github/gnome-opencode/opencode-plugin/gnome-stats-exporter.ts`
- **Local Copy**: `/srv/www/github/gnome-opencode/.opencode/plugin/gnome-stats-exporter.ts`
- **Global Install**: `~/.config/opencode/plugin/gnome-stats-exporter.ts`
- **Stats File**: `~/.local/share/opencode/stats.json` (initialized)

## Testing

```bash
# 1. Verify plugin is installed
ls -l ~/.config/opencode/plugin/gnome-stats-exporter.ts

# 2. Start OpenCode and have a conversation
opencode

# 3. Check stats are being tracked
cat ~/.local/share/opencode/stats.json | jq '.session.totalTokens'
```

Expected result: Non-zero token count after AI interactions.

## Technical Details

- **SDK Version**: `@opencode-ai/plugin@0.4.44`
- **OpenCode Version**: 0.14.0
- **Fix Type**: Single-line property access correction
- **Impact**: Critical - Enables entire plugin functionality

## References

- OpenCode Plugin Manual: https://github.com/Laelia-Succubus/Opencode-Plugin-Manual
- Working Examples: https://github.com/ericc-ch/opencode-plugins
- Full Details: See `BUGFIX.md`

---

**Status**: ✅ FIXED  
**Date**: October 2, 2025
