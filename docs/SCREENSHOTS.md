# Screenshots and Visual Guide

This document describes the visual appearance and user interface of the GNOME OpenCode Statistics Extension.

## Extension Icon

The extension appears in the GNOME Shell top bar with a **terminal icon** (utilities-terminal-symbolic), typically displayed on the right side near other system indicators.

Location: `Top bar → Right side (system status area)`

## Main Menu

When you click the terminal icon, a dropdown menu appears with the following sections:

### 1. Session Statistics Section

```
┌─────────────────────────────────────┐
│ Session: 1.5K tokens                │  ← Bold, non-clickable
│ View Session Details         →      │  ← Clickable menu item
├─────────────────────────────────────┤
```

- Shows current session token usage
- Tokens are formatted (e.g., 1.5K, 2.3M)
- "View Session Details" opens a notification with model breakdown

### 2. Daily Statistics Section

```
├─────────────────────────────────────┤
│ Today: 5.0K tokens                  │  ← Bold, non-clickable
│ View Daily Details           →      │  ← Clickable menu item
├─────────────────────────────────────┤
```

- Shows today's cumulative token usage
- Resets at midnight
- "View Daily Details" shows token usage per model

### 3. Total Statistics Section

```
├─────────────────────────────────────┤
│ Total: 50.0K tokens                 │  ← Bold, non-clickable
│ View Total Details           →      │  ← Clickable menu item
├─────────────────────────────────────┤
```

- Shows all-time token usage since installation
- "View Total Details" displays comprehensive model breakdown

### 4. Last Update Information

```
├─────────────────────────────────────┤
│ Last update: Just now               │  ← Non-clickable, informational
├─────────────────────────────────────┤
```

- Shows when statistics were last refreshed
- Updates in real-time when data changes
- Displays relative time: "Just now", "5 minutes ago", "2 hours ago"
- Shows exact date/time for updates older than 24 hours

### 5. Actions Section

```
├─────────────────────────────────────┤
│ Refresh Statistics           ↻      │  ← Clickable action
└─────────────────────────────────────┘
```

- Manually triggers data refresh from OpenCode
- Useful after intensive coding sessions
- Updates the "Last update" timestamp

## Model Breakdown Notifications

When clicking any "View Details" button, a GNOME notification appears:

```
╔═══════════════════════════════════╗
║ Session Breakdown                  ║
║─────────────────────────────────── ║
║ gpt-4-turbo: 1.0K tokens          ║
║ claude-3-opus: 500 tokens         ║
╚═══════════════════════════════════╝
```

Features:
- Lists each model used
- Shows token count per model
- Formatted for readability

## Idle Session Warning

After 15 minutes of inactivity (configurable):

```
╔═══════════════════════════════════╗
║ OpenCode Session Idle              ║
║─────────────────────────────────── ║
║ Your OpenCode session has been    ║
║ idle for 15 minutes               ║
╚═══════════════════════════════════╝
```

Helps users:
- Avoid forgotten sessions
- Save resources
- Stay aware of usage patterns

## Visual Design

### Colors

The extension uses GNOME Shell's default theme colors:
- **Text**: System default foreground color
- **Icons**: System status icon color
- **Hover**: System hover color
- **Background**: Popup menu background

### Typography

- **Statistics labels**: Bold, 11pt
- **Menu items**: Regular, system default
- **Model breakdown**: Regular, 10pt

### Spacing

- Consistent padding: 8px vertical, 12px horizontal
- Separators between major sections
- Proper alignment of labels and arrows

## Accessibility

The extension follows GNOME accessibility guidelines:
- High contrast support
- Screen reader compatible
- Keyboard navigable (when GNOME Shell menu is focused)
- Clear visual hierarchy

## Responsive Design

The menu width adapts to:
- Different translations (future)
- Various token count lengths
- Long model names

## Animation

- Smooth menu open/close (GNOME Shell default)
- Subtle hover effects on menu items
- No distracting animations

## Dark Mode

The extension automatically adapts to:
- Light theme
- Dark theme
- High contrast themes

All visual elements use theme-aware colors.

## New Features (Current Version)

### Real-time Updates
The extension now uses file monitoring to detect changes instantly:
- Updates appear immediately when OpenCode processes tokens
- No need to wait for the 60-second polling interval
- "Last update" label shows when data was refreshed
- Real-time feedback for active development sessions

## Future Visual Enhancements

Planned improvements:
1. **Token usage graphs**: Visual representation of trends
2. **Color coding**: Different colors for different token ranges
3. **Custom icons**: Specific icons for different statistics types
4. **Progress bars**: Visual indicators of daily/monthly limits
5. **Preferences UI**: Graphical configuration interface

## Creating Screenshots

For contributors creating screenshots for the project or extensions.gnome.org submission:

### Requirements
- GNOME Shell 42 or later
- The extension installed and enabled
- Test data generated (`./test-data-generator.sh`)

### Recommended Tools
- GNOME Screenshot (built-in) - `gnome-screenshot -a` for area selection
- Flameshot - More advanced features and editing
- Spectacle (KDE, but works on GNOME)
- Keyboard shortcuts: PrtScn (full screen), Shift+PrtScn (area), Alt+PrtScn (window)

### Best Practices
1. Use default GNOME theme (Adwaita) for consistency
2. Show realistic data (not zeros or "Loading...")
3. Capture clean desktop (no personal info, clutter, or unrelated apps)
4. Include mouse cursor for clickable items
5. Use PNG format for quality
6. High resolution (1920x1080 or higher recommended)
7. File size < 500KB per image for web submission
8. Clear, readable text and UI elements

### Screenshot Types for Extensions.gnome.org

#### Primary Screenshots (Required)

1. **Main Menu Display** (screenshot-menu.png)
   - Top bar with extension icon visible
   - Dropdown menu open showing:
     - Session statistics with tokens/costs
     - Daily statistics with tokens/costs
     - Total statistics with tokens/costs
     - "Last update" timestamp
     - "Refresh Statistics" button
   - Clean background, no distractions
   - This is the FIRST impression users get

2. **Model Breakdown Notification** (screenshot-model-breakdown.png)
   - GNOME notification showing per-model statistics
   - Multiple models listed with token counts and costs
   - Clear, readable text
   - Shows the detail view feature

3. **Idle Detection Warning** (screenshot-idle-notification.png)
   - GNOME notification for idle session
   - Shows "OpenCode Session Idle" message
   - Demonstrates automatic monitoring feature

4. **Preferences Window** (screenshot-preferences.png)
   - Extension preferences UI
   - Shows all configuration options:
     - Idle threshold slider
     - Polling interval
     - File monitoring toggle
     - Budget settings
   - Well-organized, professional layout

#### Optional Screenshots

5. **Cost Tracking Display** (screenshot-cost-tracking.png)
   - Focus on monetary cost display
   - Shows budget tracking in action
   - Highlights financial awareness feature

### Areas to Screenshot
1. Top bar with extension icon
2. Full dropdown menu (with "Last update" label)
3. Session details notification
4. Daily details notification
5. Total details notification
6. Idle warning notification
7. Refresh action in progress
8. "Last update" label showing different time formats
9. Preferences window with all settings
10. Cost tracking features (if available)

### Image Optimization

After creating screenshots, optimize for web:

```bash
# Using optipng (preserves quality)
optipng -o7 screenshots/*.png

# Using pngquant (reduces size)
pngquant --quality=80-95 screenshots/*.png --ext .png --force

# Check file sizes
ls -lh screenshots/
```

### Screenshot Workflow

```bash
# Step 1: Generate test data
./test-data-generator.sh

# Step 2: Enable extension
gnome-extensions enable opencode-stats@fmatsos.github.com

# Step 3: Take screenshots
# Method A: Use GNOME Screenshot with area selection
gnome-screenshot -a

# Method B: Use keyboard shortcut
# Press Shift+PrtScn, then select area

# Step 4: Save to screenshots directory
# Name files descriptively: screenshot-menu.png, etc.

# Step 5: Verify and optimize
ls -lh screenshots/
optipng -o7 screenshots/*.png
```

### Screenshot Captions for Submission

When uploading to extensions.gnome.org, use descriptive captions:

- **screenshot-menu.png:** "Main statistics menu showing session, daily, and total token usage with real-time updates"
- **screenshot-model-breakdown.png:** "Detailed per-model token breakdown with cost tracking"
- **screenshot-idle-notification.png:** "Automatic idle session detection with configurable threshold"
- **screenshot-preferences.png:** "Comprehensive preferences for customizing monitoring behavior"
- **screenshot-cost-tracking.png:** "Real-time cost tracking to manage AI API spending"

## Example Visual Layouts

### Compact Mode (Few tokens)
```
Session: 250 tokens
Today: 1.2K tokens
Total: 15.0K tokens
```

### Medium Mode (Moderate usage)
```
Session: 2.5K tokens
Today: 12.5K tokens
Total: 150.0K tokens
```

### Large Mode (Heavy usage)
```
Session: 15.0K tokens
Today: 50.0K tokens
Total: 2.5M tokens
```

## Icon States

The extension icon remains static but:
- Always visible when extension is enabled
- Hidden when extension is disabled
- Follows system icon theme

## Error States

If OpenCode data is unavailable:
```
Session: Loading...
Today: Loading...
Total: Loading...
```

After refresh with no data:
```
Session: 0 tokens
Today: 0 tokens
Total: 0 tokens
```

This ensures users always see something meaningful.
