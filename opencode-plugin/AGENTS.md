# AGENTS.md - OpenCode Plugin

<!--
---
agent_config:
  context: "OpenCode plugin for token usage tracking"
  runtime: "Bun (required by OpenCode)"
  language: "TypeScript"
  main_file: "gnome-stats-exporter.ts"
  test_command: "DEBUG_GNOME_STATS=1 opencode"
  build_command: "none (TypeScript runs directly in Bun)"
  
safe_operations:
  - "Reading and modifying gnome-stats-exporter.ts"
  - "Adding new fields to Statistics interface"
  - "Adding new event handlers"
  - "Improving debug logging"
  - "Updating documentation in README.md"

unsafe_operations:
  - "Changing stats.json file location (breaks GNOME extension)"
  - "Removing existing Statistics fields (breaks backward compatibility)"
  - "Removing debug logging infrastructure"
  - "Adding console.log (pollutes OpenCode chat)"
  - "Changing event handler signatures (breaks Plugin API contract)"

deterministic_paths:
  plugin_source: "opencode-plugin/gnome-stats-exporter.ts"
  stats_output: "~/.local/share/opencode/stats.json"
  debug_log: "~/.local/share/opencode/gnome-stats-exporter.log"
  global_install: "~/.config/opencode/plugin/"
  project_install: ".opencode/plugin/"
---
-->

> **Note**: This file provides agent-specific guidance for the `opencode-plugin/` subdirectory. For general project guidance, see [../AGENTS.md](../AGENTS.md).

## Quick Context

This directory contains the **OpenCode Plugin** that tracks token usage and exports statistics to a JSON file. It runs inside OpenCode (Bun runtime) and communicates with the GNOME Shell extension via a shared JSON file.

**Key File**: `gnome-stats-exporter.ts` - The main plugin implementation (265 lines)

## Agent Quick Start

### Deterministic Development Commands

```bash
# From opencode-plugin/ directory

# 1. Install dependencies (no build step needed - TypeScript runs directly in Bun)
npm install

# 2. Test the plugin locally in a project
mkdir -p .opencode/plugin
cp gnome-stats-exporter.ts .opencode/plugin/
cp package.json .opencode/plugin/

# 3. Enable debug logging and start OpenCode
DEBUG_GNOME_STATS=1 opencode

# 4. Monitor plugin logs in real-time
tail -f ~/.local/share/opencode/gnome-stats-exporter.log

# 5. Verify stats file is being written
cat ~/.local/share/opencode/stats.json

# 6. Install plugin globally for all OpenCode sessions
../install-opencode-plugin.sh
```

### Key File Locations (Deterministic Paths)

- **Plugin source**: `opencode-plugin/gnome-stats-exporter.ts`
- **Plugin metadata**: `opencode-plugin/package.json`
- **Stats output**: `~/.local/share/opencode/stats.json` (created by plugin)
- **Debug log**: `~/.local/share/opencode/gnome-stats-exporter.log` (when `DEBUG_GNOME_STATS=1`)
- **Global install**: `~/.config/opencode/plugin/gnome-stats-exporter.ts`
- **Project install**: `.opencode/plugin/gnome-stats-exporter.ts`

## Development Workflow

### Making Changes to the Plugin

```bash
# 1. Edit the plugin
$EDITOR gnome-stats-exporter.ts

# 2. Test changes (OpenCode auto-reloads plugins on restart)
# Stop OpenCode (Ctrl+C if running, or exit the chat session)
# Restart with debug mode
DEBUG_GNOME_STATS=1 opencode

# 3. Verify changes in logs
tail -f ~/.local/share/opencode/gnome-stats-exporter.log

# 4. Check stats output format
jq . ~/.local/share/opencode/stats.json

# 5. Test with the GNOME extension
# (See parent AGENTS.md for GNOME extension testing)
```

### Testing Workflow

```bash
# Test token tracking
# 1. Start OpenCode with debug mode
DEBUG_GNOME_STATS=1 opencode

# 2. Have a conversation with an AI model
# (Type some prompts and get responses)

# 3. Verify tokens are tracked
cat ~/.local/share/opencode/stats.json

# 4. Check logs for tracking events
grep "Tracked tokens" ~/.local/share/opencode/gnome-stats-exporter.log

# Test idle detection
# 1. Use OpenCode for a few messages
# 2. Wait 15+ minutes without activity
# 3. Check stats file for idle flag
jq '.session.isIdle' ~/.local/share/opencode/stats.json

# Test daily reset
# 1. Generate some stats today
# 2. Manually change date in stats.json to yesterday
# 3. Restart OpenCode and send a message
# 4. Verify daily stats reset to 0 for new day
```

## Code Structure & Key Concepts

### Plugin Entry Point

```typescript
export const GnomeStatsExporter: Plugin = async ({ client, project, directory, worktree, $ }) => {
  // Plugin initialization and setup
  return {
    "event": async ({ event }) => {
      // Event handler for message.updated and session.idle
    }
  };
};
```

### Event Types the Plugin Listens To

1. **`message.updated`**: Fired when an AI message is updated
   - Extracts token usage from completed assistant messages
   - Updates session, daily, and total statistics

2. **`session.idle`**: Fired by OpenCode when the session becomes idle
   - Sets `isIdle: true` in stats file immediately
   - Triggers idle notifications in GNOME extension

### Data Flow

```
OpenCode AI Interaction
  ↓
message.updated event
  ↓
Extract tokens from message.tokens
  ↓
Update statistics (session, daily, total)
  ↓
Write to ~/.local/share/opencode/stats.json
  ↓
GNOME extension reads file (via file monitor or polling)
  ↓
Display in system tray
```

### Statistics Structure

```typescript
interface Statistics {
  session: {
    totalTokens: number;
    tokensByModel: Record<string, number>;
    lastActivity: number;        // Unix timestamp (ms)
    startTime: number;            // Unix timestamp (ms)
    isIdle?: boolean;             // Set by session.idle event
    idleSince?: number;           // Unix timestamp (ms)
  };
  daily: {
    totalTokens: number;
    tokensByModel: Record<string, number>;
    date: string;                 // "YYYY-MM-DD"
  };
  total: {
    totalTokens: number;
    tokensByModel: Record<string, number>;
    installDate: number;          // Unix timestamp (ms)
  };
}
```

## Agent Safety Guidelines

### What Agents SHOULD Do

✅ **Read before modifying**: Always read `gnome-stats-exporter.ts` before making changes
✅ **Preserve event handling**: Keep both `message.updated` and `session.idle` event handlers
✅ **Maintain backward compatibility**: Don't change the stats.json structure without updating the GNOME extension
✅ **Test with debug mode**: Always test changes with `DEBUG_GNOME_STATS=1`
✅ **Validate JSON writes**: Use `JSON.stringify(stats, null, 2)` for readable output
✅ **Handle errors gracefully**: Wrap file operations in try-catch blocks

### What Agents SHOULD NOT Do

❌ **Don't break the data contract**: The GNOME extension expects specific JSON structure
❌ **Don't remove debug logging infrastructure**: Keep the `debugLog` function and `DEBUG_ENABLED` check
❌ **Don't add console.log**: Use `debugLog()` instead to avoid polluting OpenCode chat
❌ **Don't hardcode paths**: Use `Bun.env.HOME` and construct paths dynamically
❌ **Don't assume synchronous operations**: Always use `await` for file operations
❌ **Don't ignore TypeScript types**: Maintain type safety for Plugin API compatibility

## Common Tasks for Agents

### Task: Add Cost Tracking

```typescript
// 1. Extend Statistics interface to include cost
interface Statistics {
  session: {
    // ... existing fields
    totalCost: number;
    costByModel: Record<string, number>;
  };
  // ... same for daily and total
}

// 2. Extract cost from message in event handler
const cost = message.cost || 0;
stats.session.totalCost += cost;
stats.session.costByModel[modelID] = 
  (stats.session.costByModel[modelID] || 0) + cost;

// 3. Update GNOME extension to display cost (in ../extension.js)
```

### Task: Add New Event Listener

```typescript
// In the event handler return object:
return {
  "event": async ({ event }) => {
    // Existing handlers for message.updated and session.idle
    
    // Add new event handler
    if (event.type === "session.start") {
      await debugLog("info", "New session started");
      // Handle session start
    }
  }
};
```

### Task: Change Stats File Location

```typescript
// Modify these lines in GnomeStatsExporter function:
const homeDir = Bun.env.HOME || "~";
const statsDir = `${homeDir}/.local/share/opencode`;  // Change this path
const statsFile = `${statsDir}/stats.json`;

// Also update:
// 1. README.md documentation
// 2. GNOME extension (extension.js) to read from new location
// 3. Debug log path (DEBUG_LOG_FILE constant)
```

### Task: Add Response Time Tracking

```typescript
// 1. Add to Statistics interface
interface Statistics {
  session: {
    // ... existing fields
    averageResponseTime: number;
    responseTimeByModel: Record<string, number[]>;
  };
}

// 2. Extract timing from message
const startTime = message.time?.start || 0;
const completedTime = message.time?.completed || 0;
const responseTime = completedTime - startTime;

// 3. Update statistics
stats.session.responseTimeByModel[modelID] = 
  stats.session.responseTimeByModel[modelID] || [];
stats.session.responseTimeByModel[modelID].push(responseTime);

// 4. Calculate average
const times = stats.session.responseTimeByModel[modelID];
stats.session.averageResponseTime = 
  times.reduce((a, b) => a + b, 0) / times.length;
```

## Debugging Checklist

When the plugin isn't working as expected:

- [ ] Is `DEBUG_GNOME_STATS=1` set?
- [ ] Does the debug log file exist and have recent entries?
- [ ] Is the plugin file in the correct location (`.opencode/plugin/` or `~/.config/opencode/plugin/`)?
- [ ] Is `package.json` present alongside the plugin TypeScript file?
- [ ] Does the stats.json file exist and have recent `lastActivity` timestamp?
- [ ] Are there TypeScript errors in the plugin code? (Check OpenCode output)
- [ ] Is Bun available? (Required for OpenCode plugins)
- [ ] Are file permissions correct for `~/.local/share/opencode/`?

## Integration with GNOME Extension

The plugin and GNOME extension communicate via a shared JSON file. Changes to the plugin's data format require corresponding changes to the extension.

### Files to Update When Changing Data Format

1. **Plugin**: `opencode-plugin/gnome-stats-exporter.ts` - Change `Statistics` interface and update logic
2. **Extension**: `../extension.js` - Update `_loadStatistics()` method to parse new format
3. **Documentation**: `README.md` - Update statistics file format example
4. **Tests**: Generate new test data with `../test-data-generator.sh` (if it exists)

### Versioning Considerations

If adding new optional fields:
- ✅ Safe: GNOME extension can ignore unknown fields
- ✅ Safe: Plugin can check for field existence before using

If removing or renaming fields:
- ❌ Breaking: GNOME extension will fail to parse stats
- 🔧 Solution: Add version field to stats.json and handle migration

## Performance Considerations

### File I/O

- Stats file is written on **every AI message** - keep writes fast
- Use `Bun.write()` (native Bun API) for efficient file writes
- Don't add blocking operations in the event handler
- Consider batching writes if frequency becomes an issue

### Memory

- Plugin runs in OpenCode process - keep memory footprint small
- Don't accumulate unbounded data (e.g., all response times)
- Reset session stats on plugin load to avoid memory leaks

### Debug Logging

- Debug logs are **only written when `DEBUG_GNOME_STATS=1`**
- Use `if (!DEBUG_ENABLED) return;` early exit for performance
- Avoid expensive string operations when debug is off

## Testing with TDD

When adding new features to the plugin, follow TDD principles:

### 1. Write Test Scenarios

```typescript
// Example: Test cost tracking feature
// Test scenario 1: Single message with cost
// Expected: session.totalCost equals message.cost

// Test scenario 2: Multiple messages with different models
// Expected: costByModel has separate totals per model

// Test scenario 3: Daily reset
// Expected: daily.totalCost resets to 0 on new day
```

### 2. Manual Testing (No Automated Tests Yet)

Since OpenCode plugins run in a special runtime, manual testing is currently required:

```bash
# Test 1: Install plugin and start OpenCode
DEBUG_GNOME_STATS=1 opencode

# Test 2: Send a message and check stats file
# Send: "Hello AI"
cat ~/.local/share/opencode/stats.json
# Verify: session.totalTokens > 0

# Test 3: Check idle detection
# Wait 15 minutes, then check stats file
jq '.session.isIdle' ~/.local/share/opencode/stats.json
# Expected: true
```

### 3. Refactor After Tests Pass

- Extract common logic into helper functions
- Keep event handler focused on event processing
- Maintain clear separation of concerns

## Example Agent Prompts

### Safe Prompt Examples

✅ "Add cost tracking to the plugin. Read gnome-stats-exporter.ts first, then show me the changes needed."

✅ "Enable response time tracking in the stats file. Ensure backward compatibility with existing GNOME extension."

✅ "Fix the idle detection to trigger immediately when session.idle event fires. Add debug logging for the event."

✅ "Add a new field to track the number of messages per model. Update the Statistics interface and event handler."

### Risky Prompt Examples (Require Caution)

⚠️ "Rewrite the plugin to use a database instead of JSON" - Major architectural change, affects GNOME extension integration

⚠️ "Remove the debug logging to improve performance" - Removes debugging capability, makes troubleshooting harder

⚠️ "Change the stats file location to /tmp" - May break existing installations, loses data on reboot

⚠️ "Add automatic upload of stats to a remote server" - Privacy concern, requires network access, adds dependency

## Resources

- **OpenCode Plugin API**: [https://github.com/sst/opencode/tree/main/packages/plugin](https://github.com/sst/opencode/tree/main/packages/plugin)
- **Bun Documentation**: [https://bun.sh/docs](https://bun.sh/docs)
- **TypeScript Handbook**: [https://www.typescriptlang.org/docs/handbook/intro.html](https://www.typescriptlang.org/docs/handbook/intro.html)
- **Parent AGENTS.md**: [../AGENTS.md](../AGENTS.md) - General project guidance

## Checklist Before Submitting Plugin Changes

- [ ] Read the existing code before making changes
- [ ] Test with `DEBUG_GNOME_STATS=1 opencode`
- [ ] Verify stats.json format is correct with `jq . ~/.local/share/opencode/stats.json`
- [ ] Check debug logs for errors: `grep ERROR ~/.local/share/opencode/gnome-stats-exporter.log`
- [ ] Test with actual OpenCode usage (send multiple messages)
- [ ] Verify GNOME extension still displays stats correctly
- [ ] Update README.md if data format changed
- [ ] Follow commit message format from parent AGENTS.md
- [ ] Keep TypeScript types updated
- [ ] Maintain backward compatibility or document breaking changes

---

**For general project guidance, testing the GNOME extension, and PR workflow, see [../AGENTS.md](../AGENTS.md).**
