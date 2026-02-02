import { test, expect } from '@playwright/test';
import { DateUtils } from '../../src/utils/DateUtils';

test.describe('DateUtils Unit Tests', () => {

    test('getCurrentDate - should return current date in default format', async () => {
        const currentDate = DateUtils.getCurrentDate();
        expect(currentDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test('getFutureDate - should return date in the future', async () => {
        const futureDate = DateUtils.getFutureDate(5);
        const today = new Date();
        const expectedDate = new Date();
        expectedDate.setDate(today.getDate() + 5);
        const expectedStr = DateUtils.formatDate(expectedDate, 'YYYY-MM-DD');
        expect(futureDate).toBe(expectedStr);
    });

    test('getPastDate - should return date in the past', async () => {
        const pastDate = DateUtils.getPastDate(10);
        const today = new Date();
        const expectedDate = new Date();
        expectedDate.setDate(today.getDate() - 10);
        const expectedStr = DateUtils.formatDate(expectedDate, 'YYYY-MM-DD');
        expect(pastDate).toBe(expectedStr);
    });

    test('formatDate - should format date correctly with different tokens', async () => {
        const date = new Date(2023, 0, 1, 13, 30, 0); // Jan 1, 2023, 13:30:00
        expect(DateUtils.formatDate(date, 'YYYY/MM/DD')).toBe('2023/01/01');
        expect(DateUtils.formatDate(date, 'DD-MM-YYYY HH:mm:ss')).toBe('01-01-2023 13:30:00');
    });

    test('getDaysDifference - should calculate difference between two dates', async () => {
        const d1 = new Date(2023, 0, 1);
        const d2 = new Date(2023, 0, 6);
        expect(DateUtils.getDaysDifference(d1, d2)).toBe(5);
    });

    test('getFirstDayOfMonth - should return first day', async () => {
        const date = new Date(2023, 5, 15); // June 15
        const firstDay = DateUtils.getFirstDayOfMonth(date);
        expect(firstDay.getDate()).toBe(1);
        expect(firstDay.getMonth()).toBe(5);
        expect(firstDay.getFullYear()).toBe(2023);
    });

    test('getLastDayOfMonth - should return last day', async () => {
        const date = new Date(2023, 1, 10); // Feb 10
        const lastDay = DateUtils.getLastDayOfMonth(date);
        expect(lastDay.getDate()).toBe(28); // 2023 wasn't leap year

        const leapDate = new Date(2024, 1, 10); // Feb 10 2024
        const lastDayLeap = DateUtils.getLastDayOfMonth(leapDate);
        expect(lastDayLeap.getDate()).toBe(29);
    });

    test('getFileSafeTimestamp - should return valid format', async () => {
        const ts = DateUtils.getFileSafeTimestamp();
        expect(ts).toMatch(/^\d{8}_\d{6}$/);
    });
});
