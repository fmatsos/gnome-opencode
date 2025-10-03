// Unit tests for token and cost formatting functions
import { describe, it, expect } from '@jest/globals';
import { formatTokens, formatCost } from '../../helpers/test-utils.js';

describe('Token Formatting', () => {
    it('should format small token counts as plain numbers', () => {
        expect(formatTokens(0)).toBe('0');
        expect(formatTokens(50)).toBe('50');
        expect(formatTokens(500)).toBe('500');
        expect(formatTokens(999)).toBe('999');
    });

    it('should format thousands with K suffix', () => {
        expect(formatTokens(1000)).toBe('1.00K');
        expect(formatTokens(1500)).toBe('1.50K');
        expect(formatTokens(15234)).toBe('15.23K');
        expect(formatTokens(999999)).toBe('1000.00K');
    });

    it('should format millions with M suffix', () => {
        expect(formatTokens(1000000)).toBe('1.00M');
        expect(formatTokens(1234567)).toBe('1.23M');
        expect(formatTokens(5000000)).toBe('5.00M');
        expect(formatTokens(10500000)).toBe('10.50M');
    });

    it('should round to 2 decimal places', () => {
        expect(formatTokens(1234)).toBe('1.23K');
        expect(formatTokens(1239)).toBe('1.24K');
        expect(formatTokens(1235678)).toBe('1.24M');
    });
});

describe('Cost Formatting', () => {
    it('should return empty string for zero cost', () => {
        expect(formatCost(0)).toBe('');
    });

    it('should format costs under $0.01 in cents', () => {
        expect(formatCost(0.001)).toBe(' ($0.10¢)');
        expect(formatCost(0.0075)).toBe(' ($0.75¢)');
        expect(formatCost(0.009)).toBe(' ($0.90¢)');
        expect(formatCost(0.0099)).toBe(' ($0.99¢)');
    });

    it('should format costs $0.01 and above in dollars', () => {
        expect(formatCost(0.01)).toBe(' ($0.01)');
        expect(formatCost(0.45)).toBe(' ($0.45)');
        expect(formatCost(1.00)).toBe(' ($1.00)');
        expect(formatCost(4.50)).toBe(' ($4.50)');
        expect(formatCost(35.42)).toBe(' ($35.42)');
        expect(formatCost(150.50)).toBe(' ($150.50)');
    });

    it('should round to 2 decimal places for dollars', () => {
        expect(formatCost(0.456)).toBe(' ($0.46)');
        expect(formatCost(0.454)).toBe(' ($0.45)');
        expect(formatCost(35.426)).toBe(' ($35.43)');
    });

    it('should round to 2 decimal places for cents', () => {
        expect(formatCost(0.00456)).toBe(' ($0.46¢)');
        expect(formatCost(0.00999)).toBe(' ($1.00¢)');
    });
});

describe('Combined Token and Cost Formatting', () => {
    it('should format tokens with no cost', () => {
        const tokenStr = formatTokens(15234);
        const costStr = formatCost(0);
        expect(`${tokenStr} tokens${costStr}`).toBe('15.23K tokens');
    });

    it('should format tokens with dollar cost', () => {
        const tokenStr = formatTokens(15234);
        const costStr = formatCost(0.45);
        expect(`${tokenStr} tokens${costStr}`).toBe('15.23K tokens ($0.45)');
    });

    it('should format tokens with cent cost', () => {
        const tokenStr = formatTokens(500);
        const costStr = formatCost(0.0075);
        expect(`${tokenStr} tokens${costStr}`).toBe('500 tokens ($0.75¢)');
    });

    it('should format large tokens with high cost', () => {
        const tokenStr = formatTokens(5000000);
        const costStr = formatCost(150.50);
        expect(`${tokenStr} tokens${costStr}`).toBe('5.00M tokens ($150.50)');
    });
});
