// Unit tests for idle detection logic
import { describe, it, expect } from '@jest/globals';
import { calculateIdleMinutes } from '../../helpers/test-utils.js';

describe('Idle Time Calculation', () => {
    const MINUTE_MS = 60 * 1000;

    it('should calculate idle minutes correctly', () => {
        const lastActivity = Date.now() - (15 * MINUTE_MS);
        const idleMinutes = calculateIdleMinutes(lastActivity);
        
        expect(idleMinutes).toBeGreaterThanOrEqual(14);
        expect(idleMinutes).toBeLessThanOrEqual(16);
    });

    it('should calculate zero minutes for current activity', () => {
        const lastActivity = Date.now();
        const idleMinutes = calculateIdleMinutes(lastActivity);
        
        expect(idleMinutes).toBe(0);
    });

    it('should calculate idle minutes with specific timestamps', () => {
        const lastActivity = new Date('2025-01-15T10:00:00').getTime();
        const currentTime = new Date('2025-01-15T10:16:00').getTime();
        const idleMinutes = calculateIdleMinutes(lastActivity, currentTime);
        
        expect(idleMinutes).toBe(16);
    });

    it('should handle very long idle periods', () => {
        const lastActivity = Date.now() - (60 * MINUTE_MS); // 1 hour ago
        const idleMinutes = calculateIdleMinutes(lastActivity);
        
        expect(idleMinutes).toBeGreaterThanOrEqual(59);
        expect(idleMinutes).toBeLessThanOrEqual(61);
    });

    it('should floor partial minutes', () => {
        const lastActivity = Date.now() - (5.9 * MINUTE_MS);
        const idleMinutes = calculateIdleMinutes(lastActivity);
        
        expect(idleMinutes).toBe(5);
    });
});

describe('Idle Detection with Threshold', () => {
    const IDLE_THRESHOLD_MINUTES = 15;
    const MINUTE_MS = 60 * 1000;

    it('should detect idle when threshold exceeded', () => {
        const lastActivity = Date.now() - (16 * MINUTE_MS);
        const idleMinutes = calculateIdleMinutes(lastActivity);
        const isIdle = idleMinutes >= IDLE_THRESHOLD_MINUTES;
        
        expect(isIdle).toBe(true);
    });

    it('should not detect idle when below threshold', () => {
        const lastActivity = Date.now() - (14 * MINUTE_MS);
        const idleMinutes = calculateIdleMinutes(lastActivity);
        const isIdle = idleMinutes >= IDLE_THRESHOLD_MINUTES;
        
        expect(isIdle).toBe(false);
    });

    it('should detect idle exactly at threshold', () => {
        const lastActivity = Date.now() - (15 * MINUTE_MS);
        const idleMinutes = calculateIdleMinutes(lastActivity);
        const isIdle = idleMinutes >= IDLE_THRESHOLD_MINUTES;
        
        expect(isIdle).toBe(true);
    });

    it('should not detect idle for active sessions', () => {
        const lastActivity = Date.now() - (1 * MINUTE_MS);
        const idleMinutes = calculateIdleMinutes(lastActivity);
        const isIdle = idleMinutes >= IDLE_THRESHOLD_MINUTES;
        
        expect(isIdle).toBe(false);
    });
});

describe('Idle Detection with Token Activity', () => {
    it('should only notify if tokens were used', () => {
        const sessionWithTokens = { totalTokens: 1000, lastActivity: Date.now() - (20 * 60 * 1000) };
        const sessionWithoutTokens = { totalTokens: 0, lastActivity: Date.now() - (20 * 60 * 1000) };
        
        const idleMinutes1 = calculateIdleMinutes(sessionWithTokens.lastActivity);
        const idleMinutes2 = calculateIdleMinutes(sessionWithoutTokens.lastActivity);
        
        const shouldNotify1 = idleMinutes1 >= 15 && sessionWithTokens.totalTokens > 0;
        const shouldNotify2 = idleMinutes2 >= 15 && sessionWithoutTokens.totalTokens > 0;
        
        expect(shouldNotify1).toBe(true);
        expect(shouldNotify2).toBe(false);
    });
});
