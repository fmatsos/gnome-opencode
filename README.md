# GNOME OpenCode Statistics Extension

A GNOME Shell extension that displays usage statistics for [OpenCode](https://github.com/sst/opencode), the open-source AI coding agent. Track your token usage across sessions, days, and total usage since installation.

## Features

- **System Tray Icon**: Convenient access to statistics from the GNOME top bar
- **Session Statistics**: View token usage for your current OpenCode session
- **Daily Statistics**: Track today's token consumption
- **Cumulative Statistics**: Monitor total tokens used since installation
- **Model Breakdown**: Detailed view of token usage per AI model
- **Idle Session Warnings**: Get notified when your OpenCode session has been idle for 15+ minutes
- **Real-time Updates**: Statistics update immediately when OpenCode processes tokens (with 60-second polling fallback)
- **Last Update Indicator**: Shows when statistics were last refreshed
- **Persistent Storage**: All data stored in JSON format for reliability

## Requirements

- GNOME Shell 42 or later
- [OpenCode](https://github.com/sst/opencode) installed and configured

## Installation

### Method 1: Manual Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/fmatsos/gnome-opencode.git
   ```

2. Create the extensions directory if it doesn't exist:
   ```bash
   mkdir -p ~/.local/share/gnome-shell/extensions/
   ```

3. Copy the extension files:
   ```bash
   cp -r gnome-opencode ~/.local/share/gnome-shell/extensions/opencode-stats@fmatsos.github.com
   ```

4. Restart GNOME Shell:
   - On X11: Press `Alt+F2`, type `r`, and press Enter
   - On Wayland: Log out and log back in

5. Enable the extension:
   ```bash
   gnome-extensions enable opencode-stats@fmatsos.github.com
   ```

### Method 2: Using GNOME Extensions Website (Coming Soon)

The extension will be available on [extensions.gnome.org](https://extensions.gnome.org/) for easy one-click installation.

## Usage

### Viewing Statistics

1. Click on the terminal icon in the GNOME top bar
2. The popup menu shows:
   - **Session**: Tokens used in the current OpenCode session
   - **Today**: Total tokens used today
   - **Total**: Cumulative tokens since installation

### Model Breakdown

Click on any "View Details" button to see token usage broken down by AI model (e.g., GPT-4, Claude, etc.).

### Manual Refresh

Click "Refresh Statistics" in the menu to immediately fetch the latest data from OpenCode.

### Idle Notifications

The extension monitors OpenCode activity and notifies you when your session has been idle:

- **Real-time Detection**: Uses OpenCode's native `session.idle` event for instant notifications when the chat session finishes
- **Event-driven**: OpenCode plugin catches the idle event and notifies the GNOME extension immediately (< 1 second)
- **Fallback Polling**: If real-time detection is disabled, the extension checks every 60 seconds based on activity timestamps
- **Configurable**: Both real-time detection and idle threshold (1-120 minutes, default: 15) can be configured in preferences

The notification shows for ~5 seconds and can be manually closed. It appears only once per idle period to avoid spam.

## Data Storage

Statistics are stored in:
```
~/.local/share/gnome-opencode/statistics.json
```

The extension reads OpenCode statistics from:
```
~/.local/share/opencode/stats.json
```

Note: The extension expects OpenCode to maintain its own statistics file. If this file doesn't exist, the extension will still function but won't display usage data until OpenCode creates it.

## Configuration

### Preferences

All timing settings can be configured through the GNOME Extensions preferences UI:

1. Open **Extensions** app (or run `gnome-extensions prefs opencode-stats@fmatsos.github.com`)
2. Find **OpenCode Statistics** extension
3. Click the ⚙️ settings icon
4. Configure:
   - **Idle Threshold**: Minutes before showing idle notification (1-120, default: 15)
   - **Polling Interval**: Fallback check frequency in seconds (10-600, default: 60)
   - **File Monitoring**: Enable/disable real-time file updates (default: enabled)
   - **Real-time Idle Detection**: Use OpenCode events for instant idle notifications (default: enabled)
5. Reload extension (disable/enable) to apply changes

### Update Mechanism

The extension uses **real-time file monitoring** to detect changes to OpenCode's statistics file. When OpenCode processes tokens, the extension updates **immediately** without waiting for a polling interval.

A 60-second polling fallback ensures updates even if file monitoring fails. Both the polling interval and file monitoring can be configured in the preferences UI (see above).

## OpenCode Integration

This extension is designed to work with [OpenCode](https://github.com/sst/opencode), an open-source AI coding agent. OpenCode tracks token usage across various AI models and providers.

**This repository includes an OpenCode plugin** (`.opencode/plugin/gnome-stats-exporter.ts`) that automatically exports token usage statistics for the GNOME extension. 

To install the plugin:
```bash
./install-opencode-plugin.sh
```

Or see [.opencode/plugin/README.md](.opencode/plugin/README.md) for manual setup instructions.

### Expected OpenCode Stats Format

The extension expects OpenCode to provide statistics in the following format:

```json
{
  "session": {
    "totalTokens": 1500,
    "tokensByModel": {
      "gpt-4": 1000,
      "claude-3": 500
    },
    "lastActivity": 1234567890000
  },
  "daily": {
    "totalTokens": 5000,
    "tokensByModel": {
      "gpt-4": 3000,
      "claude-3": 2000
    }
  },
  "total": {
    "totalTokens": 50000,
    "tokensByModel": {
      "gpt-4": 30000,
      "claude-3": 20000
    }
  }
}
```

## Development

### Building from Source

The extension is written in JavaScript using GJS (GNOME JavaScript bindings) for optimal integration with GNOME Shell.

### File Structure

```
gnome-opencode/
├── extension.js          # Main extension code
├── metadata.json         # Extension metadata
├── stylesheet.css        # UI styling
├── README.md            # This file
└── LICENSE              # GPL-3.0 license
```

### Testing

After making changes:

1. Reload the extension:
   ```bash
   gnome-extensions disable opencode-stats@fmatsos.github.com
   gnome-extensions enable opencode-stats@fmatsos.github.com
   ```

2. View logs:
   ```bash
   journalctl -f -o cat /usr/bin/gnome-shell
   ```

## Troubleshooting

### Extension doesn't appear in the top bar

1. Check if the extension is enabled:
   ```bash
   gnome-extensions list --enabled
   ```

2. Look for errors in the logs:
   ```bash
   journalctl -f -o cat /usr/bin/gnome-shell | grep opencode
   ```

### Statistics show 0 tokens

1. Verify OpenCode is running and has been used
2. Check if OpenCode's stats file exists:
   ```bash
   ls -la ~/.local/share/opencode/stats.json
   ```
3. Click "Refresh Statistics" in the extension menu

### Idle warnings not appearing

- Ensure you have used OpenCode recently (tokens > 0)
- Wait for the update interval (60 seconds by default)
- Check that desktop notifications are enabled in GNOME Settings

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the GNU General Public License v3.0 or later - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [OpenCode](https://github.com/sst/opencode) - The AI coding agent this extension monitors
- GNOME Shell Extension developers for their excellent documentation
- The GNOME Project for the desktop environment

## Links

- [OpenCode GitHub](https://github.com/sst/opencode)
- [OpenCode Website](https://opencode.ai)
- [GNOME Extensions](https://extensions.gnome.org/)
- [GNOME Shell Extension Documentation](https://gjs.guide/extensions/)

## Support

For issues related to:
- **This extension**: Open an issue on [GitHub](https://github.com/fmatsos/gnome-opencode/issues)
- **OpenCode itself**: See the [OpenCode repository](https://github.com/sst/opencode)
- **GNOME Shell**: Check [GNOME Support](https://www.gnome.org/support/)
