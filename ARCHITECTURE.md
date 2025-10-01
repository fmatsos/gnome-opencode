# Architecture Documentation

This document describes the technical architecture of the GNOME OpenCode Statistics Extension.

## Overview

The extension follows GNOME Shell's extension architecture, using JavaScript (GJS) with native GNOME bindings for optimal performance and integration.

## Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      GNOME Shell                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Extension System                          │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │     OpencodeStatsExtension                      │  │  │
│  │  │  ┌─────────────────────────────────────────┐   │  │  │
│  │  │  │      OpencodeIndicator                  │   │  │  │
│  │  │  │  ┌──────────────────────────────────┐   │   │  │  │
│  │  │  │  │  UI Components (PanelMenu)       │   │   │  │  │
│  │  │  │  │  - Icon                          │   │   │  │  │
│  │  │  │  │  - Menu Items                    │   │   │  │  │
│  │  │  │  │  - Statistics Display            │   │   │  │  │
│  │  │  │  └──────────────────────────────────┘   │   │  │  │
│  │  │  │  ┌──────────────────────────────────┐   │   │  │  │
│  │  │  │  │  Update Timer (GLib.timeout)     │   │   │  │  │
│  │  │  │  │  - Every 60 seconds              │   │   │  │  │
│  │  │  │  │  - Check idle & update display   │   │   │  │  │
│  │  │  │  └──────────────────────────────────┘   │   │  │  │
│  │  │  └─────────────────────────────────────────┘   │  │  │
│  │  │  ┌─────────────────────────────────────────┐   │  │  │
│  │  │  │      DataManager                        │   │  │  │
│  │  │  │  ┌──────────────────────────────────┐   │   │  │  │
│  │  │  │  │  Data Storage (JSON)             │   │   │  │  │
│  │  │  │  │  ~/.local/share/gnome-opencode/  │   │   │  │  │
│  │  │  │  │       statistics.json            │   │   │  │  │
│  │  │  │  └──────────────────────────────────┘   │   │  │  │
│  │  │  │  ┌──────────────────────────────────┐   │   │  │  │
│  │  │  │  │  OpenCode Integration            │   │   │  │  │
│  │  │  │  │  ~/.local/share/opencode/        │   │   │  │  │
│  │  │  │  │       stats.json                 │   │   │  │  │
│  │  │  │  └──────────────────────────────────┘   │   │  │  │
│  │  │  └─────────────────────────────────────────┘   │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Class Hierarchy

```
Extension (from GNOME Shell)
  └── OpencodeStatsExtension
        ├── enable()  - Initializes the extension
        └── disable() - Cleans up resources

PanelMenu.Button (from GNOME Shell UI)
  └── OpencodeIndicator
        ├── _init()            - Constructor
        ├── _buildMenu()       - Creates UI components
        ├── _updateDisplay()   - Refreshes statistics
        ├── _formatTokens()    - Formats numbers
        ├── _showModelBreakdown() - Shows detail notification
        ├── _checkIdleSession() - Monitors idle time
        └── destroy()          - Cleanup

DataManager (Custom)
  ├── constructor()             - Initialize data paths
  ├── _ensureDataDirectory()    - Create data dir if needed
  ├── _loadData()               - Load from storage
  ├── _saveData()               - Save to storage
  ├── _fetchFromOpencode()      - Read OpenCode stats
  ├── _updateFromOpencodeStats() - Update from OpenCode
  └── getStatistics()           - Return current stats
```

## Data Flow

```
┌──────────────┐
│  OpenCode    │
│   Process    │
└──────┬───────┘
       │ writes
       ▼
┌──────────────────────────────┐
│ ~/.local/share/opencode/     │
│      stats.json              │
└──────┬───────────────────────┘
       │ reads (every 60s)
       ▼
┌──────────────────────────────┐
│   DataManager                │
│   _fetchFromOpencode()       │
└──────┬───────────────────────┘
       │ updates
       ▼
┌──────────────────────────────┐
│ Internal data structure      │
│ (session, daily, total)      │
└──────┬───────────────────────┘
       │ persists
       ▼
┌──────────────────────────────┐
│ ~/.local/share/gnome-opencode│
│      statistics.json         │
└──────┬───────────────────────┘
       │ reads
       ▼
┌──────────────────────────────┐
│   OpencodeIndicator          │
│   _updateDisplay()           │
└──────┬───────────────────────┘
       │ renders
       ▼
┌──────────────────────────────┐
│   GNOME Shell UI             │
│   (Top Bar Icon + Menu)      │
└──────────────────────────────┘
```

## File Structure

```
gnome-opencode/
├── extension.js          # Main extension code
│   ├── OpencodeIndicator # UI and interaction logic
│   ├── DataManager       # Data persistence and retrieval
│   └── OpencodeStatsExtension # Extension lifecycle
├── metadata.json         # Extension metadata
├── stylesheet.css        # UI styling
├── install.sh            # Installation automation
├── uninstall.sh          # Uninstallation automation
├── package.sh            # Distribution packaging
├── test-data-generator.sh # Testing utility
└── [documentation files] # README, guides, etc.
```

## API Integration Points

### GNOME Shell APIs Used

1. **GObject** (`gi://GObject`)
   - Class registration
   - Inheritance system
   - Signal handling

2. **St** (`gi://St`)
   - Icon rendering
   - Label widgets
   - UI containers

3. **Gio** (`gi://Gio`)
   - File I/O operations
   - File existence checks
   - Directory creation
   - File monitoring (real-time updates)

4. **GLib** (`gi://GLib`)
   - Timer scheduling
   - Path manipulation
   - Time utilities

5. **Clutter** (`gi://Clutter`)
   - Event handling
   - Animations (future)

6. **Main** (`resource:///org/gnome/shell/ui/main.js`)
   - Panel integration
   - Notification system
   - System access

7. **PanelMenu** (`resource:///org/gnome/shell/ui/panelMenu.js`)
   - Top bar buttons
   - Menu integration

8. **PopupMenu** (`resource:///org/gnome/shell/ui/popupMenu.js`)
   - Menu items
   - Separators
   - Sections

### External Integration

The extension integrates with OpenCode through:
- **File-based**: Reads `~/.local/share/opencode/stats.json`
- **Format**: JSON with session, daily, and total statistics
- **Real-time monitoring**: Uses Gio.FileMonitor to detect file changes instantly
- **Fallback polling**: Checks for updates every 60 seconds as backup

## State Management

### Extension State

```javascript
{
  _indicator: OpencodeIndicator | null,  // Current indicator instance
  _extension: Extension                   // Extension instance
}
```

### Indicator State

```javascript
{
  _extension: Extension,                  // Reference to extension
  _dataManager: DataManager,              // Data manager instance
  _idleCheckerId: number | null,         // GLib timeout ID
  _sessionSection: PopupMenuSection,     // Session UI section
  _dailySection: PopupMenuSection,       // Daily UI section
  _totalSection: PopupMenuSection,       // Total UI section
  _sessionLabel: PopupMenuItem,          // Session display
  _dailyLabel: PopupMenuItem,            // Daily display
  _totalLabel: PopupMenuItem             // Total display
}
```

### Data Structure

```javascript
{
  session: {
    tokens: number,                       // Total session tokens
    models: { [model: string]: number },  // Per-model breakdown
    lastActivity: number | null,          // Unix timestamp (ms)
    startTime: number                     // Session start time
  },
  daily: {
    tokens: number,                       // Today's tokens
    models: { [model: string]: number },  // Per-model breakdown
    date: string                          // ISO date (YYYY-MM-DD)
  },
  total: {
    tokens: number,                       // All-time tokens
    models: { [model: string]: number },  // Per-model breakdown
    installDate: number                   // Install timestamp
  }
}
```

## Lifecycle

### Extension Lifecycle

```
1. GNOME Shell loads extension
2. enable() called
   └─> Create OpencodeIndicator
   └─> Add to status area
3. Extension runs
   └─> Timer triggers every 60s
   └─> User interactions
4. disable() called
   └─> Destroy indicator
   └─> Clean up timers
5. Extension unloaded
```

### Update Cycle

```
Every 60 seconds:
1. Timer fires
2. _checkIdleSession()
   └─> Calculate idle time
   └─> Show notification if >15 min
3. _updateDisplay()
   └─> DataManager.getStatistics()
   └─> Format tokens
   └─> Update UI labels
4. Auto-refresh from OpenCode
   └─> DataManager._fetchFromOpencode()
   └─> Read OpenCode stats file
   └─> Merge with internal data
   └─> Save to persistent storage
```

## Performance Considerations

### Optimizations

1. **Lazy Loading**: Data loaded only when needed
2. **Efficient Polling**: 60-second intervals (configurable)
3. **Minimal UI Updates**: Only update labels when data changes
4. **Lightweight Storage**: Simple JSON files
5. **No Heavy Dependencies**: Pure GNOME Shell APIs

### Resource Usage

- **Memory**: ~2-3 MB (typical GNOME Shell extension)
- **CPU**: Negligible (timer runs every 60s)
- **I/O**: 2 file reads per minute (very light)
- **Network**: None (all local)

## Error Handling

### File I/O Errors

```javascript
try {
  // File operation
} catch (e) {
  logError(e, 'Operation failed');
  // Graceful fallback
}
```

### Missing Data

- If OpenCode stats don't exist, display "0 tokens"
- If internal data is corrupted, reset to defaults
- If directory creation fails, log error but continue

### UI Errors

- Menu always displays (never crashes)
- Notifications are optional (fail silently)
- Refresh button always works

## Security Considerations

1. **File Permissions**: 
   - Data stored in user's home directory
   - Standard Unix permissions (0644)
   - No sensitive data exposed

2. **No Network Access**: 
   - All operations are local
   - No external connections
   - No telemetry or tracking

3. **Resource Isolation**:
   - Runs in GNOME Shell process
   - Sandboxed by GNOME Shell security
   - Limited system access

## Future Architecture Enhancements

### Planned Improvements

1. **API Integration**
   - WebSocket connection to OpenCode
   - Real-time updates
   - Push notifications

2. **Database Backend**
   - SQLite for historical data
   - Query optimization
   - Trend analysis

3. **Preferences System**
   - GSettings backend
   - UI configuration dialog
   - User customization

4. **Plugin System**
   - Custom data sources
   - Third-party integrations
   - Extensibility

## Testing Strategy

### Manual Testing

1. Install extension
2. Generate test data
3. Verify UI displays correctly
4. Test idle notifications
5. Test refresh functionality

### Automated Testing (Future)

- Unit tests for DataManager
- Integration tests for UI
- E2E tests with mock OpenCode

## Debugging

### View Logs

```bash
journalctl -f -o cat /usr/bin/gnome-shell | grep opencode
```

### Enable Debug Mode

Edit extension.js and add:
```javascript
const DEBUG = true;

function debug(msg) {
  if (DEBUG) log('[OpenCode] ' + msg);
}
```

### Inspect Extension State

Use Looking Glass (Alt+F2, type 'lg'):
```javascript
global.get_window_actors()[0].meta_window.get_title()
```

## Maintenance

### Version Updates

1. Update `metadata.json` version
2. Update `CHANGELOG.md`
3. Run `./package.sh`
4. Test installation
5. Create GitHub release

### Dependency Updates

Extension has no external dependencies beyond GNOME Shell itself.
Monitor GNOME Shell API changes for compatibility.

## References

- [GNOME Shell Extension Guide](https://gjs.guide/extensions/)
- [GJS Documentation](https://gjs-docs.gnome.org/)
- [GNOME Shell Source](https://gitlab.gnome.org/GNOME/gnome-shell)
- [OpenCode Repository](https://github.com/sst/opencode)
