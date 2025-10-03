// Unit tests for date handling and daily reset logic
import { describe, it, expect, beforeEach } from '@jest/globals';
import { getTodayString, shouldResetDaily } from '../../helpers/test-utils.js';

describe('Date String Formatting', () => {
    it('should format date as YYYY-MM-DD', () => {
        const dateStr = getTodayString();
        expect(dateStr).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should pad single-digit months and days with zeros', () => {
        // Test with a specific date
        const testDate = new Date('2025-01-05');
        const year = testDate.getFullYear();
        const month = String(testDate.getMonth() + 1).padStart(2, '0');
        const day = String(testDate.getDate()).padStart(2, '0');
        const formatted = `${year}-${month}-${day}`;
        
        expect(formatted).toBe('2025-01-05');
        expect(month).toBe('01');
        expect(day).toBe('05');
    });

    it('should handle different months correctly', () => {
        const dates = [
            { date: new Date('2025-01-15'), expected: '2025-01-15' },
            { date: new Date('2025-12-31'), expected: '2025-12-31' },
            { date: new Date('2025-06-01'), expected: '2025-06-01' }
        ];

        dates.forEach(({ date, expected }) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const formatted = `${year}-${month}-${day}`;
            expect(formatted).toBe(expected);
        });
    });
});

describe('Daily Reset Logic', () => {
    it('should detect when daily reset is needed', () => {
        expect(shouldResetDaily('2025-01-14', '2025-01-15')).toBe(true);
        expect(shouldResetDaily('2024-12-31', '2025-01-01')).toBe(true);
        expect(shouldResetDaily('2025-01-01', '2025-01-02')).toBe(true);
    });

    it('should detect when daily reset is not needed', () => {
        expect(shouldResetDaily('2025-01-15', '2025-01-15')).toBe(false);
        expect(shouldResetDaily('2025-12-31', '2025-12-31')).toBe(false);
    });

    it('should use current date by default', () => {
        const today = getTodayString();
        expect(shouldResetDaily(today)).toBe(false);
        
        const yesterday = '2024-01-01'; // Definitely not today
        expect(shouldResetDaily(yesterday)).toBe(true);
    });

    it('should handle month transitions', () => {
        expect(shouldResetDaily('2025-01-31', '2025-02-01')).toBe(true);
        expect(shouldResetDaily('2025-02-28', '2025-03-01')).toBe(true);
    });

    it('should handle year transitions', () => {
        expect(shouldResetDaily('2024-12-31', '2025-01-01')).toBe(true);
        expect(shouldResetDaily('2025-12-31', '2026-01-01')).toBe(true);
    });
});

describe('Daily Stats Reset Scenario', () => {
    let stats;

    beforeEach(() => {
        stats = {
            daily: {
                tokens: 5000,
                models: { 'gpt-4': 3000, 'claude-3': 2000 },
                cost: 2.50,
                costModels: { 'gpt-4': 1.50, 'claude-3': 1.00 },
                date: '2025-01-14'
            }
        };
    });

    it('should reset daily stats when date changes', () => {
        const currentDate = '2025-01-15';
        
        if (shouldResetDaily(stats.daily.date, currentDate)) {
            stats.daily = {
                tokens: 0,
                models: {},
                cost: 0,
                costModels: {},
                date: currentDate
            };
        }

        expect(stats.daily.tokens).toBe(0);
        expect(stats.daily.cost).toBe(0);
        expect(stats.daily.date).toBe('2025-01-15');
        expect(Object.keys(stats.daily.models)).toHaveLength(0);
    });

    it('should preserve daily stats when date matches', () => {
        const currentDate = '2025-01-14';
        
        if (shouldResetDaily(stats.daily.date, currentDate)) {
            stats.daily = {
                tokens: 0,
                models: {},
                cost: 0,
                costModels: {},
                date: currentDate
            };
        }

        expect(stats.daily.tokens).toBe(5000);
        expect(stats.daily.cost).toBe(2.50);
        expect(stats.daily.date).toBe('2025-01-14');
        expect(stats.daily.models).toEqual({ 'gpt-4': 3000, 'claude-3': 2000 });
    });
});
