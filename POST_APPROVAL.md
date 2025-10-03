# Post-Approval Actions

This guide outlines all actions to take after the extension is approved and published on extensions.gnome.org.

## Immediate Actions (Within 24 Hours)

### 1. Update README.md

Replace the "Coming Soon" section with the actual installation method:

```bash
# Edit README.md
# Find the section with <!-- POST-APPROVAL: Replace the above section with: -->
# Replace with actual extension URL and ID
```

**Changes to make:**

1. Update Method 3 heading from "(Coming Soon)" to the actual extension link
2. Replace placeholder XXXX with actual extension ID from extensions.gnome.org
3. Reorder methods so extensions.gnome.org is Method 1 (recommended)

**Example:**
```markdown
## Installation

### Method 1: GNOME Extensions Website (Recommended)

Install directly from [extensions.gnome.org](https://extensions.gnome.org/extension/[ID]/opencode-statistics/)

**Using Web Browser:**
1. Visit the extension page with a browser that has GNOME Shell integration
2. Toggle the switch to "ON"
3. Confirm installation when prompted
4. Extension installs and enables automatically

**Using Command Line:**
```bash
# Download and install from extensions.gnome.org
gnome-extensions install [ID]

# Or visit the website and click "Download"
```

### Method 2: Automated Script

[Current Method 1 content]

### Method 3: Manual Installation

[Current Method 2 content]
```

### 2. Add Extension Badge

Add a badge to the top of README.md (near title or features section):

```markdown
[![GNOME Extension](https://img.shields.io/badge/GNOME-Extension-4A86CF?logo=gnome&logoColor=white)](https://extensions.gnome.org/extension/[ID]/)
```

Optional additional badges:
```markdown
[![License](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](LICENSE)
[![GNOME Shell](https://img.shields.io/badge/GNOME%20Shell-42--49-blue)](https://extensions.gnome.org/extension/[ID]/)
```

### 3. Update SUBMISSION_CHECKLIST.md

Mark submission as complete:

```markdown
### Submission Process
- [x] Extension submitted
- [x] Extension approved
- [x] Extension live on extensions.gnome.org

### Post-Approval
- [ ] README.md updated
- [ ] Extension badge added
- [ ] GitHub release created
- [ ] Announcement posted
```

## GitHub Release (Within 1 Week)

### 1. Create Git Tag

```bash
cd /home/runner/work/gnome-opencode/gnome-opencode

# Create annotated tag for version 1
git tag -a v1 -m "Version 1.0 - Initial Release

First official release on extensions.gnome.org

Features:
- Real-time token tracking (session, daily, total)
- Per-model breakdown and cost monitoring
- Automatic session idle detection
- File monitoring for instant updates
- Configurable polling and notifications
- Budget alerts and spending awareness
- Clean, native GNOME interface

Supports GNOME Shell 42-49"

# Push tag to GitHub
git push origin v1
```

### 2. Create GitHub Release

1. Go to https://github.com/fmatsos/gnome-opencode/releases/new
2. Select tag: `v1`
3. Release title: `v1.0 - Initial Release`
4. Description:

```markdown
# GNOME OpenCode Statistics Extension v1.0

🎉 **First official release!** Now available on [extensions.gnome.org](https://extensions.gnome.org/extension/[ID]/)

## Features

- 📊 **Real-time Token Tracking** - Monitor session, daily, and total usage
- 💰 **Cost Monitoring** - Track spending across AI models
- 🔔 **Idle Detection** - Get notified after 15 minutes of inactivity
- ⚡ **Instant Updates** - File monitoring for real-time statistics
- 🎛️ **Configurable** - Customize polling, thresholds, and notifications
- 🎨 **Native UI** - Clean GNOME interface with theme support

## Installation

**Recommended:** Install from [extensions.gnome.org](https://extensions.gnome.org/extension/[ID]/)

**Manual:** Download `opencode-stats-v1.zip` below and install with:
```bash
gnome-extensions install opencode-stats-v1.zip
gnome-extensions enable opencode-stats@fmatsos.github.com
```

## Requirements

- GNOME Shell 42 or later (tested through 49)
- [OpenCode](https://github.com/sst/opencode) for functionality (optional for testing)

## Documentation

- [README.md](README.md) - Complete guide
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical details
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues
- [CONTRIBUTING.md](CONTRIBUTING.md) - Development guide

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed changes.

## Support

- Report issues: [GitHub Issues](https://github.com/fmatsos/gnome-opencode/issues)
- Discussions: [GitHub Discussions](https://github.com/fmatsos/gnome-opencode/discussions)
- OpenCode support: [OpenCode Repository](https://github.com/sst/opencode)

## License

GPL-3.0 - See [LICENSE](LICENSE) file for details
```

5. Attach files:
   - Upload `opencode-stats-v1.zip`

6. Check "Set as the latest release"
7. Click "Publish release"

## Update CHANGELOG.md (Within 1 Week)

Add entry for v1.0:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [1.0] - YYYY-MM-DD

### Added
- Initial release on extensions.gnome.org
- Real-time token tracking (session, daily, total)
- Per-model token breakdown and cost monitoring
- Automatic idle session detection (configurable threshold)
- File monitoring for instant statistics updates
- Configurable polling interval (fallback)
- Budget alerts and spending awareness
- Native GNOME interface with system theme support
- Preferences UI for customization
- Support for GNOME Shell 42-49

### Documentation
- Comprehensive README with installation and usage guides
- Architecture documentation (ARCHITECTURE.md)
- Troubleshooting guide (TROUBLESHOOTING.md)
- Contributing guidelines (CONTRIBUTING.md)
- Submission documentation (SUBMISSION.md)
- Testing procedures (TEST_PACKAGE.md)

### OpenCode Integration
- Plugin for exporting statistics
- Session tracking and idle detection
- Per-model token counting
- Cost calculation and tracking
```

## Announcements (Within 2 Weeks)

### 1. GitHub Discussions

Create a new discussion in "Announcements" category:

**Title:** "🎉 v1.0 Released - Now on extensions.gnome.org!"

**Content:**
```markdown
I'm excited to announce that GNOME OpenCode Statistics Extension v1.0 is now officially available on [extensions.gnome.org](https://extensions.gnome.org/extension/[ID]/)! 🎉

## What is it?

A GNOME Shell extension that displays real-time AI usage statistics for OpenCode directly in your system tray. Perfect for developers who want to monitor token consumption, track costs, and manage AI API budgets.

## Key Features

- 📊 Real-time token tracking
- 💰 Cost monitoring by model
- 🔔 Idle session detection
- ⚡ Instant file monitoring
- 🎛️ Fully configurable
- 🎨 Native GNOME interface

## Installation

One-click install from [extensions.gnome.org](https://extensions.gnome.org/extension/[ID]/)

## Feedback Welcome

Please try it out and let me know what you think! Report any issues or suggestions in [GitHub Issues](https://github.com/fmatsos/gnome-opencode/issues).

Happy coding! 🚀
```

### 2. Reddit r/gnome

Create a new post:

**Title:** "[Release] GNOME OpenCode Statistics - Track AI Token Usage in Your Panel"

**Content:**
```markdown
Hi r/gnome! I've just released a new extension that might be useful for developers using AI coding assistants.

**GNOME OpenCode Statistics** displays real-time AI usage statistics for OpenCode in your GNOME panel.

🔗 [extensions.gnome.org/extension/[ID]/](https://extensions.gnome.org/extension/[ID]/)
📦 [GitHub Repository](https://github.com/fmatsos/gnome-opencode)

## Features

- Real-time token and cost tracking
- Idle session detection
- Per-model breakdown
- Budget alerts
- File monitoring for instant updates

## Requirements

- GNOME Shell 42+
- [OpenCode](https://github.com/sst/opencode) (open-source AI coding agent)

Feedback and contributions welcome! Let me know if you have any questions.
```

### 3. GNOME Discourse

Post in "Extensions" category:

**Title:** "New Extension: OpenCode Statistics - AI Usage Tracking"

**Content:**
```markdown
Hello GNOME community!

I'm pleased to announce the release of **GNOME OpenCode Statistics**, an extension for monitoring AI token usage with OpenCode.

🔗 **Extension Page:** https://extensions.gnome.org/extension/[ID]/
📦 **Source Code:** https://github.com/fmatsos/gnome-opencode

## About

This extension displays real-time statistics in your GNOME panel for:
- Token consumption (session/daily/total)
- Costs per AI model
- Session idle detection
- Budget tracking

## Compatibility

- GNOME Shell 42-49
- No external dependencies
- Pure GJS implementation

## Features

- Native GNOME interface
- File monitoring for instant updates
- Configurable thresholds and intervals
- Per-model breakdown views
- Privacy-focused (all data local)

## Feedback

I'd love to hear your thoughts and suggestions! Feel free to open issues or contribute on GitHub.

Thanks to the GNOME extension reviewers for their helpful feedback during the review process!
```

### 4. Social Media (Optional)

**Twitter/Mastodon:**
```
🎉 Just released GNOME OpenCode Statistics v1.0!

Track AI token usage & costs right in your GNOME panel 📊

✨ Real-time monitoring
💰 Budget tracking
🔔 Idle detection
⚡ Instant updates

Install: https://extensions.gnome.org/extension/[ID]/
Source: https://github.com/fmatsos/gnome-opencode

#GNOME #Linux #AI #OpenSource
```

## Monitor and Respond (Ongoing)

### 1. Watch Extension Reviews

- Check extensions.gnome.org weekly for reviews
- Respond to user reviews (both positive and negative)
- Address common issues in documentation
- Consider feature requests for future versions

### 2. Track Download Statistics

- Monitor download count on extensions.gnome.org
- Track GitHub stars and forks
- Note any trends or spikes

### 3. Address Issues

- Respond to GitHub issues within 24-48 hours
- Triage and label appropriately
- Fix critical bugs quickly
- Plan enhancements based on feedback

### 4. Plan Updates

After initial release stabilizes:
- Gather user feedback
- Identify common issues
- Plan v1.1 or v2.0 features
- Follow semantic versioning

## Version Updates (Future)

When releasing updates:

1. Update version in `metadata.json`
2. Run `./package.sh` to create new package
3. Upload new version to extensions.gnome.org
4. Create new git tag and GitHub release
5. Update CHANGELOG.md
6. Announce major updates

## Success Metrics

Track these metrics to measure success:

- **Downloads:** Target 1,000+ in first month
- **Rating:** Maintain 4+ stars
- **GitHub Stars:** Target 50+ in first month
- **Issues:** Aim for < 5 open issues
- **Community:** Active discussions and contributions

## Maintenance Schedule

Suggested ongoing maintenance:

- **Daily:** Check for critical issues
- **Weekly:** Review new issues and reviews
- **Monthly:** Plan minor updates
- **Quarterly:** Plan major feature updates
- **Annually:** Update supported GNOME Shell versions

---

## Checklist

Use this checklist to track post-approval tasks:

### Immediate (24 hours)
- [ ] Update README.md with extension link
- [ ] Add extension badge
- [ ] Update SUBMISSION_CHECKLIST.md

### Within 1 Week
- [ ] Create git tag (v1)
- [ ] Create GitHub release
- [ ] Attach package to release
- [ ] Update CHANGELOG.md

### Within 2 Weeks
- [ ] Post GitHub announcement
- [ ] Post on Reddit r/gnome
- [ ] Post on GNOME Discourse
- [ ] Share on social media (optional)

### Ongoing
- [ ] Monitor reviews on extensions.gnome.org
- [ ] Respond to GitHub issues
- [ ] Track download statistics
- [ ] Plan future updates

---

**Last Updated:** October 2025  
**Version:** 1.0  
**Purpose:** Post-approval action plan
