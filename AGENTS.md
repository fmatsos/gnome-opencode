# AGENTS.md

## Project Overview

This project is a GNOME Shell extension that displays OpenCode AI usage statistics in the GNOME top bar. It tracks token usage across sessions, days, and total usage since installation, with per-model breakdowns and idle session notifications.

**Key Components:**
- **GNOME Shell Extension**: JavaScript/GJS extension for displaying statistics in the system tray
- **OpenCode Plugin**: TypeScript plugin that exports token statistics from OpenCode to a JSON file
- **Data Format**: JSON-based statistics with session/daily/total token tracking

## Setup Commands

### Install Dependencies

```bash
# No external dependencies for the GNOME extension itself
# The extension uses GNOME Shell's built-in GJS libraries

# For the OpenCode plugin (in opencode-plugin/ directory)
cd opencode-plugin
npm install
```

### Install the Extension

```bash
# Automated installation (recommended)
./install.sh

# Manual installation
mkdir -p ~/.local/share/gnome-shell/extensions/
cp -r . ~/.local/share/gnome-shell/extensions/opencode-stats@fmatsos.github.com
glib-compile-schemas ~/.local/share/gnome-shell/extensions/opencode-stats@fmatsos.github.com/schemas/
```

### Enable the Extension

```bash
gnome-extensions enable opencode-stats@fmatsos.github.com
```

### Install OpenCode Plugin

```bash
# Install plugin globally for all OpenCode sessions
./install-opencode-plugin.sh

# Or manually copy to project-level plugin directory
mkdir -p .opencode/plugin
cp opencode-plugin/gnome-stats-exporter.ts .opencode/plugin/
cp opencode-plugin/package.json .opencode/plugin/
```

## Development Workflow

### Reload Extension After Changes

```bash
# Disable and re-enable to reload changes
gnome-extensions disable opencode-stats@fmatsos.github.com
gnome-extensions enable opencode-stats@fmatsos.github.com

# On X11, you can also restart GNOME Shell: Alt+F2, type 'r', press Enter
# On Wayland, log out and log back in
```

### View Extension Logs

```bash
# Real-time log monitoring (recommended for debugging)
journalctl -f -o cat /usr/bin/gnome-shell | grep opencode

# Or use Looking Glass (Alt+F2, type 'lg') for interactive debugging
```

### Enable Debug Mode

In `extension.js`, set:
```javascript
const DEBUG = true;
```

Then reload the extension to see verbose logging.

### OpenCode Plugin Debug Logging

```bash
# Enable debug logging for the OpenCode plugin
export DEBUG_GNOME_STATS=1

# Start OpenCode
opencode

# View plugin logs
tail -f ~/.local/share/opencode/gnome-stats-exporter.log
```

## Testing Instructions

### Generate Test Data

```bash
# Generate mock statistics for UI testing
./test-data-generator.sh

# Test real-time file monitoring
./test-realtime-sync.sh
```

### Manual Testing Checklist

1. **Installation Test**:
   - Run `./install.sh`
   - Check that extension appears in top bar after enabling
   - Verify no errors in logs

2. **UI Test**:
   - Click the terminal icon in the top bar
   - Verify statistics display correctly (Session, Today, Total)
   - Test "View Details" buttons for per-model breakdown
   - Test "Refresh Statistics" button

3. **Real-time Updates Test**:
   - Use OpenCode to generate AI responses
   - Verify statistics update within 60 seconds (or immediately with file monitoring)
   - Check `lastActivity` timestamp updates

4. **Idle Detection Test**:
   - Use OpenCode, then wait 15+ minutes without activity
   - Verify idle notification appears
   - Check notification closes after ~5 seconds or manual dismissal

5. **Preferences Test**:
   - Open preferences: `gnome-extensions prefs opencode-stats@fmatsos.github.com`
   - Modify idle threshold, polling interval, and file monitoring settings
   - Reload extension and verify settings apply

### File Locations to Verify

- Extension install: `~/.local/share/gnome-shell/extensions/opencode-stats@fmatsos.github.com/`
- Statistics data: `~/.local/share/gnome-opencode/statistics.json`
- OpenCode stats: `~/.local/share/opencode/stats.json`
- Plugin logs: `~/.local/share/opencode/gnome-stats-exporter.log` (if debug enabled)

## Code Style Guidelines

### JavaScript/GJS (Extension Code)

- **Indentation**: 4 spaces (matching GNOME Shell conventions)
- **Naming Conventions**:
  - camelCase for variables and functions
  - PascalCase for class names
  - UPPER_SNAKE_CASE for constants
- **Line Length**: Keep under 120 characters when reasonable
- **Imports**: Always import GNOME modules explicitly at the top:
  ```javascript
  import GObject from 'gi://GObject';
  import St from 'gi://St';
  import * as Main from 'resource:///org/gnome/shell/ui/main.js';
  ```

### TypeScript (OpenCode Plugin)

- **Indentation**: 2 spaces
- **Naming Conventions**: camelCase for variables and functions
- **Type Safety**: Use TypeScript types where possible
- **Async/Await**: Prefer async/await over promise chains

### Error Handling

Always use try-catch blocks and log errors properly:

```javascript
try {
    // risky operation
} catch (e) {
    logError(e, 'Failed to perform operation');
    // handle error gracefully
}
```

### Resource Cleanup

Always clean up resources in destroy methods:

```javascript
destroy() {
    if (this._timeout) {
        GLib.source_remove(this._timeout);
        this._timeout = null;
    }
    if (this._fileMonitor) {
        this._fileMonitor.cancel();
        this._fileMonitor = null;
    }
    super.destroy();
}
```

### GObject Registration

Use `GObject.registerClass` for creating GObject-based classes:

```javascript
const MyClass = GObject.registerClass(
class MyClass extends ParentClass {
    _init() {
        super._init();
        // initialization
    }
});
```

## Build Instructions

### Package Extension for Distribution

```bash
# Create a .zip file for extensions.gnome.org
./package.sh

# This creates: opencode-stats@fmatsos.github.com.shell-extension.zip
```

### GSettings Schema Compilation

When modifying `schemas/org.gnome.shell.extensions.opencode-stats.gschema.xml`:

```bash
# Compile schemas
glib-compile-schemas schemas/

# Or let install.sh do it automatically
./install.sh
```

## Pull Request Guidelines

### Commit Message Format

Use clear, descriptive commit messages:

```bash
# Format: <type>: <description>
# Examples:
git commit -m "feat: add cost tracking per model"
git commit -m "fix: correct idle detection threshold"
git commit -m "docs: update installation instructions"
git commit -m "refactor: extract statistics manager class"
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring without behavior change
- `test`: Test additions or modifications
- `style`: Code style changes (formatting, whitespace)
- `perf`: Performance improvements

### PR Checklist

Before submitting a pull request:

- [ ] Code follows the style guidelines above
- [ ] Extension loads without errors (`journalctl` logs are clean)
- [ ] Manual testing completed (see Testing Instructions)
- [ ] No debug logging left in production code (unless behind DEBUG flag)
- [ ] Resource cleanup implemented (timeouts, file monitors, etc.)
- [ ] Documentation updated (README.md, ARCHITECTURE.md if relevant)
- [ ] Commit messages are clear and descriptive

### PR Description Template

```markdown
## Summary
Brief description of what changed and why.

## Changes
- List of specific changes made
- Another change

## Testing
- How you tested these changes
- Screenshots for UI changes (if applicable)

## Related Issues
Fixes #123
```

## Security Considerations

### File System Access

- Extension reads from: `~/.local/share/opencode/stats.json`
- Extension writes to: `~/.local/share/gnome-opencode/statistics.json`
- Always validate JSON before parsing to prevent crashes
- Use try-catch blocks around file operations

### JSON Parsing

Always validate external data:

```javascript
try {
    const stats = JSON.parse(contents);
    // Validate expected structure
    if (!stats.session || !stats.daily || !stats.total) {
        throw new Error('Invalid statistics format');
    }
} catch (e) {
    logError(e, 'Failed to parse statistics');
    return null;
}
```

### GSettings Security

- All preferences are stored in GSettings (sandboxed)
- No sensitive data should be stored in preferences
- Always validate preference values before use

## Common Issues and Solutions

### Extension Not Appearing

1. Check if enabled: `gnome-extensions list --enabled`
2. Look for errors: `journalctl -f -o cat /usr/bin/gnome-shell | grep opencode`
3. Verify installation: `ls -la ~/.local/share/gnome-shell/extensions/opencode-stats@fmatsos.github.com/`

### Statistics Show "Loading..."

1. Check OpenCode stats file exists: `ls -la ~/.local/share/opencode/stats.json`
2. Verify file format: `cat ~/.local/share/opencode/stats.json`
3. Generate test data: `./test-data-generator.sh`
4. Click "Refresh Statistics" in the menu

### Real-time Updates Not Working

1. Check file monitoring is enabled in preferences
2. Verify file permissions: `ls -la ~/.local/share/opencode/`
3. Enable debug mode to see file monitor events
4. Fallback polling should work even if monitoring fails

### Plugin Not Tracking Tokens

1. Enable debug logging: `DEBUG_GNOME_STATS=1 opencode`
2. Check plugin logs: `tail -f ~/.local/share/opencode/gnome-stats-exporter.log`
3. Verify plugin location: `ls -la .opencode/plugin/gnome-stats-exporter.ts`
4. Ensure you're using OpenCode (not regular shell commands)

## Architecture Notes

### Extension Structure

- `extension.js`: Main extension logic
  - `OpencodeStatsExtension`: Lifecycle management
  - `OpencodeIndicator`: UI component (panel button and menu)
  - `DataManager`: Data loading, persistence, and file monitoring
- `prefs.js`: Preferences UI using Adwaita widgets
- `metadata.json`: Extension metadata and GSettings schema reference
- `schemas/*.gschema.xml`: GSettings schema definitions
- `stylesheet.css`: UI styling

### Data Flow

1. User interacts with OpenCode
2. OpenCode plugin (`gnome-stats-exporter.ts`) tracks tokens
3. Plugin writes to `~/.local/share/opencode/stats.json`
4. GNOME extension detects file change (via file monitor or polling)
5. Extension reads stats and updates UI
6. Extension persists data to `~/.local/share/gnome-opencode/statistics.json`

### Event-Driven Updates

- **File Monitoring**: `Gio.File.monitor_file()` for real-time detection
- **Idle Detection**: OpenCode plugin sends `session.idle` event
- **Polling Fallback**: 60-second timer for reliability
- **User-Triggered**: Manual refresh button

## Documentation Files

When making changes, update relevant documentation:

- `README.md`: User-facing features and installation
- `ARCHITECTURE.md`: Technical architecture and design decisions
- `CONTRIBUTING.md`: Development guidelines and workflow
- `TROUBLESHOOTING.md`: Common issues and solutions
- `OPENCODE_INTEGRATION.md`: OpenCode plugin integration details
- `AGENTS.md`: This file (agent-specific instructions)

## Additional Resources

- [GNOME Shell Extension Guide](https://gjs.guide/extensions/)
- [GJS Documentation](https://gjs-docs.gnome.org/)
- [OpenCode Documentation](https://github.com/sst/opencode)
- [OpenCode Plugin API](https://github.com/sst/opencode/tree/main/packages/plugin)
- [GNOME HIG (Human Interface Guidelines)](https://developer.gnome.org/hig/)

## Tips for AI Coding Agents

### Quick File Navigation

- Main extension logic: `extension.js`
- Preferences UI: `prefs.js`
- OpenCode plugin: `opencode-plugin/gnome-stats-exporter.ts`
- Settings schema: `schemas/org.gnome.shell.extensions.opencode-stats.gschema.xml`

### Before Making Changes

1. Read the relevant documentation in `docs/` directory
2. Check `ARCHITECTURE.md` for design patterns
3. Review existing code style in the files you're modifying
4. Look at recent commits for context: `git log --oneline -10`

### After Making Changes

1. Reload the extension to test: `gnome-extensions disable && gnome-extensions enable`
2. Check logs for errors: `journalctl -f -o cat /usr/bin/gnome-shell | grep opencode`
3. Test all affected functionality manually
4. Update documentation if behavior changed
5. Run `./package.sh` to verify packaging works

### Testing Workflow

1. Make changes to code
2. Reload extension
3. Generate test data: `./test-data-generator.sh`
4. Verify UI updates correctly
5. Check logs for errors
6. Test idle notifications (if relevant)
7. Test preferences UI (if relevant)

### Don't Forget

- Clean up resources in `destroy()` methods
- Validate JSON before parsing
- Use `logError(e, 'context')` for error logging
- Follow 4-space indentation for JavaScript
- Update `metadata.json` version if making a release
- Test on both X11 and Wayland if possible
