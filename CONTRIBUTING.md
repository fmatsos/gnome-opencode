# Contributing to GNOME OpenCode Statistics Extension

Thank you for your interest in contributing to this project! This document provides guidelines for contributing.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/gnome-opencode.git
   cd gnome-opencode
   ```
3. Install the extension for testing:
   ```bash
   ./install.sh
   ```

## Development Workflow

### Making Changes

1. Create a new branch for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes to the code

3. Test your changes:
   ```bash
   # Disable and re-enable the extension
   gnome-extensions disable opencode-stats@fmatsos.github.com
   gnome-extensions enable opencode-stats@fmatsos.github.com
   
   # Or restart GNOME Shell (X11 only)
   # Alt+F2, type 'r', press Enter
   ```

4. Check the logs for errors:
   ```bash
   journalctl -f -o cat /usr/bin/gnome-shell | grep opencode
   ```

### Testing

**Automated Testing (Required):**

1. Install test dependencies:
   ```bash
   npm install
   ```

2. Run all tests before submitting:
   ```bash
   ./tests/run-tests.sh
   ```

3. Run specific test suites:
   ```bash
   # Extension tests only
   npm test
   
   # Plugin tests only
   cd opencode-plugin && npm test
   
   # With coverage
   npm run test:coverage
   ```

4. Write tests for new features:
   - Add unit tests in `tests/unit/extension/` for extension logic
   - Add tests in `opencode-plugin/tests/` for plugin changes
   - Use existing test patterns as examples
   - See [tests/README.md](tests/README.md) for details

**Manual Testing:**

1. Generate test data:
   ```bash
   ./test-data-generator.sh
   ```

2. Verify the extension displays the data correctly:
   - Click the terminal icon in the top bar
   - Check that statistics are displayed
   - Test the "View Details" buttons
   - Verify the refresh functionality

3. Test idle detection (optional):
   - Edit `extension.js` to reduce `IDLE_THRESHOLD_MINUTES` to 1
   - Wait for the idle notification
   - Restore the original value

### Code Style

- Use 4 spaces for indentation (matching GNOME Shell conventions)
- Use camelCase for variable and function names
- Use PascalCase for class names
- Add comments for complex logic
- Keep lines under 120 characters when reasonable

### JavaScript/GJS Specific

- Import GNOME modules explicitly at the top of files
- Use `GObject.registerClass` for creating GObject-based classes
- Handle errors with try-catch blocks
- Log errors with `logError(e, 'Description')`
- Use `GLib.timeout_add_seconds` for periodic tasks

## Pull Request Process

1. Ensure all tests pass:
   ```bash
   ./tests/run-tests.sh
   ```

2. Commit your changes with clear, descriptive messages:
   ```bash
   git commit -m "Add feature: description of feature"
   ```

3. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Open a Pull Request on GitHub with:
   - A clear title describing the change
   - A detailed description of what changed and why
   - Screenshots for UI changes
   - Test results (CI will run automatically)
   - Confirmation that all tests pass locally

5. Wait for review and address any feedback

**Note:** The CI pipeline will automatically:
- Run all unit tests
- Validate extension files
- Check code quality
- Build the extension package

Pull requests must pass all CI checks before merging.

## Types of Contributions

### Bug Reports

When reporting bugs, please include:
- GNOME Shell version (`gnome-shell --version`)
- Extension version
- Steps to reproduce the bug
- Expected behavior
- Actual behavior
- Relevant log output

### Feature Requests

For feature requests, please describe:
- The problem you're trying to solve
- Your proposed solution
- Why this would be useful to other users
- Any implementation ideas you have

### Code Contributions

We welcome contributions for:
- Bug fixes
- New features
- Performance improvements
- Documentation improvements
- UI/UX enhancements
- Translations (future)

## Areas for Improvement

Here are some areas where contributions would be particularly valuable:

### High Priority

1. **OpenCode Integration**: Create a proper OpenCode plugin/extension that exports statistics
2. **Real-time Updates**: Implement WebSocket or polling for live statistics
3. **Error Handling**: Improve error messages and recovery
4. **Testing**: Add automated tests

### Medium Priority

1. **Cost Tracking**: Add cost calculations based on model pricing
2. **Historical Data**: Store and display trends over time
3. **Preferences UI**: Add a preferences dialog for configuration
4. **Custom Themes**: Support different icon styles and colors

### Low Priority

1. **Export Data**: Allow exporting statistics to CSV/JSON
2. **Usage Graphs**: Display token usage over time graphically
3. **Multi-workspace**: Support multiple OpenCode workspaces
4. **Internationalization**: Add support for multiple languages

## Coding Guidelines

### Extension Structure

```javascript
// Import GNOME modules
import GObject from 'gi://GObject';
import St from 'gi://St';
// ... other imports

// Import Shell modules
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
// ... other shell imports

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

// Constants
const SOME_CONSTANT = 42;

// Classes
const MyClass = GObject.registerClass(
class MyClass extends ParentClass {
    _init() {
        super._init();
        // initialization
    }
});

// Extension class
export default class MyExtension extends Extension {
    enable() {
        // Enable logic
    }
    
    disable() {
        // Cleanup logic
    }
}
```

### Error Handling

```javascript
try {
    // risky operation
} catch (e) {
    logError(e, 'Failed to perform operation');
    // handle error gracefully
}
```

### Resource Cleanup

Always clean up resources in the `destroy()` method:

```javascript
destroy() {
    if (this._timeout) {
        GLib.source_remove(this._timeout);
        this._timeout = null;
    }
    super.destroy();
}
```

## Documentation

- Update README.md for user-facing changes
- Update OPENCODE_INTEGRATION.md for integration changes
- Add inline comments for complex logic
- Update this CONTRIBUTING.md if the development process changes

## Questions?

If you have questions about contributing:
- Open an issue with the `question` label
- Check existing issues and pull requests
- Review the GNOME Shell extension development guide: https://gjs.guide/extensions/

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Accept criticism gracefully
- Prioritize the community's best interests

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Publishing others' private information
- Other unprofessional conduct

## License

By contributing, you agree that your contributions will be licensed under the GNU General Public License v3.0 or later, the same license as the project.

## Recognition

Contributors will be recognized in the project README. Significant contributions may result in being added as a project maintainer.

Thank you for contributing to GNOME OpenCode Statistics Extension!
