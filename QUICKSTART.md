# Quick Start Guide

Get up and running with the GNOME OpenCode Statistics Extension in 5 minutes!

## Prerequisites

Before you begin, ensure you have:

- ✅ GNOME Shell 42 or later
- ✅ [OpenCode](https://github.com/sst/opencode) installed (optional for testing)
- ✅ Terminal access

Check your GNOME Shell version:
```bash
gnome-shell --version
```

## Installation (3 Steps)

### 1. Clone the Repository

```bash
git clone https://github.com/fmatsos/gnome-opencode.git
cd gnome-opencode
```

### 2. Run the Installation Script

```bash
./install.sh
```

### 3. Restart GNOME Shell

**On X11 (most common):**
- Press `Alt + F2`
- Type `r`
- Press `Enter`

**On Wayland:**
- Log out
- Log back in

## First Use

### Look for the Icon

After restart, look for the **terminal icon** (📟) in your top bar, usually on the right side near the system icons.

### Click to Open

Click the icon to see your statistics:
- **Session**: Current session tokens (0 initially)
- **Today**: Today's tokens (0 initially)  
- **Total**: All-time tokens (0 initially)

### Generate Test Data (Optional)

To see the extension in action with sample data:

```bash
./test-data-generator.sh
```

Then click "Refresh Statistics" in the extension menu or wait 60 seconds for auto-refresh.

## Basic Usage

### View Statistics

Click the terminal icon → See token usage for session, daily, and total

### View Model Breakdown

Click any "View Details" button → Get a notification showing usage per model

### Refresh Data

Click "Refresh Statistics" → Immediately update from OpenCode

### Monitor Idle Sessions

If your session is idle for 15+ minutes, you'll get an automatic notification

## Troubleshooting

### Extension doesn't appear?

```bash
# Check if it's enabled
gnome-extensions list --enabled | grep opencode

# If not, enable it
gnome-extensions enable opencode-stats@fmatsos.github.com
```

### Shows "Loading..." forever?

OpenCode statistics file may not exist. Generate test data:
```bash
./test-data-generator.sh
```

### Need to see logs?

```bash
journalctl -f -o cat /usr/bin/gnome-shell | grep opencode
```

## Next Steps

### Set Up OpenCode Plugin (Recommended)

For real OpenCode integration, install the included plugin:

**Global installation (works for all OpenCode sessions):**
```bash
mkdir -p ~/.config/opencode/plugin
cp .opencode/plugin/gnome-stats-exporter.ts ~/.config/opencode/plugin/
```

**Project-level installation:**
The plugin is already in `.opencode/plugin/` - just use OpenCode in this directory!

See [.opencode/plugin/README.md](.opencode/plugin/README.md) for details.

### More Resources

1. **Read the full README**: `cat README.md` or view on GitHub
2. **OpenCode plugin setup**: See `.opencode/plugin/README.md`
3. **Integration details**: See `OPENCODE_INTEGRATION.md`
4. **Customize settings**: Edit `extension.js` (update intervals, thresholds)
5. **Report issues**: https://github.com/fmatsos/gnome-opencode/issues

## Uninstallation

If you need to remove the extension:

```bash
./uninstall.sh
```

## Learn More

- **Full Documentation**: [README.md](README.md)
- **OpenCode Integration**: [OPENCODE_INTEGRATION.md](OPENCODE_INTEGRATION.md)
- **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **Visual Guide**: [SCREENSHOTS.md](SCREENSHOTS.md)

## Getting Help

- **Bug Reports**: [GitHub Issues](https://github.com/fmatsos/gnome-opencode/issues)
- **Questions**: Open a discussion on GitHub
- **OpenCode Help**: [OpenCode Docs](https://github.com/sst/opencode)

---

**Enjoy tracking your OpenCode usage! 🚀**
