// Test utilities for GNOME OpenCode Extension tests
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Load a fixture file from the fixtures directory
 * @param {string} filename - Name of the fixture file
 * @returns {object} Parsed JSON content of the fixture
 */
export function loadFixture(filename) {
    const fixturePath = join(__dirname, '..', 'fixtures', filename);
    const content = readFileSync(fixturePath, 'utf-8');
    return JSON.parse(content);
}

/**
 * Format tokens for display (mimics extension.js logic)
 * @param {number} tokens - Number of tokens
 * @returns {string} Formatted token string
 */
export function formatTokens(tokens) {
    if (tokens >= 1000000) {
        return (tokens / 1000000).toFixed(2) + 'M';
    } else if (tokens >= 1000) {
        return (tokens / 1000).toFixed(2) + 'K';
    }
    return tokens.toString();
}

/**
 * Format cost for display (mimics extension.js logic)
 * @param {number} cost - Cost in dollars
 * @returns {string} Formatted cost string
 */
export function formatCost(cost) {
    if (cost === 0) {
        return '';
    }
    if (cost < 0.01) {
        return ` ($${(cost * 100).toFixed(2)}¢)`;
    }
    return ` ($${cost.toFixed(2)})`;
}

/**
 * Get today's date string in YYYY-MM-DD format
 * @returns {string} Date string
 */
export function getTodayString() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

/**
 * Create default statistics structure
 * @returns {object} Default statistics object
 */
export function getDefaultData() {
    return {
        session: {
            tokens: 0,
            models: {},
            cost: 0,
            costModels: {},
            lastActivity: null,
            startTime: Date.now()
        },
        daily: {
            tokens: 0,
            models: {},
            cost: 0,
            costModels: {},
            date: getTodayString()
        },
        total: {
            tokens: 0,
            models: {},
            cost: 0,
            costModels: {},
            installDate: Date.now()
        }
    };
}

/**
 * Calculate idle minutes from last activity
 * @param {number} lastActivity - Timestamp of last activity
 * @param {number} currentTime - Current timestamp (defaults to now)
 * @returns {number} Minutes idle
 */
export function calculateIdleMinutes(lastActivity, currentTime = Date.now()) {
    return Math.floor((currentTime - lastActivity) / (60 * 1000));
}

/**
 * Check if daily stats should reset
 * @param {string} dailyDate - Date from daily stats
 * @param {string} currentDate - Current date (defaults to today)
 * @returns {boolean} True if reset needed
 */
export function shouldResetDaily(dailyDate, currentDate = getTodayString()) {
    return dailyDate !== currentDate;
}
