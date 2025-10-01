# Task Completion Checklist

Since this is a GNOME Shell extension, the standard workflow is:

1. **Make code changes** to extension.js or related files
2. **Test the extension** by reloading it:
   ```bash
   gnome-extensions disable opencode-stats@fmatsos.github.com
   gnome-extensions enable opencode-stats@fmatsos.github.com
   ```
3. **Check logs** for errors:
   ```bash
   journalctl -f -o cat /usr/bin/gnome-shell | grep opencode
   ```
4. **Manual testing**: Click the extension icon and verify behavior
5. **Generate test data** if needed: `./test-data-generator.sh`

## No Linting/Build Steps
- This is a pure JavaScript GNOME extension
- No compilation or build process required
- No formal test suite exists
- Changes take effect immediately after reload