# GNOME OpenCode Extension - Test Suite

This directory contains the automated test infrastructure for the GNOME OpenCode Statistics Extension.

## Test Structure

```
tests/
├── run-tests.sh              # Main test runner
├── validate-extension.sh     # Extension validation script
├── unit/                     # Unit tests
│   ├── extension/            # Extension JavaScript tests
│   │   ├── formatting.test.js
│   │   ├── date-handling.test.js
│   │   ├── idle-detection.test.js
│   │   └── statistics.test.js
│   └── plugin/               # (placeholder for future plugin tests)
├── fixtures/                 # Test data files
│   ├── mock-opencode-stats.json
│   ├── empty-stats.json
│   ├── invalid-stats.json
│   ├── missing-fields-stats.json
│   ├── large-stats.json
│   └── small-cost-stats.json
└── helpers/                  # Test utilities
    └── test-utils.js
```

## Running Tests

### Run All Tests

```bash
./tests/run-tests.sh
```

This runs:
- Extension unit tests
- Plugin unit tests
- Extension validation

### Run Specific Test Suites

**Extension tests only:**
```bash
npm test
```

**Plugin tests only:**
```bash
cd opencode-plugin && npm test
```

**Validation only:**
```bash
./tests/validate-extension.sh
```

### Watch Mode (for development)

```bash
npm run test:watch
```

### Generate Coverage Report

```bash
npm run test:coverage
```

## Test Coverage

Current test coverage includes:

### Extension Tests (52 tests)
- **Formatting Tests** (14 tests)
  - Token formatting (small numbers, thousands, millions)
  - Cost formatting (zero, cents, dollars)
  - Combined formatting
  
- **Date Handling Tests** (13 tests)
  - Date string formatting
  - Daily reset logic
  - Month/year transitions
  - Reset scenarios

- **Idle Detection Tests** (9 tests)
  - Idle time calculation
  - Threshold detection
  - Token activity checks
  
- **Statistics Tests** (16 tests)
  - Initialization
  - OpenCode stats updates
  - Edge cases handling
  - Model aggregation
  - Persistence

### Plugin Tests (21 tests)
- Statistics initialization
- Token tracking per model
- Cost tracking per model
- Daily statistics reset
- Session reset on plugin load
- Idle state detection

## Writing New Tests

### Test File Naming

- Place extension tests in `tests/unit/extension/`
- Place plugin tests in `opencode-plugin/tests/`
- Use `.test.js` suffix for all test files

### Example Test Structure

```javascript
import { describe, it, expect, beforeEach } from '@jest/globals';
import { loadFixture } from '../../helpers/test-utils.js';

describe('Feature Name', () => {
    let data;

    beforeEach(() => {
        data = loadFixture('test-data.json');
    });

    it('should do something specific', () => {
        // Arrange
        const input = 1000;
        
        // Act
        const result = functionToTest(input);
        
        // Assert
        expect(result).toBe(expectedOutput);
    });
});
```

### Using Test Helpers

The `test-utils.js` helper provides:

- `loadFixture(filename)` - Load test data from fixtures/
- `formatTokens(tokens)` - Format token counts
- `formatCost(cost)` - Format costs
- `getTodayString()` - Get current date string
- `getDefaultData()` - Create default statistics
- `calculateIdleMinutes(lastActivity, currentTime)` - Calculate idle time
- `shouldResetDaily(dailyDate, currentDate)` - Check if reset needed

### Adding Test Fixtures

1. Create JSON file in `tests/fixtures/`
2. Use descriptive names (e.g., `empty-stats.json`, `large-stats.json`)
3. Load in tests with `loadFixture('filename.json')`

## CI/CD Integration

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main`
- Release tags (v*)

See `.github/workflows/ci.yml` for the full CI/CD pipeline.

## Troubleshooting

### Tests Failing Locally

1. Ensure dependencies are installed:
   ```bash
   npm install
   ```

2. Check Node.js version (requires v20+):
   ```bash
   node --version
   ```

3. Clear any cached test data:
   ```bash
   rm -rf node_modules coverage
   npm install
   ```

### Validation Script Fails

- Ensure `jq` is installed: `sudo apt-get install jq`
- Ensure `glib-2.0-dev` is installed: `sudo apt-get install glib-2.0-dev`
- Check that all required files exist in the repository

### Plugin Tests Fail

- Make sure parent directory dependencies are installed first:
  ```bash
  npm install
  cd opencode-plugin && npm test
  ```

## Best Practices

1. **Unit tests only** - Test individual functions and logic
2. **No mocking GJS** - We test pure JavaScript logic, not GNOME Shell integration
3. **Keep tests fast** - Each test should run in milliseconds
4. **Use descriptive names** - Test names should clearly state what they test
5. **Test edge cases** - Include tests for empty data, invalid input, large numbers
6. **Keep fixtures realistic** - Use data that mirrors actual OpenCode output

## Future Enhancements

Potential additions to the test suite:

- [ ] Integration tests for file monitoring
- [ ] Performance benchmarks
- [ ] Visual regression tests for UI
- [ ] Automated accessibility testing
- [ ] Load testing with large statistics files
