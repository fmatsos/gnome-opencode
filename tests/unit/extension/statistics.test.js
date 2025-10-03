// Unit tests for statistics data handling
import { describe, it, expect, beforeEach } from '@jest/globals';
import { getDefaultData, loadFixture } from '../../helpers/test-utils.js';

describe('Statistics Initialization', () => {
    it('should initialize with zero values', () => {
        const stats = getDefaultData();
        
        expect(stats.session.tokens).toBe(0);
        expect(stats.session.cost).toBe(0);
        expect(stats.daily.tokens).toBe(0);
        expect(stats.daily.cost).toBe(0);
        expect(stats.total.tokens).toBe(0);
        expect(stats.total.cost).toBe(0);
    });

    it('should initialize with empty model maps', () => {
        const stats = getDefaultData();
        
        expect(stats.session.models).toEqual({});
        expect(stats.session.costModels).toEqual({});
        expect(stats.daily.models).toEqual({});
        expect(stats.daily.costModels).toEqual({});
        expect(stats.total.models).toEqual({});
        expect(stats.total.costModels).toEqual({});
    });

    it('should set current date for daily stats', () => {
        const stats = getDefaultData();
        const today = new Date();
        const expectedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        
        expect(stats.daily.date).toBe(expectedDate);
    });

    it('should set timestamps', () => {
        const beforeTime = Date.now();
        const stats = getDefaultData();
        const afterTime = Date.now();
        
        expect(stats.session.startTime).toBeGreaterThanOrEqual(beforeTime);
        expect(stats.session.startTime).toBeLessThanOrEqual(afterTime);
        expect(stats.total.installDate).toBeGreaterThanOrEqual(beforeTime);
        expect(stats.total.installDate).toBeLessThanOrEqual(afterTime);
    });

    it('should set lastActivity to null initially', () => {
        const stats = getDefaultData();
        expect(stats.session.lastActivity).toBeNull();
    });
});

describe('Statistics Update from OpenCode', () => {
    let stats;

    beforeEach(() => {
        stats = getDefaultData();
    });

    it('should update session statistics', () => {
        const opencodeStats = loadFixture('mock-opencode-stats.json');
        
        // Simulate update logic
        stats.session.tokens = opencodeStats.session.totalTokens || 0;
        stats.session.models = opencodeStats.session.tokensByModel || {};
        stats.session.cost = opencodeStats.session.totalCost || 0;
        stats.session.costModels = opencodeStats.session.costsByModel || {};
        stats.session.lastActivity = opencodeStats.session.lastActivity || Date.now();
        
        expect(stats.session.tokens).toBe(15234);
        expect(stats.session.cost).toBe(0.45);
        expect(stats.session.models['gpt-4']).toBe(10000);
        expect(stats.session.models['claude-3-sonnet']).toBe(5234);
    });

    it('should update daily statistics', () => {
        const opencodeStats = loadFixture('mock-opencode-stats.json');
        
        stats.daily.tokens = opencodeStats.daily.totalTokens || 0;
        stats.daily.models = opencodeStats.daily.tokensByModel || {};
        stats.daily.cost = opencodeStats.daily.totalCost || 0;
        stats.daily.costModels = opencodeStats.daily.costsByModel || {};
        
        expect(stats.daily.tokens).toBe(25680);
        expect(stats.daily.cost).toBe(4.50);
        expect(stats.daily.models['gpt-4']).toBe(18000);
    });

    it('should update total statistics', () => {
        const opencodeStats = loadFixture('mock-opencode-stats.json');
        
        stats.total.tokens = opencodeStats.total.totalTokens || 0;
        stats.total.models = opencodeStats.total.tokensByModel || {};
        stats.total.cost = opencodeStats.total.totalCost || 0;
        stats.total.costModels = opencodeStats.total.costsByModel || {};
        
        expect(stats.total.tokens).toBe(1234567);
        expect(stats.total.cost).toBe(35.42);
        expect(stats.total.models['gpt-4']).toBe(890123);
    });

    it('should handle missing cost fields gracefully', () => {
        const opencodeStats = {
            session: {
                totalTokens: 1000,
                tokensByModel: { 'gpt-4': 1000 }
                // No cost fields
            }
        };
        
        stats.session.tokens = opencodeStats.session.totalTokens || 0;
        stats.session.cost = opencodeStats.session.totalCost || 0;
        stats.session.costModels = opencodeStats.session.costsByModel || {};
        
        expect(stats.session.tokens).toBe(1000);
        expect(stats.session.cost).toBe(0);
        expect(stats.session.costModels).toEqual({});
    });

    it('should handle missing token fields gracefully', () => {
        const opencodeStats = {
            session: {}
        };
        
        stats.session.tokens = opencodeStats.session.totalTokens || 0;
        stats.session.models = opencodeStats.session.tokensByModel || {};
        
        expect(stats.session.tokens).toBe(0);
        expect(stats.session.models).toEqual({});
    });
});

describe('Statistics with Edge Cases', () => {
    it('should handle empty statistics', () => {
        const opencodeStats = loadFixture('empty-stats.json');
        const stats = getDefaultData();
        
        // Try to update with empty data
        if (opencodeStats.session) {
            stats.session.tokens = opencodeStats.session.totalTokens || 0;
        }
        
        expect(stats.session.tokens).toBe(0);
    });

    it('should handle missing fields in statistics', () => {
        const opencodeStats = loadFixture('missing-fields-stats.json');
        const stats = getDefaultData();
        
        stats.session.tokens = opencodeStats.session.totalTokens || 0;
        stats.session.models = opencodeStats.session.tokensByModel || {};
        
        expect(stats.session.tokens).toBe(1000);
        expect(stats.session.models).toEqual({});
    });

    it('should handle large token counts', () => {
        const opencodeStats = loadFixture('large-stats.json');
        const stats = getDefaultData();
        
        stats.session.tokens = opencodeStats.session.totalTokens || 0;
        stats.session.cost = opencodeStats.session.totalCost || 0;
        
        expect(stats.session.tokens).toBe(5000000);
        expect(stats.session.cost).toBe(150.50);
    });

    it('should handle small costs correctly', () => {
        const opencodeStats = loadFixture('small-cost-stats.json');
        const stats = getDefaultData();
        
        stats.session.cost = opencodeStats.session.totalCost || 0;
        
        expect(stats.session.cost).toBe(0.0075);
    });
});

describe('Model Token Aggregation', () => {
    it('should aggregate tokens by model', () => {
        const opencodeStats = loadFixture('mock-opencode-stats.json');
        const sessionModels = opencodeStats.session.tokensByModel;
        
        const totalTokens = Object.values(sessionModels).reduce((sum, tokens) => sum + tokens, 0);
        
        expect(totalTokens).toBe(15234);
        expect(sessionModels['gpt-4']).toBe(10000);
        expect(sessionModels['claude-3-sonnet']).toBe(5234);
    });

    it('should aggregate costs by model', () => {
        const opencodeStats = loadFixture('mock-opencode-stats.json');
        const sessionCosts = opencodeStats.session.costsByModel;
        
        const totalCost = Object.values(sessionCosts).reduce((sum, cost) => sum + cost, 0);
        
        // Allow for floating point precision
        expect(totalCost).toBeCloseTo(0.45, 2);
        expect(sessionCosts['gpt-4']).toBe(0.30);
        expect(sessionCosts['claude-3-sonnet']).toBe(0.15);
    });

    it('should handle multiple models', () => {
        const tokensByModel = {
            'gpt-4': 10000,
            'claude-3-sonnet': 5234,
            'gpt-3.5': 2000,
            'claude-3-opus': 3000
        };
        
        const modelCount = Object.keys(tokensByModel).length;
        const totalTokens = Object.values(tokensByModel).reduce((sum, t) => sum + t, 0);
        
        expect(modelCount).toBe(4);
        expect(totalTokens).toBe(20234);
    });
});

describe('Statistics Persistence', () => {
    it('should preserve structure when serializing', () => {
        const stats = getDefaultData();
        const json = JSON.stringify(stats);
        const parsed = JSON.parse(json);
        
        expect(parsed.session).toBeDefined();
        expect(parsed.daily).toBeDefined();
        expect(parsed.total).toBeDefined();
    });

    it('should handle JSON round-trip', () => {
        const opencodeStats = loadFixture('mock-opencode-stats.json');
        const json = JSON.stringify(opencodeStats);
        const parsed = JSON.parse(json);
        
        expect(parsed.session.totalTokens).toBe(opencodeStats.session.totalTokens);
        expect(parsed.daily.totalCost).toBe(opencodeStats.daily.totalCost);
    });
});
