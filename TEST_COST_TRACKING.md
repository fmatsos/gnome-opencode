# Cost Tracking Feature - Testing Guide

This document provides comprehensive testing instructions for the cost tracking and budget alerts feature.

## Prerequisites

- GNOME Shell 42+ environment
- OpenCode installed (optional - can use test data)
- Extension installed and enabled

## Test Setup

### 1. Install the Extension

```bash
./install.sh
gnome-extensions enable opencode-stats@fmatsos.github.com
```

### 2. Create Test Data

Create a test stats file with cost information:

```bash
mkdir -p ~/.local/share/opencode
cat > ~/.local/share/opencode/stats.json << 'EOF'
{
  "session": {
    "totalTokens": 15234,
    "tokensByModel": {
      "gpt-4": 10123,
      "claude-3-sonnet": 5111
    },
    "totalCost": 0.45,
    "costsByModel": {
      "gpt-4": 0.30,
      "claude-3-sonnet": 0.15
    },
    "lastActivity": 1234567890000,
    "startTime": 1234567800000,
    "isIdle": false
  },
  "daily": {
    "totalTokens": 25678,
    "tokensByModel": {
      "gpt-4": 18234,
      "claude-3-sonnet": 7444
    },
    "totalCost": 4.50,
    "costsByModel": {
      "gpt-4": 3.30,
      "claude-3-sonnet": 1.20
    },
    "date": "2024-01-15"
  },
  "total": {
    "totalTokens": 1234567,
    "tokensByModel": {
      "gpt-4": 890123,
      "claude-3-sonnet": 344444
    },
    "totalCost": 35.42,
    "costsByModel": {
      "gpt-4": 26.70,
      "claude-3-sonnet": 8.72
    },
    "installDate": 1234000000000
  }
}
EOF
```

### 3. Restart GNOME Shell

- **X11**: Press `Alt+F2`, type `r`, press Enter
- **Wayland**: Log out and log back in

## Test Cases

### Test 1: Cost Display in Menu

**Objective**: Verify cost appears alongside token counts

**Steps**:
1. Click the terminal icon in the top bar
2. Observe the menu items

**Expected Result**:
- Session line should show: "Session: 15.23K tokens ($0.45)"
- Daily line should show: "Today: 25.68K tokens ($4.50)"
- Total line should show: "Total: 1.23M tokens ($35.42)"

**Status**: ☐ Pass ☐ Fail

---

### Test 2: Small Cost Formatting

**Objective**: Verify costs under $0.01 display in cents

**Steps**:
1. Update test data with small cost:
```bash
cat > ~/.local/share/opencode/stats.json << 'EOF'
{
  "session": {
    "totalTokens": 500,
    "tokensByModel": { "gpt-3.5": 500 },
    "totalCost": 0.0075,
    "costsByModel": { "gpt-3.5": 0.0075 },
    "lastActivity": 1234567890000,
    "startTime": 1234567800000
  },
  "daily": { "totalTokens": 500, "tokensByModel": {}, "totalCost": 0.0075, "costsByModel": {}, "date": "2024-01-15" },
  "total": { "totalTokens": 500, "tokensByModel": {}, "totalCost": 0.0075, "costsByModel": {} }
}
EOF
```
2. Click "Refresh Statistics"
3. Observe session cost

**Expected Result**:
- Should show: "Session: 500 tokens ($0.75¢)"

**Status**: ☐ Pass ☐ Fail

---

### Test 3: Cost Toggle Setting

**Objective**: Verify cost display can be disabled

**Steps**:
1. Open preferences: `gnome-extensions prefs opencode-stats@fmatsos.github.com`
2. Navigate to "Budget Settings"
3. Toggle OFF "Show Costs in Menu"
4. Reload extension (disable/enable)
5. Click terminal icon

**Expected Result**:
- Menu should show: "Session: 15.23K tokens" (no cost)
- Menu should show: "Today: 25.68K tokens" (no cost)

**Status**: ☐ Pass ☐ Fail

---

### Test 4: Budget Alert - Above Threshold

**Objective**: Verify budget alert triggers at threshold

**Steps**:
1. Open preferences
2. Set "Daily Budget (USD)" to: 5.00
3. Set "Alert Threshold (%)" to: 80
4. Reload extension
5. Update test data with $4.50 daily cost (90% of budget)
6. Click "Refresh Statistics"

**Expected Result**:
- Notification should appear: "Daily Budget Alert"
- Message: "You've used 90% of your daily budget ($4.50 of $5.00)"

**Status**: ☐ Pass ☐ Fail

---

### Test 5: Budget Alert - Below Threshold

**Objective**: Verify no alert when below threshold

**Steps**:
1. Keep daily budget at $5.00, threshold at 80%
2. Update test data with $3.00 daily cost (60% of budget)
3. Click "Refresh Statistics"

**Expected Result**:
- No notification should appear

**Status**: ☐ Pass ☐ Fail

---

### Test 6: Budget Alert - Exactly at Threshold

**Objective**: Verify alert triggers at exact threshold

**Steps**:
1. Keep daily budget at $5.00, threshold at 80%
2. Update test data with $4.00 daily cost (exactly 80%)
3. Click "Refresh Statistics"

**Expected Result**:
- Notification should appear with 80% message

**Status**: ☐ Pass ☐ Fail

---

### Test 7: Model Breakdown with Costs

**Objective**: Verify per-model cost display

**Steps**:
1. Ensure "Show Costs in Menu" is enabled
2. Click terminal icon
3. Click "View Session Details"

**Expected Result**:
- Notification shows model breakdown with costs:
  - "gpt-4: 10.12K tokens ($0.3000)"
  - "claude-3-sonnet: 5.11K tokens ($0.1500)"

**Status**: ☐ Pass ☐ Fail

---

### Test 8: Backward Compatibility - No Cost Fields

**Objective**: Verify extension works with old stats format

**Steps**:
1. Create stats file without cost fields:
```bash
cat > ~/.local/share/opencode/stats.json << 'EOF'
{
  "session": {
    "totalTokens": 1500,
    "tokensByModel": { "gpt-4": 1500 },
    "lastActivity": 1234567890000,
    "startTime": 1234567800000
  },
  "daily": {
    "totalTokens": 5000,
    "tokensByModel": { "gpt-4": 5000 },
    "date": "2024-01-15"
  },
  "total": {
    "totalTokens": 50000,
    "tokensByModel": { "gpt-4": 50000 }
  }
}
EOF
```
2. Click "Refresh Statistics"

**Expected Result**:
- Extension loads without errors
- Menu shows: "Session: 1.50K tokens" (no cost displayed)
- No budget alerts triggered

**Status**: ☐ Pass ☐ Fail

---

### Test 9: Zero Cost Display

**Objective**: Verify free models don't show $0.00

**Steps**:
1. Update test data with zero cost:
```bash
cat > ~/.local/share/opencode/stats.json << 'EOF'
{
  "session": {
    "totalTokens": 1000,
    "tokensByModel": { "local-llm": 1000 },
    "totalCost": 0,
    "costsByModel": { "local-llm": 0 },
    "lastActivity": 1234567890000,
    "startTime": 1234567800000
  },
  "daily": { "totalTokens": 1000, "tokensByModel": {}, "totalCost": 0, "costsByModel": {}, "date": "2024-01-15" },
  "total": { "totalTokens": 1000, "tokensByModel": {}, "totalCost": 0, "costsByModel": {} }
}
EOF
```
2. Click "Refresh Statistics"

**Expected Result**:
- Menu shows: "Session: 1.00K tokens" (no cost, since it's $0)

**Status**: ☐ Pass ☐ Fail

---

### Test 10: Budget Alert Reset

**Objective**: Verify alert flag resets when cost drops below threshold

**Steps**:
1. Set daily budget to $5.00, threshold to 80%
2. Update daily cost to $4.50 (trigger alert)
3. Refresh (alert should appear)
4. Update daily cost to $3.00 (below threshold)
5. Refresh again
6. Update daily cost to $4.50 again

**Expected Result**:
- Alert appears at step 3
- No alert at step 4
- Alert appears again at step 6 (alert flag was reset)

**Status**: ☐ Pass ☐ Fail

---

### Test 11: Large Cost Formatting

**Objective**: Verify large costs display correctly

**Steps**:
1. Update test data with large cost:
```bash
cat > ~/.local/share/opencode/stats.json << 'EOF'
{
  "session": {
    "totalTokens": 1000000,
    "tokensByModel": { "gpt-4": 1000000 },
    "totalCost": 150.50,
    "costsByModel": { "gpt-4": 150.50 },
    "lastActivity": 1234567890000,
    "startTime": 1234567800000
  },
  "daily": { "totalTokens": 1000000, "tokensByModel": {}, "totalCost": 150.50, "costsByModel": {}, "date": "2024-01-15" },
  "total": { "totalTokens": 1000000, "tokensByModel": {}, "totalCost": 150.50, "costsByModel": {} }
}
EOF
```
2. Click "Refresh Statistics"

**Expected Result**:
- Menu shows: "Session: 1.00M tokens ($150.50)"

**Status**: ☐ Pass ☐ Fail

---

### Test 12: Budget Preferences UI

**Objective**: Verify all budget settings are accessible

**Steps**:
1. Open preferences: `gnome-extensions prefs opencode-stats@fmatsos.github.com`
2. Locate "Budget Settings" section

**Expected Result**:
- Section should contain:
  - Daily Budget (USD) spin row (0-1000, step 1, 2 decimals)
  - Monthly Budget (USD) spin row (0-10000, step 10, 2 decimals)
  - Alert Threshold (%) spin row (50-100, step 5)
  - Show Costs in Menu switch

**Status**: ☐ Pass ☐ Fail

---

## OpenCode Plugin Testing

### Test 13: Plugin Cost Capture

**Objective**: Verify plugin captures message.cost field

**Prerequisites**: OpenCode installed with plugin

**Steps**:
1. Start OpenCode with debug logging:
```bash
DEBUG_GNOME_STATS=1 opencode
```
2. Send a message to an AI model
3. Check debug log:
```bash
tail -20 ~/.local/share/opencode/gnome-stats-exporter.log
```

**Expected Result**:
- Log should show: "Tracked tokens and cost for model" with cost value
- stats.json should have updated cost fields

**Status**: ☐ Pass ☐ Fail

---

### Test 14: Plugin Backward Compatibility

**Objective**: Verify plugin handles missing message.cost

**Steps**:
1. Simulate message without cost field (code inspection)
2. Verify `const cost = message.cost || 0;` line exists
3. Check that plugin doesn't crash with old OpenCode versions

**Expected Result**:
- Plugin defaults cost to 0 when message.cost is undefined
- No errors in debug log

**Status**: ☐ Pass ☐ Fail

---

## Real-time Updates Testing

### Test 15: Cost Updates with File Monitor

**Objective**: Verify costs update in real-time

**Steps**:
1. Ensure "File Monitoring" is enabled in preferences
2. Click terminal icon (leave menu open)
3. Manually edit ~/.local/share/opencode/stats.json
4. Change session.totalCost to a different value
5. Save file

**Expected Result**:
- Menu should update within 1-2 seconds
- New cost should appear in session line

**Status**: ☐ Pass ☐ Fail

---

## Logs and Debugging

### View Extension Logs

```bash
journalctl -f -o cat /usr/bin/gnome-shell | grep -i "opencode\|budget"
```

### View Plugin Debug Logs

```bash
tail -f ~/.local/share/opencode/gnome-stats-exporter.log
```

### Check Settings Values

```bash
gsettings list-recursively org.gnome.shell.extensions.opencode-stats | grep budget
```

## Test Summary

Total Tests: 15
- Manual UI Tests: 12
- Plugin Tests: 2
- Real-time Tests: 1

**Overall Status**: ☐ All Pass ☐ Some Failures

## Notes

- All tests should be run after extension reload (disable/enable)
- File monitor tests require GNOME Shell restart on Wayland
- Budget alert flag persists until cost drops below threshold
- Cost fields are always optional in stats file format
