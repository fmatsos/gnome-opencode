# Frequently Asked Questions (FAQ)

## General Questions

### What is this extension?

This is a GNOME Shell extension that displays usage statistics for OpenCode, an open-source AI coding agent. It shows token usage across different time periods (session, daily, total) and provides model-level breakdowns.

### Why would I use this?

If you use OpenCode for AI-assisted coding, this extension helps you:
- Monitor your token consumption
- Track costs (tokens = money with most AI services)
- Identify which models you use most
- Get notified about idle sessions
- Stay aware of your usage patterns

### Is this an official OpenCode extension?

No, this is a community-created extension. It's not officially affiliated with the OpenCode project, but it's designed to integrate seamlessly with OpenCode.

### Does it work with other AI coding tools?

Currently, it's designed specifically for OpenCode. However, the architecture could be adapted for other tools that track token usage.

## Installation & Setup

### What are the system requirements?

- GNOME Shell 42 or later
- Linux-based operating system with GNOME desktop
- OpenCode installed (optional for testing)

### How do I install it?

```bash
git clone https://github.com/fmatsos/gnome-opencode.git
cd gnome-opencode
./install.sh
```

Then restart GNOME Shell (Alt+F2, type 'r', Enter).

### The extension isn't showing up. What should I do?

1. Check if it's enabled:
   ```bash
   gnome-extensions list --enabled | grep opencode
   ```

2. If not enabled, enable it:
   ```bash
   gnome-extensions enable opencode-stats@fmatsos.github.com
   ```

3. Check for errors:
   ```bash
   journalctl -f -o cat /usr/bin/gnome-shell | grep opencode
   ```

### Can I install it from extensions.gnome.org?

Not yet, but we plan to submit it for approval. Currently, manual installation is required.

### How do I update to a new version?

```bash
cd gnome-opencode
git pull
./install.sh
```

Then restart GNOME Shell.

## Usage

### Where is the extension icon?

Look in your GNOME Shell top bar, usually on the right side near system icons. It's a terminal icon (📟).

### What does each statistic mean?

- **Session**: Tokens used since OpenCode started running
- **Today**: Tokens used today (resets at midnight)
- **Total**: All tokens used since you installed the extension

### What are "tokens"?

Tokens are units of text that AI models process. Generally:
- 1 token ≈ 4 characters
- 1 token ≈ 0.75 words
- Token usage directly relates to API costs

### How often does the extension update?

The extension uses **real-time file monitoring** and updates **immediately** when OpenCode processes tokens. There's also a 60-second polling fallback for reliability. You can manually refresh by clicking "Refresh Statistics" in the menu.

### Can I change the update interval?

The 60-second interval is just a fallback. Real-time updates happen instantly via file monitoring. To adjust the fallback interval, edit `extension.js`:
```javascript
const UPDATE_INTERVAL_SECONDS = 60;  // Fallback polling interval
```

To disable file monitoring and use only polling:
```javascript
const FILE_MONITOR_ENABLED = false;
```

### What does the "Last update" label show?

The "Last update" label displays when the statistics were last refreshed from OpenCode. It shows:
- "Just now" - Updated within the last minute
- "X minutes ago" - Updated recently
- "X hours ago" - Updated within the last 24 hours
- Exact date/time - For older updates

This helps you know if the extension is receiving data from OpenCode in real-time.

### What's the "View Details" button do?

It shows a notification with token usage broken down by AI model (e.g., GPT-4, Claude, etc.).

### Why does it show "Loading..."?

This means the extension hasn't found data yet. Either:
1. OpenCode hasn't been used yet
2. The statistics file doesn't exist
3. Generate test data: `./test-data-generator.sh`

### Why does everything show 0 tokens?

You may not have used OpenCode yet, or OpenCode isn't exporting statistics. Try generating test data to verify the extension works.

## OpenCode Integration

### Does OpenCode automatically export statistics?

Currently, OpenCode doesn't have built-in statistics export. This extension provides a framework for such integration. See `OPENCODE_INTEGRATION.md` for details on how to set it up.

### Where should OpenCode save its statistics?

The extension expects statistics at:
```
~/.local/share/opencode/stats.json
```

See `example-opencode-stats.json` for the expected format.

### Can I use this without OpenCode?

The extension will run, but won't display meaningful data without OpenCode statistics. You can generate test data with `./test-data-generator.sh` for demonstration purposes.

### How do I integrate OpenCode with this extension?

See `OPENCODE_INTEGRATION.md` for detailed integration instructions. Options include:
1. Creating an OpenCode plugin
2. Writing a monitoring script
3. Using OpenCode's API (if available)

## Features

### What's the idle session warning?

If your OpenCode session is idle for 15+ minutes (configurable), you'll get a desktop notification. This helps you avoid forgotten sessions and unnecessary resource usage.

### Can I change the idle threshold?

Yes, edit `extension.js`:
```javascript
const IDLE_THRESHOLD_MINUTES = 15;  // Change to desired value
```

### Can I disable idle warnings?

Remove or comment out the `_checkIdleSession()` call in the timer function.

### Does it track costs?

Not yet, but it's planned for a future version. Currently, it only tracks token counts.

### Can I export my statistics?

Not directly in the current version. Your statistics are stored in:
```
~/.local/share/gnome-opencode/statistics.json
```

You can manually back up or export this file.

### Does it show historical trends?

Not yet. The current version shows:
- Current session
- Today's usage
- All-time total

Historical graphs are planned for a future version.

## Privacy & Security

### Does the extension send data anywhere?

No. All data stays local on your machine. There are no network connections, telemetry, or tracking.

### Where is my data stored?

Two locations:
1. Extension data: `~/.local/share/gnome-opencode/statistics.json`
2. OpenCode data: `~/.local/share/opencode/stats.json` (if it exists)

### Can other users see my statistics?

No, unless they have access to your user account. Files are stored in your home directory with standard user permissions.

### Is my OpenCode API key safe?

This extension doesn't access or store API keys. It only reads token usage statistics.

## Troubleshooting

### The extension crashes GNOME Shell

1. Check logs:
   ```bash
   journalctl -f -o cat /usr/bin/gnome-shell | grep -i error
   ```

2. Disable the extension:
   ```bash
   gnome-extensions disable opencode-stats@fmatsos.github.com
   ```

3. Report the issue on GitHub with log output.

### Statistics aren't updating

1. Check if OpenCode is running
2. Verify the stats file exists:
   ```bash
   ls -la ~/.local/share/opencode/stats.json
   ```
3. Click "Refresh Statistics" manually
4. Check logs for errors

### The menu doesn't open

1. Restart GNOME Shell (Alt+F2, type 'r', Enter)
2. Reinstall the extension: `./install.sh`
3. Check for conflicts with other extensions

### Model breakdown shows no data

This means either:
- OpenCode hasn't exported model-specific data
- The statistics file doesn't include model breakdowns
- No tokens have been used yet

### Notifications aren't appearing

1. Check GNOME notification settings
2. Verify notifications are enabled for GNOME Shell
3. Test with: `notify-send "Test" "This is a test"`

## Development

### How do I contribute?

See `CONTRIBUTING.md` for detailed guidelines. Quick steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### What language is it written in?

JavaScript (specifically GJS - GNOME JavaScript), which is the standard for GNOME Shell extensions. This provides optimal performance and integration.

### Can I add new features?

Yes! Check `CONTRIBUTING.md` for ideas and guidelines. Some areas for contribution:
- Cost tracking
- Historical data visualization
- Preferences UI
- Real-time API integration
- Custom themes

### How do I test my changes?

1. Make changes to `extension.js`
2. Run `./install.sh`
3. Restart GNOME Shell
4. Check logs: `journalctl -f -o cat /usr/bin/gnome-shell | grep opencode`
5. Test functionality
6. Generate test data: `./test-data-generator.sh`

### Where can I report bugs?

Open an issue on GitHub: https://github.com/fmatsos/gnome-opencode/issues

## Compatibility

### Which GNOME Shell versions are supported?

GNOME Shell 42, 43, 44, 45, and 46. Older versions may work but aren't officially supported.

### Does it work on Wayland?

Yes, it works on both X11 and Wayland.

### What about other desktop environments?

This is specifically a GNOME Shell extension and won't work on KDE, XFCE, etc. However, the concept could be adapted for those environments.

### Will it work on Ubuntu?

Yes, if Ubuntu uses GNOME Shell (which Ubuntu 20.04+ does by default).

### What about Fedora, Arch, etc.?

Yes, the extension works on any Linux distribution that uses GNOME Shell 42+.

## Performance

### Does it slow down my system?

No. The extension is very lightweight:
- Updates only once per minute
- Minimal CPU usage
- Small memory footprint (~2-3 MB)
- No network activity

### Will it drain my laptop battery?

No measurable impact. The extension's resource usage is negligible.

### Can I reduce its resource usage?

The extension is already optimized, but you can increase the update interval to reduce I/O:
```javascript
const UPDATE_INTERVAL_SECONDS = 120;  // Update every 2 minutes instead
```

## Uninstallation

### How do I uninstall?

```bash
./uninstall.sh
```

Or manually:
```bash
gnome-extensions disable opencode-stats@fmatsos.github.com
rm -rf ~/.local/share/gnome-shell/extensions/opencode-stats@fmatsos.github.com
```

### Will uninstalling delete my statistics?

The `uninstall.sh` script asks if you want to keep or delete your data. Manual uninstallation doesn't delete data (it's in `~/.local/share/gnome-opencode/`).

### How do I completely remove all data?

```bash
rm -rf ~/.local/share/gnome-opencode/
```

## Getting Help

### Where can I get help?

1. Check this FAQ
2. Read the README.md
3. Search existing GitHub issues
4. Open a new GitHub issue
5. Check OpenCode documentation for integration questions

### How do I report a bug?

Open an issue on GitHub with:
- Your GNOME Shell version
- Extension version
- Steps to reproduce
- Expected vs actual behavior
- Relevant log output

### Can I request features?

Yes! Open a GitHub issue with the "enhancement" label and describe:
- What problem you're trying to solve
- Your proposed solution
- Why it would be useful to others

### Is there a community chat?

Not yet, but we may create one if there's interest. For now, use GitHub Discussions.

## Miscellaneous

### Why JavaScript and not Python/Go/Rust?

GNOME Shell extensions must be written in JavaScript (GJS). It's the only supported language and provides the best integration with GNOME Shell's APIs.

### Can I theme the extension?

Yes! Edit `stylesheet.css` to customize colors, fonts, and spacing. The extension respects your GNOME Shell theme by default.

### Does it support dark mode?

Yes, automatically. The extension adapts to your GNOME Shell theme (light, dark, or high contrast).

### Can I add custom models?

The extension automatically displays whatever models are in the statistics data. No configuration needed.

### What about translations?

Internationalization (i18n) is planned for a future version. Currently, the extension is in English only.

### Will there be a mobile version?

No plans for a mobile version, but the concept could work as a mobile app that syncs with OpenCode.

---

## Didn't find your answer?

Open an issue on GitHub: https://github.com/fmatsos/gnome-opencode/issues
