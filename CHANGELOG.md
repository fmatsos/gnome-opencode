# Changelog

All notable changes to the GNOME OpenCode Statistics Extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Real-time file monitoring using Gio.FileMonitor for instant updates when OpenCode processes tokens
- "Last update" label in popup menu showing when statistics were last refreshed
- Automatic detection of stats file changes with immediate UI updates
- Proper file monitor cleanup on extension disable
- Idle notification spam prevention - shows only once per idle period
- **Preferences UI** for configurable timing settings (no code editing required)
- GSettings schema for persistent configuration
- Configurable idle threshold (1-120 minutes)
- Configurable polling interval (10-600 seconds)
- Toggle for enabling/disabling file monitoring

### Changed
- Update mechanism now uses file monitoring with 60-second polling as fallback (previously polling-only)
- DataManager now accepts callback for real-time UI updates
- Improved responsiveness - no need to wait up to 60 seconds for updates
- Timing constants replaced with GSettings for user-configurable values
- Idle notification behavior improved with smart reset logic

## [1.0.0] - 2024-01-04

### Added
- Initial release of GNOME OpenCode Statistics Extension
- System tray indicator with terminal icon
- Display of current session token usage
- Display of daily token usage (resets at midnight)
- Display of total cumulative token usage since installation
- Model-level breakdown of token usage
- Dropdown details buttons for session, daily, and total statistics
- Idle session warning after 15 minutes of inactivity
- Automatic statistics refresh every 60 seconds
- Manual refresh button
- Persistent data storage in JSON format
- OpenCode integration via stats file reading
- Support for GNOME Shell 42, 43, 44, 45, and 46
- Installation and uninstallation scripts
- Test data generator for development
- Packaging script for distribution
- Comprehensive documentation:
  - README with features and usage guide
  - OPENCODE_INTEGRATION with integration details
  - CONTRIBUTING with development guidelines
  - SCREENSHOTS with visual documentation
  - Example OpenCode stats file format

### Technical Details
- Written in JavaScript (GJS) for optimal GNOME Shell integration
- Uses GObject for proper GNOME Shell extension architecture
- Implements PanelMenu.Button for top bar integration
- Uses PopupMenu for dropdown interface
- Leverages Gio for file I/O operations
- Implements GLib timeouts for periodic updates
- Follows GNOME Shell extension best practices

### Files Included
- `extension.js` - Main extension code (11KB)
- `metadata.json` - Extension metadata
- `stylesheet.css` - UI styling
- `install.sh` - Installation script
- `uninstall.sh` - Uninstallation script
- `package.sh` - Packaging script for distribution
- `test-data-generator.sh` - Test data generator
- `README.md` - User documentation
- `CONTRIBUTING.md` - Contribution guidelines
- `OPENCODE_INTEGRATION.md` - Integration documentation
- `SCREENSHOTS.md` - Visual guide
- `example-opencode-stats.json` - Example stats file format
- `.gitignore` - Git ignore rules
- `LICENSE` - GPL-3.0 license

## [Unreleased]

### Planned Features
- Real-time updates via OpenCode API integration
- Cost tracking based on model pricing
- Historical data storage and trend visualization
- Preferences UI for configuration
- Multi-workspace support
- Export functionality (CSV, JSON)
- Internationalization (i18n) support
- Usage graphs and charts
- Custom icon themes
- Notification settings
- Token usage limits and alerts
- Monthly usage tracking
- Model comparison views
- Integration with OpenCode TypeScript SDK

### Known Limitations
- Requires OpenCode to provide statistics file
- Updates only every 60 seconds (not real-time)
- No graphical configuration interface yet
- No historical data visualization
- Limited to reading from file system (no API integration yet)

### Future Enhancements
- WebSocket integration for live updates
- Cloud sync of statistics
- Browser extension counterpart
- Mobile app companion
- Advanced analytics and insights
- Team usage tracking
- Budget management features

## Version History

### Version Numbering

This project uses semantic versioning (MAJOR.MINOR.PATCH):
- **MAJOR**: Incompatible API changes or major redesign
- **MINOR**: New features in a backwards compatible manner
- **PATCH**: Backwards compatible bug fixes

## Migration Guides

### From 0.x to 1.0
N/A - Initial release

## Support

For questions, bug reports, or feature requests:
- GitHub Issues: https://github.com/fmatsos/gnome-opencode/issues
- OpenCode: https://github.com/sst/opencode

## Contributors

- [fmatsos](https://github.com/fmatsos) - Initial work

See also the list of [contributors](https://github.com/fmatsos/gnome-opencode/contributors) who participated in this project.
