# Suggested Commands

## Development
```bash
# View logs
journalctl -f -o cat /usr/bin/gnome-shell | grep opencode

# Enable extension
gnome-extensions enable opencode-stats@fmatsos.github.com

# Disable extension
gnome-extensions disable opencode-stats@fmatsos.github.com

# List enabled extensions
gnome-extensions list --enabled

# Restart GNOME Shell (X11 only)
# Press Alt+F2, type 'r', Enter
```

## Testing
```bash
# Generate test data
./test-data-generator.sh

# Check stats file
cat ~/.local/share/opencode/stats.json

# Install OpenCode plugin
./install-opencode-plugin.sh
```

## File Operations
- Stats file: `~/.local/share/opencode/stats.json`
- Extension data: `~/.local/share/gnome-opencode/statistics.json`