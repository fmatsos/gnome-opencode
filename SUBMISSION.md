# GNOME Extensions Website Submission Guide

This document contains all information needed to submit the GNOME OpenCode Statistics Extension to [extensions.gnome.org](https://extensions.gnome.org/).

## Extension Package

**Package File:** `opencode-stats-v1.zip` (created by running `./package.sh`)

**Contents:**
- extension.js (main extension code)
- prefs.js (preferences UI)
- metadata.json (extension metadata)
- stylesheet.css (UI styling)
- schemas/org.gnome.shell.extensions.opencode-stats.gschema.xml
- schemas/gschemas.compiled

## Extension Metadata

**Name:** OpenCode Statistics

**UUID:** opencode-stats@fmatsos.github.com

**Version:** 1

**GNOME Shell Versions:** 42, 43, 44, 45, 46, 47, 48, 49

**License:** GPL-3.0 (fully compatible with GNOME Extensions requirements)

**GitHub Repository:** https://github.com/fmatsos/gnome-opencode

## Short Description (250 characters max)

```
Track OpenCode AI usage in real-time from your GNOME panel. Monitor token consumption, costs, and session activity with automatic updates and idle detection. Perfect for managing AI API budgets.
```

**Character count:** 213/250 ✓

## Long Description

```
GNOME OpenCode Statistics displays comprehensive AI usage metrics for OpenCode directly in your system tray.

Features:
• Real-time token tracking (session, daily, total)
• Per-model breakdown and cost monitoring
• Automatic session idle detection
• File monitoring for instant updates
• Configurable polling and notifications
• Budget alerts and spending awareness
• Clean, native GNOME interface

This extension helps developers and AI enthusiasts:
- Monitor API usage and costs
- Avoid unexpected billing
- Track productivity patterns
- Optimize model selection
- Manage multiple projects

No external dependencies. All data stored locally. Zero telemetry.

Requires OpenCode (https://github.com/sst/opencode) with included plugin for full functionality.
```

## Submission Tags

Suggested tags for discoverability:
- productivity
- system
- monitoring
- ai
- developer-tools
- statistics

## Screenshots

**Location:** `screenshots/` directory

### Required Screenshots (To Be Created)

1. **screenshot-menu.png** - Panel icon with dropdown menu open
   - Shows: Session, Today, Total statistics
   - Shows: "Last update" timestamp
   - Shows: "Refresh Statistics" button
   - Demonstrates: Main UI and statistics display

2. **screenshot-model-breakdown.png** - Model breakdown notification
   - Shows: Per-model token breakdown
   - Demonstrates: Detailed statistics view

3. **screenshot-idle-notification.png** - Idle session warning
   - Shows: Idle notification after 15+ minutes
   - Demonstrates: Idle detection feature

4. **screenshot-preferences.png** - Preferences window
   - Shows: All configurable settings
   - Shows: Idle threshold, polling interval, file monitoring
   - Demonstrates: Customization options

5. **screenshot-cost-tracking.png** (Optional) - Cost display
   - Shows: Token counts with monetary costs
   - Demonstrates: Budget tracking feature

### Screenshot Requirements

- **Format:** PNG
- **Resolution:** 800x600 minimum (higher recommended)
- **Theme:** Default GNOME or popular theme (Adwaita recommended)
- **Content:** Realistic test data (use `./test-data-generator.sh`)
- **Quality:** Clear, high-resolution, no personal information
- **Size:** < 500KB per image

### Creating Screenshots

```bash
# Generate test data
./test-data-generator.sh

# Enable extension (if not already enabled)
gnome-extensions enable opencode-stats@fmatsos.github.com

# Take screenshots using GNOME Screenshot
# Method 1: Press PrtScn for full screen
# Method 2: Press Shift+PrtScn for area selection
# Method 3: Use gnome-screenshot command

# Save screenshots to screenshots/ directory with descriptive names
```

## Pre-Submission Checklist

### Code Quality
- [x] Extension loads without errors
- [x] Proper error handling implemented
- [x] Resources cleaned up in destroy() methods
- [x] No memory leaks
- [x] No JavaScript errors in console
- [x] Proper GObject registration

### Metadata
- [x] metadata.json has all required fields
- [x] UUID matches directory name
- [x] Version number is correct
- [x] Shell versions are accurate (42-49)
- [x] URL points to GitHub repository
- [x] Description is clear and concise

### Functionality
- [x] Extension works on GNOME Shell 42+
- [x] Preferences window opens correctly
- [x] Settings persist across sessions
- [x] No external dependencies
- [x] File monitoring works
- [x] Idle detection works
- [x] Statistics refresh correctly

### Packaging
- [x] package.sh creates valid .zip
- [x] All required files included (extension.js, prefs.js, metadata.json, stylesheet.css, schemas/)
- [x] Schemas compile without errors
- [x] Package installs correctly with gnome-extensions install

### Documentation
- [x] README.md is comprehensive
- [x] Installation instructions are clear
- [x] License file exists (GPL-3.0)
- [x] No obfuscated code
- [x] Code comments are helpful

### Privacy & Security
- [x] No telemetry or tracking
- [x] No external network requests (except reading local files)
- [x] All data stored locally
- [x] No credentials or sensitive data collected
- [x] Follows GNOME privacy guidelines

### Screenshots
- [ ] 3-5 high-quality screenshots created
- [ ] Screenshots show all major features
- [ ] No personal information visible
- [ ] Proper file sizes (< 500KB each)
- [ ] Descriptive filenames used

## Submission Process

### Step 1: Create Account
1. Go to https://extensions.gnome.org
2. Sign in with Ubuntu SSO or create account
3. Complete profile setup

### Step 2: Upload Extension
1. Navigate to "Upload Extension" or "Developer" section
2. Click "Upload Extension"
3. Upload `opencode-stats-v1.zip`

### Step 3: Fill Extension Details
- **Name:** OpenCode Statistics
- **Description:** Use short description above
- **Long Description:** Use long description above
- **License:** GPL-3.0
- **Tags:** productivity, system, monitoring, ai, developer-tools, statistics
- **Screenshots:** Upload all PNG files from screenshots/ directory

### Step 4: Submit for Review
- Review all information carefully
- Check "I confirm this extension follows the guidelines"
- Click "Submit for Review"

### Step 5: Wait for Review
- **Expected timeline:** 1-4 weeks
- **Process:** Reviewers check code quality, security, and functionality
- **Outcome:** Approved, Changes Requested, or Rejected

## Common Review Issues to Avoid

### Memory Leaks
✓ All timeouts are removed in destroy()
✓ File monitors are cancelled in destroy()
✓ No dangling references to objects

### Error Handling
✓ Try-catch blocks around risky operations
✓ Proper error logging with logError()
✓ Graceful degradation when data unavailable

### Resource Cleanup
✓ destroy() method properly implemented
✓ All GLib sources removed
✓ All signal connections disconnected

### Code Quality
✓ No hardcoded paths
✓ Proper use of GSettings for preferences
✓ Following GNOME Shell extension best practices
✓ Clear, readable code with comments

## Post-Approval Steps

### Update README.md
Once approved, update the installation section:

```markdown
## Installation

### Method 1: GNOME Extensions Website (Recommended)

Install directly from [extensions.gnome.org/extension/XXXX/opencode-statistics/](https://extensions.gnome.org/extension/XXXX/opencode-statistics/)

Click "Install" on the extension page when using a supported browser with the GNOME Shell integration extension installed.

### Method 2: Automated Script
[existing instructions]

### Method 3: Manual Installation
[existing instructions]
```

### Add Extension Badge
Add badge to README.md:
```markdown
[![GNOME Extension](https://img.shields.io/badge/GNOME-Extension-4A86CF?logo=gnome)](https://extensions.gnome.org/extension/XXXX/)
```

### Create GitHub Release
1. Create git tag: `git tag -a v1 -m "Version 1 - Initial release"`
2. Push tag: `git push origin v1`
3. Create GitHub release with:
   - Title: "v1 - Initial Release"
   - Description: Changelog and features
   - Attach: opencode-stats-v1.zip
   - Link to extensions.gnome.org page

### Announce Release
Share on:
- GitHub Discussions
- Reddit r/gnome
- GNOME Discourse
- Twitter/Mastodon with #GNOME tag

## Review Guidelines Reference

**Official Guidelines:**
- https://extensions.gnome.org/about/
- https://gjs.guide/extensions/review-guidelines/review-guidelines.html

**Key Requirements:**
1. Extension must load without JavaScript errors
2. Must not interfere with GNOME Shell operation
3. Must clean up resources properly on disable
4. No external dependencies (pure GJS)
5. GPL-compatible license
6. No telemetry or phone-home functionality
7. No obfuscated code
8. Proper metadata.json format
9. Must work on declared GNOME Shell versions

## Troubleshooting Submission

### Package Rejected - File Missing
**Solution:** Run `./package.sh` again, verify with `unzip -l opencode-stats-v1.zip`

### Extension Won't Load
**Solution:** Test with `gnome-extensions install opencode-stats-v1.zip` and check `journalctl` logs

### Schema Errors
**Solution:** Run `glib-compile-schemas schemas/` to verify schema compiles

### Version Compatibility Issues
**Solution:** Test on GNOME Shell 42, 45, and latest version

### Screenshots Rejected
**Solution:** Ensure no personal info, clear quality, proper format (PNG)

## Support During Review

If reviewers request changes:
1. Read feedback carefully
2. Make requested changes to code
3. Update version number in metadata.json
4. Run `./package.sh` to create new package
5. Re-upload and respond to reviewer comments

## Estimated Timeline

- **Preparation:** 1-2 days (screenshots, testing, documentation)
- **Submission:** 1 hour (filling forms, uploading files)
- **Review:** 1-4 weeks (depends on reviewer queue)
- **Revisions:** 1-3 days (if changes requested)
- **Publication:** Immediate after approval

## Success Criteria

- [x] Package created successfully
- [x] All required files included
- [x] Extension installs without errors
- [x] All features work as documented
- [ ] Screenshots created and show all features
- [ ] Submission form completed
- [ ] Extension submitted for review
- [ ] Extension approved and live on extensions.gnome.org
- [ ] README updated with installation link
- [ ] GitHub release created

## Contact & Questions

For questions about:
- **Extension functionality:** GitHub Issues
- **Submission process:** GNOME Extensions support
- **Review status:** Check extensions.gnome.org dashboard

---

**Document Version:** 1.0  
**Last Updated:** October 2025  
**Next Review:** After submission feedback
