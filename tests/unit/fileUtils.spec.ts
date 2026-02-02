import { test, expect } from '@playwright/test';
import { readJson } from '../../src/utils/fileUtils';
import fs from 'fs/promises';
import path from 'path';

test.describe('fileUtils', () => {
    const tempDir = path.join(__dirname, 'temp');
    const tempFile = path.join(tempDir, 'test.json');

    test.beforeAll(async () => {
        await fs.mkdir(tempDir, { recursive: true });
    });

    test.afterAll(async () => {
        await fs.rm(tempDir, { recursive: true, force: true });
    });

    test('readJson should read and parse a JSON file correctly', async () => {
        const testData = { key: 'value', number: 123, boolean: true };
        await fs.writeFile(tempFile, JSON.stringify(testData));

        const result = await readJson(tempFile);
        expect(result).toEqual(testData);
    });

    test('readJson should throw error for non-existent file', async () => {
        const nonExistentFile = path.join(tempDir, 'non-existent.json');
        await expect(readJson(nonExistentFile)).rejects.toThrow();
    });
});
