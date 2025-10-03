# Screenshots for GNOME Extensions Website

This directory contains promotional screenshots for the extension submission to extensions.gnome.org.

## Required Screenshots

Create the following screenshots before submission:

### 1. screenshot-menu.png
**Description:** Main menu with statistics display
**Contents:**
- GNOME top bar with terminal icon
- Dropdown menu showing:
  - Session: X.XK tokens ($X.XX)
  - Today: X.XK tokens ($X.XX)
  - Total: X.XK tokens ($X.XX)
  - Last update: timestamp
  - Refresh Statistics button
- Clean desktop background

**How to create:**
```bash
# Generate test data
./test-data-generator.sh

# Click the terminal icon in the top bar
# Take screenshot with area selection (Shift+PrtScn)
# Save as screenshot-menu.png
```

### 2. screenshot-model-breakdown.png
**Description:** Per-model token breakdown
**Contents:**
- GNOME notification showing model breakdown
- Lists each AI model used with token counts
- Example:
  - gpt-4-turbo: 1.0K tokens ($0.02)
  - claude-3-opus: 500 tokens ($0.01)

**How to create:**
```bash
# Click "View Details" button in the menu
# Take screenshot of the notification
# Save as screenshot-model-breakdown.png
```

### 3. screenshot-idle-notification.png
**Description:** Idle session warning
**Contents:**
- GNOME notification stating:
  "OpenCode Session Idle"
  "Your OpenCode session has been idle for 15 minutes"

**How to create:**
```bash
# Either wait 15+ minutes of inactivity
# Or temporarily reduce idle threshold in extension.js for testing
# Take screenshot when notification appears
# Save as screenshot-idle-notification.png
```

### 4. screenshot-preferences.png
**Description:** Extension preferences window
**Contents:**
- Preferences UI showing:
  - Idle threshold slider (minutes)
  - Polling interval setting
  - File monitoring toggle
  - Budget settings (if applicable)
- Clean, organized layout

**How to create:**
```bash
# Open preferences
gnome-extensions prefs opencode-stats@fmatsos.github.com

# Take screenshot of preferences window
# Save as screenshot-preferences.png
```

### 5. screenshot-cost-tracking.png (Optional)
**Description:** Cost tracking feature demonstration
**Contents:**
- Statistics display with both tokens and costs
- Shows budget awareness features
- Highlights monetary values

**How to create:**
```bash
# Ensure cost tracking is enabled in test data
# Click icon to show menu with cost information
# Take screenshot showing costs alongside tokens
# Save as screenshot-cost-tracking.png
```

## Screenshot Guidelines

### Technical Requirements
- **Format:** PNG (required by extensions.gnome.org)
- **Resolution:** 800x600 minimum, higher recommended (1920x1080 ideal)
- **File size:** < 500KB per image
- **Color depth:** 24-bit or 32-bit (no indexed color)

### Content Guidelines
- Use default GNOME theme (Adwaita) or popular alternatives
- Show realistic, meaningful data (not zeros or "Loading...")
- No personal information visible
- Clean desktop background
- No other applications visible unless relevant
- Mouse cursor can be visible for clickable items

### Quality Guidelines
- High resolution and clarity
- Proper lighting/contrast
- No blur or compression artifacts
- Professional appearance
- Consistent theme across all screenshots

## Tools for Taking Screenshots

### GNOME Screenshot (Built-in)
```bash
# Full screen
gnome-screenshot

# Area selection
gnome-screenshot -a

# Window selection
gnome-screenshot -w

# Interactive mode
gnome-screenshot -i
```

### Keyboard Shortcuts
- **PrtScn** - Full screen screenshot
- **Shift+PrtScn** - Area selection
- **Alt+PrtScn** - Active window

### Alternative Tools
- Flameshot (more features)
- Spectacle (KDE, works on GNOME)
- Shutter (advanced editing)

## Image Optimization

Before uploading, optimize images to reduce file size:

```bash
# Using optipng
optipng -o7 screenshot-*.png

# Using pngquant
pngquant --quality=80-95 screenshot-*.png

# Verify file sizes
ls -lh screenshot-*.png
```

## Testing Display

View screenshots before submission:

```bash
# View all screenshots
eog screenshot-*.png

# Or using GNOME Files (Nautilus)
nautilus screenshots/
```

## Submission Checklist

Before submitting to extensions.gnome.org:

- [ ] All 4-5 screenshots created
- [ ] PNG format confirmed
- [ ] File sizes < 500KB each
- [ ] Resolution adequate (800x600+)
- [ ] No personal information visible
- [ ] All features demonstrated
- [ ] Professional appearance
- [ ] Descriptive filenames used
- [ ] Images optimized

## Expected Screenshots Layout on Extension Page

On extensions.gnome.org, screenshots appear as:
1. **Primary screenshot** (screenshot-menu.png) - First impression
2. **Additional screenshots** - Gallery view, clickable thumbnails
3. **Captions** - Can be added during submission process

## Caption Suggestions

When uploading to extensions.gnome.org, use these captions:

1. **screenshot-menu.png:** "Main statistics menu showing session, daily, and total token usage"
2. **screenshot-model-breakdown.png:** "Per-model token breakdown with costs"
3. **screenshot-idle-notification.png:** "Idle session warning after 15 minutes of inactivity"
4. **screenshot-preferences.png:** "Configurable preferences for idle detection and monitoring"
5. **screenshot-cost-tracking.png:** "Real-time cost tracking alongside token consumption"

## Notes

- Screenshots are **critical** for extension approval and discoverability
- Quality screenshots significantly impact download rates
- Update screenshots when adding major new features
- Keep screenshots up-to-date with current UI

---

**Last Updated:** October 2025  
**Status:** Awaiting screenshot creation before submission
