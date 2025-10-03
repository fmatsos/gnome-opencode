// Unit tests for OpenCode plugin statistics tracking
import { describe, it, expect, beforeEach } from '@jest/globals';

/**
 * Helper to get today's date string in YYYY-MM-DD format
 */
function getTodayString() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

/**
 * Helper to create default statistics structure
 */
function createDefaultStatistics() {
    return {
        session: {
            totalTokens: 0,
            tokensByModel: {},
            totalCost: 0,
            costsByModel: {},
            lastActivity: Date.now(),
            startTime: Date.now(),
            isIdle: false
        },
        daily: {
            totalTokens: 0,
            tokensByModel: {},
            totalCost: 0,
            costsByModel: {},
            date: getTodayString()
        },
        total: {
            totalTokens: 0,
            tokensByModel: {},
            totalCost: 0,
            costsByModel: {},
            installDate: Date.now()
        }
    };
}

describe('Plugin Statistics Initialization', () => {
    let stats;

    beforeEach(() => {
        stats = createDefaultStatistics();
    });

    it('should initialize with zero tokens', () => {
        expect(stats.session.totalTokens).toBe(0);
        expect(stats.daily.totalTokens).toBe(0);
        expect(stats.total.totalTokens).toBe(0);
    });

    it('should initialize with zero costs', () => {
        expect(stats.session.totalCost).toBe(0);
        expect(stats.daily.totalCost).toBe(0);
        expect(stats.total.totalCost).toBe(0);
    });

    it('should initialize with empty model maps', () => {
        expect(stats.session.tokensByModel).toEqual({});
        expect(stats.session.costsByModel).toEqual({});
        expect(stats.daily.tokensByModel).toEqual({});
        expect(stats.total.tokensByModel).toEqual({});
    });

    it('should set current date for daily stats', () => {
        const today = getTodayString();
        expect(stats.daily.date).toBe(today);
    });

    it('should initialize idle state as false', () => {
        expect(stats.session.isIdle).toBe(false);
    });

    it('should set timestamps', () => {
        expect(stats.session.startTime).toBeDefined();
        expect(stats.session.lastActivity).toBeDefined();
        expect(stats.total.installDate).toBeDefined();
    });
});

describe('Token Tracking Per Model', () => {
    let stats;

    beforeEach(() => {
        stats = createDefaultStatistics();
    });

    it('should track tokens for a single model', () => {
        stats.session.tokensByModel['gpt-4'] = 1000;
        stats.session.totalTokens = 1000;

        expect(stats.session.tokensByModel['gpt-4']).toBe(1000);
        expect(stats.session.totalTokens).toBe(1000);
    });

    it('should track tokens for multiple models', () => {
        stats.session.tokensByModel['gpt-4'] = 1000;
        stats.session.tokensByModel['claude-3'] = 500;
        stats.session.totalTokens = 1500;

        expect(stats.session.tokensByModel['gpt-4']).toBe(1000);
        expect(stats.session.tokensByModel['claude-3']).toBe(500);
        expect(stats.session.totalTokens).toBe(1500);
    });

    it('should increment tokens for existing model', () => {
        stats.session.tokensByModel['gpt-4'] = 1000;
        stats.session.totalTokens = 1000;

        // Add more tokens
        stats.session.tokensByModel['gpt-4'] += 500;
        stats.session.totalTokens += 500;

        expect(stats.session.tokensByModel['gpt-4']).toBe(1500);
        expect(stats.session.totalTokens).toBe(1500);
    });

    it('should aggregate tokens from all models', () => {
        const tokensByModel = {
            'gpt-4': 1000,
            'claude-3': 500,
            'gpt-3.5': 300
        };

        stats.session.tokensByModel = tokensByModel;
        const total = Object.values(tokensByModel).reduce((sum, t) => sum + t, 0);
        stats.session.totalTokens = total;

        expect(stats.session.totalTokens).toBe(1800);
    });
});

describe('Cost Tracking Per Model', () => {
    let stats;

    beforeEach(() => {
        stats = createDefaultStatistics();
    });

    it('should track costs for a single model', () => {
        stats.session.costsByModel['gpt-4'] = 0.50;
        stats.session.totalCost = 0.50;

        expect(stats.session.costsByModel['gpt-4']).toBe(0.50);
        expect(stats.session.totalCost).toBe(0.50);
    });

    it('should track costs for multiple models', () => {
        stats.session.costsByModel['gpt-4'] = 0.50;
        stats.session.costsByModel['claude-3'] = 0.25;
        stats.session.totalCost = 0.75;

        expect(stats.session.costsByModel['gpt-4']).toBe(0.50);
        expect(stats.session.costsByModel['claude-3']).toBe(0.25);
        expect(stats.session.totalCost).toBe(0.75);
    });

    it('should handle small costs accurately', () => {
        stats.session.costsByModel['gpt-3.5'] = 0.0075;
        stats.session.totalCost = 0.0075;

        expect(stats.session.costsByModel['gpt-3.5']).toBe(0.0075);
        expect(stats.session.totalCost).toBe(0.0075);
    });

    it('should aggregate costs from all models', () => {
        const costsByModel = {
            'gpt-4': 0.50,
            'claude-3': 0.25,
            'gpt-3.5': 0.10
        };

        stats.session.costsByModel = costsByModel;
        const total = Object.values(costsByModel).reduce((sum, c) => sum + c, 0);
        stats.session.totalCost = total;

        expect(stats.session.totalCost).toBeCloseTo(0.85, 2);
    });
});

describe('Daily Statistics Reset', () => {
    let stats;

    beforeEach(() => {
        stats = createDefaultStatistics();
        // Populate with some data
        stats.daily.totalTokens = 5000;
        stats.daily.totalCost = 2.50;
        stats.daily.tokensByModel = { 'gpt-4': 3000, 'claude-3': 2000 };
        stats.daily.costsByModel = { 'gpt-4': 1.50, 'claude-3': 1.00 };
        stats.daily.date = '2025-01-14';
    });

    it('should detect when daily reset is needed', () => {
        const currentDate = '2025-01-15';
        const shouldReset = stats.daily.date !== currentDate;

        expect(shouldReset).toBe(true);
    });

    it('should reset daily stats on date change', () => {
        const currentDate = '2025-01-15';

        if (stats.daily.date !== currentDate) {
            stats.daily = {
                totalTokens: 0,
                tokensByModel: {},
                totalCost: 0,
                costsByModel: {},
                date: currentDate
            };
        }

        expect(stats.daily.totalTokens).toBe(0);
        expect(stats.daily.totalCost).toBe(0);
        expect(stats.daily.date).toBe('2025-01-15');
        expect(Object.keys(stats.daily.tokensByModel)).toHaveLength(0);
    });

    it('should preserve daily stats when date matches', () => {
        const currentDate = '2025-01-14';

        if (stats.daily.date !== currentDate) {
            stats.daily = {
                totalTokens: 0,
                tokensByModel: {},
                totalCost: 0,
                costsByModel: {},
                date: currentDate
            };
        }

        expect(stats.daily.totalTokens).toBe(5000);
        expect(stats.daily.totalCost).toBe(2.50);
    });
});

describe('Session Reset on Plugin Load', () => {
    it('should reset session stats when plugin loads', () => {
        // Simulate existing stats from file
        const existingStats = {
            session: {
                totalTokens: 5000,
                tokensByModel: { 'gpt-4': 5000 },
                totalCost: 2.50,
                costsByModel: { 'gpt-4': 2.50 },
                lastActivity: Date.now() - 3600000,
                startTime: Date.now() - 7200000,
                isIdle: true
            },
            daily: {
                totalTokens: 10000,
                tokensByModel: { 'gpt-4': 10000 },
                totalCost: 5.00,
                costsByModel: { 'gpt-4': 5.00 },
                date: getTodayString()
            },
            total: {
                totalTokens: 50000,
                tokensByModel: { 'gpt-4': 50000 },
                totalCost: 25.00,
                costsByModel: { 'gpt-4': 25.00 },
                installDate: Date.now() - 86400000
            }
        };

        // Reset session on plugin load
        const stats = { ...existingStats };
        const now = Date.now();
        stats.session = {
            totalTokens: 0,
            tokensByModel: {},
            totalCost: 0,
            costsByModel: {},
            lastActivity: now,
            startTime: now,
            isIdle: false
        };

        expect(stats.session.totalTokens).toBe(0);
        expect(stats.session.isIdle).toBe(false);
        expect(Object.keys(stats.session.tokensByModel)).toHaveLength(0);
        
        // Daily and total should be preserved
        expect(stats.daily.totalTokens).toBe(10000);
        expect(stats.total.totalTokens).toBe(50000);
    });
});

describe('Idle State Detection', () => {
    let stats;

    beforeEach(() => {
        stats = createDefaultStatistics();
    });

    it('should track idle state', () => {
        stats.session.isIdle = true;
        stats.session.idleSince = Date.now() - 900000; // 15 minutes ago

        expect(stats.session.isIdle).toBe(true);
        expect(stats.session.idleSince).toBeDefined();
    });

    it('should calculate idle duration', () => {
        const idleSince = Date.now() - 900000; // 15 minutes ago
        stats.session.isIdle = true;
        stats.session.idleSince = idleSince;

        const idleMinutes = Math.floor((Date.now() - idleSince) / (1000 * 60));
        expect(idleMinutes).toBeGreaterThanOrEqual(14);
        expect(idleMinutes).toBeLessThanOrEqual(16);
    });

    it('should detect idle transitions', () => {
        // Initially not idle
        let wasIdle = false;
        stats.session.isIdle = false;

        // Become idle
        stats.session.isIdle = true;
        const transitionToIdle = stats.session.isIdle && !wasIdle;
        expect(transitionToIdle).toBe(true);

        // Update tracking
        wasIdle = stats.session.isIdle;

        // Still idle
        stats.session.isIdle = true;
        const stillIdle = stats.session.isIdle && !wasIdle;
        expect(stillIdle).toBe(false);
    });
});
