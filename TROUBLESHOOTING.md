# Troubleshooting Guide

Quick solutions to common problems with the GNOME OpenCode Statistics Extension.

## Quick Diagnostics

Run this diagnostic script to check your setup:

```bash
#!/bin/bash
echo "=== GNOME OpenCode Extension Diagnostics ==="
echo ""
echo "1. GNOME Shell Version:"
gnome-shell --version
echo ""
echo "2. Extension Status:"
gnome-extensions list | grep opencode && echo "✓ Extension installed" || echo "✗ Extension not installed"
gnome-extensions list --enabled | grep opencode && echo "✓ Extension enabled" || echo "✗ Extension disabled"
echo ""
echo "3. Data Directories:"
[ -d ~/.local/share/gnome-opencode ] && echo "✓ Extension data dir exists" || echo "✗ Extension data dir missing"
[ -f ~/.local/share/gnome-opencode/statistics.json ] && echo "✓ Statistics file exists" || echo "○ Statistics file not created yet (normal on first run)"
[ -d ~/.local/share/opencode ] && echo "✓ OpenCode data dir exists" || echo "○ OpenCode data dir missing (create if needed)"
[ -f ~/.local/share/opencode/stats.json ] && echo "✓ OpenCode stats file exists" || echo "○ OpenCode stats file missing (normal without OpenCode integration)"
echo ""
echo "4. Extension Files:"
[ -f ~/.local/share/gnome-shell/extensions/opencode-stats@fmatsos.github.com/extension.js ] && echo "✓ extension.js found" || echo "✗ extension.js missing"
[ -f ~/.local/share/gnome-shell/extensions/opencode-stats@fmatsos.github.com/metadata.json ] && echo "✓ metadata.json found" || echo "✗ metadata.json missing"
echo ""
echo "5. Recent Errors:"
journalctl --since "5 minutes ago" -o cat /usr/bin/gnome-shell 2>/dev/null | grep -i "opencode" | tail -5
echo ""
echo "=== End Diagnostics ==="
```

Save as `diagnose.sh`, make executable (`chmod +x`), and run.

## Problem: Extension Doesn't Appear

### Symptom
No terminal icon in the top bar after installation.

### Solutions

1. **Check if extension is enabled:**
   ```bash
   gnome-extensions enable opencode-stats@fmatsos.github.com
   ```

2. **Restart GNOME Shell:**
   - **X11**: Alt+F2, type `r`, press Enter
   - **Wayland**: Log out and log back in

3. **Verify installation:**
   ```bash
   ls -la ~/.local/share/gnome-shell/extensions/opencode-stats@fmatsos.github.com/
   ```
   Should show: `extension.js`, `metadata.json`, `stylesheet.css`

4. **Check for errors:**
   ```bash
   journalctl -f -o cat /usr/bin/gnome-shell | grep opencode
   ```

5. **Reinstall:**
   ```bash
   ./uninstall.sh
   ./install.sh
   ```

## Problem: Shows "Loading..." Forever

### Symptom
Statistics always show "Loading..." and never update.

### Solutions

1. **Generate test data:**
   ```bash
   ./test-data-generator.sh
   ```

2. **Wait or manually refresh:**
   - Wait 60 seconds for auto-update
   - Or click "Refresh Statistics" in the menu

3. **Check data file exists:**
   ```bash
   ls -la ~/.local/share/opencode/stats.json
   ```

4. **Create OpenCode data directory:**
   ```bash
   mkdir -p ~/.local/share/opencode
   ./test-data-generator.sh
   ```

5. **Check file permissions:**
   ```bash
   chmod 644 ~/.local/share/opencode/stats.json
   ```

## Problem: Statistics Show 0 Tokens

### Symptom
Extension displays but all values are 0.

### Solutions

1. **Use OpenCode** to generate token usage

2. **Generate test data:**
   ```bash
   ./test-data-generator.sh
   ```

3. **Check OpenCode stats file content:**
   ```bash
   cat ~/.local/share/opencode/stats.json
   ```

4. **Verify JSON format:**
   ```bash
   python3 -m json.tool ~/.local/share/opencode/stats.json
   ```

5. **Manually refresh:**
   Click "Refresh Statistics" in the extension menu

## Problem: Extension Crashes GNOME Shell

### Symptom
GNOME Shell restarts or becomes unresponsive.

### Solutions

1. **Disable extension immediately:**
   ```bash
   gnome-extensions disable opencode-stats@fmatsos.github.com
   ```

2. **Check error logs:**
   ```bash
   journalctl --since "10 minutes ago" -o cat /usr/bin/gnome-shell | grep -A 10 -i error
   ```

3. **Remove corrupted data:**
   ```bash
   rm -f ~/.local/share/gnome-opencode/statistics.json
   ```

4. **Reinstall extension:**
   ```bash
   ./uninstall.sh
   ./install.sh
   ```

5. **Report bug** with logs on GitHub

## Problem: Menu Doesn't Open

### Symptom
Clicking the icon does nothing.

### Solutions

1. **Restart GNOME Shell:**
   - Alt+F2, type `r`, Enter (X11)
   - Log out/in (Wayland)

2. **Check for other extension conflicts:**
   ```bash
   gnome-extensions list --enabled
   ```
   Disable other extensions one by one to find conflicts

3. **Reinstall:**
   ```bash
   ./install.sh
   ```

4. **Check permissions:**
   ```bash
   chmod +x ~/.local/share/gnome-shell/extensions/opencode-stats@fmatsos.github.com/extension.js
   ```

## Problem: Statistics Don't Update

### Symptom
Numbers never change even after using OpenCode.

### Solutions

1. **Check update interval** (60 seconds by default)

2. **Manually trigger update:**
   Click "Refresh Statistics"

3. **Verify OpenCode is updating stats:**
   ```bash
   watch -n 5 cat ~/.local/share/opencode/stats.json
   ```

4. **Check system time:**
   ```bash
   date
   ```
   Ensure it's correct (affects daily reset)

5. **Restart extension:**
   ```bash
   gnome-extensions disable opencode-stats@fmatsos.github.com
   gnome-extensions enable opencode-stats@fmatsos.github.com
   ```

## Problem: Idle Notifications Don't Appear

### Symptom
No notification after 15+ minutes of inactivity.

### Solutions

1. **Check GNOME notifications are enabled:**
   Settings → Notifications → GNOME Shell → Enabled

2. **Test notifications:**
   ```bash
   notify-send "Test" "This is a test notification"
   ```

3. **Verify idle threshold:**
   Check that OpenCode has been idle for 15+ minutes

4. **Check Do Not Disturb mode:**
   Ensure it's not enabled in Quick Settings

5. **Review timer status:**
   Extension must be running for timer to work

## Problem: Model Breakdown Shows Nothing

### Symptom
"View Details" shows no data or empty notification.

### Solutions

1. **Ensure OpenCode stats include model data:**
   ```bash
   cat ~/.local/share/opencode/stats.json
   ```
   Should have `tokensByModel` fields

2. **Generate test data with models:**
   ```bash
   ./test-data-generator.sh
   ```

3. **Check data format:**
   See `example-opencode-stats.json` for correct format

4. **Wait for data accumulation:**
   Use OpenCode to generate some token usage

## Problem: High Memory/CPU Usage

### Symptom
Extension consuming excessive resources.

### Solutions

1. **Check update interval:**
   Default is 60 seconds, which is reasonable

2. **Increase update interval:**
   Edit `extension.js`:
   ```javascript
   const UPDATE_INTERVAL_SECONDS = 120;  // 2 minutes
   ```

3. **Check for infinite loops:**
   Review recent changes if you modified code

4. **Monitor with system tools:**
   ```bash
   top -p $(pgrep gnome-shell)
   ```

5. **Restart GNOME Shell:**
   Alt+F2, `r`, Enter

## Problem: Installation Fails

### Symptom
`./install.sh` produces errors.

### Solutions

1. **Check GNOME Shell version:**
   ```bash
   gnome-shell --version
   ```
   Must be 42 or later

2. **Verify gnome-extensions command:**
   ```bash
   which gnome-extensions
   ```

3. **Check directory permissions:**
   ```bash
   ls -ld ~/.local/share/gnome-shell/extensions/
   ```

4. **Create directory manually:**
   ```bash
   mkdir -p ~/.local/share/gnome-shell/extensions/
   ```

5. **Install manually:**
   ```bash
   cp -r . ~/.local/share/gnome-shell/extensions/opencode-stats@fmatsos.github.com/
   gnome-extensions enable opencode-stats@fmatsos.github.com
   ```

## Problem: Daily Statistics Don't Reset

### Symptom
Daily counter doesn't reset at midnight.

### Solutions

1. **Check system timezone:**
   ```bash
   timedatectl
   ```

2. **Verify system time:**
   ```bash
   date
   ```

3. **Manually reset:**
   Delete the statistics file:
   ```bash
   rm ~/.local/share/gnome-opencode/statistics.json
   ```

4. **Restart extension:**
   Extension will recreate file with correct date

## Problem: Can't Uninstall

### Symptom
`./uninstall.sh` fails or extension remains.

### Solutions

1. **Disable first:**
   ```bash
   gnome-extensions disable opencode-stats@fmatsos.github.com
   ```

2. **Manual removal:**
   ```bash
   rm -rf ~/.local/share/gnome-shell/extensions/opencode-stats@fmatsos.github.com/
   rm -rf ~/.local/share/gnome-opencode/
   ```

3. **Restart GNOME Shell:**
   Alt+F2, `r`, Enter

4. **Clear cache:**
   ```bash
   rm -rf ~/.cache/gnome-shell/
   ```

## Problem: Incompatible GNOME Version

### Symptom
Extension shows as incompatible in Extensions app.

### Solutions

1. **Check metadata:**
   ```bash
   cat ~/.local/share/gnome-shell/extensions/opencode-stats@fmatsos.github.com/metadata.json
   ```

2. **Add your version:**
   Edit `metadata.json`, add your GNOME version to `shell-version` array

3. **Disable version check** (not recommended):
   ```bash
   gsettings set org.gnome.shell disable-extension-version-validation true
   ```

4. **Update extension:**
   Check for newer version that supports your GNOME Shell

## Advanced Troubleshooting

### View Extension Logs

```bash
journalctl -f -o cat /usr/bin/gnome-shell | grep opencode
```

### Enable JavaScript Debugging

Edit `extension.js`, add at the top:
```javascript
const DEBUG = true;
// Then use: if (DEBUG) log('Debug message');
```

### Use Looking Glass

1. Press Alt+F2
2. Type `lg`
3. Press Enter
4. Explore extension state

### Check Extension State

In Looking Glass:
```javascript
imports.misc.extensionUtils.extensions['opencode-stats@fmatsos.github.com']
```

### Force Reload

```bash
killall -SIGQUIT gnome-shell  # X11 only, creates core dump
```

### Safe Mode

Boot with extensions disabled:
1. Restart computer
2. At GDM login screen, click gear icon
3. Select "GNOME" (not "GNOME Classic" or custom)
4. Extensions will be disabled

## Still Having Issues?

1. **Gather information:**
   - GNOME Shell version
   - Extension version
   - Error logs
   - Steps to reproduce

2. **Search existing issues:**
   https://github.com/fmatsos/gnome-opencode/issues

3. **Open new issue:**
   Provide all gathered information

4. **Join discussion:**
   https://github.com/fmatsos/gnome-opencode/discussions

## Emergency Recovery

If extension makes GNOME unusable:

1. **Switch to TTY:**
   Ctrl+Alt+F3

2. **Login with your username**

3. **Disable extension:**
   ```bash
   gnome-extensions disable opencode-stats@fmatsos.github.com
   ```

4. **Return to graphical session:**
   Ctrl+Alt+F2 (or F1, F7)

5. **Report the issue** on GitHub
