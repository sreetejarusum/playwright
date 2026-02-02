import { test, expect } from '@playwright/test';
import { readSingleCell, readSingleRow, writeToCell } from '../../src/utils/excelUtils';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Excel Utils Unit Tests', () => {
    test.describe.configure({ mode: 'serial' });
    let testFilePath: string;

    test.beforeAll(async ({ }, testInfo) => {
        // Use a unique file name per worker/project to avoid race conditions
        const uniqueId = `${testInfo.project.name || 'default'}_${testInfo.workerIndex}`;
        testFilePath = path.join(__dirname, `test_data_${uniqueId}.xlsx`);
    });

    test.afterAll(async () => {
        if (testFilePath && fs.existsSync(testFilePath)) {
            try {
                fs.unlinkSync(testFilePath);
            } catch (err) {
                console.warn(`Failed to cleanup ${testFilePath}: ${err}`);
            }
        }
    });

    test('should write to a cell and read it back', async () => {
        const cellAddress = 'A1';
        const expectedData = 'Hello Excel';

        // Write data
        writeToCell(testFilePath, cellAddress, expectedData);

        // Read data back
        const actualData = readSingleCell(testFilePath, cellAddress);
        expect(actualData).toBe(expectedData);
    });

    test('should write multiple cells and read a single row', async () => {
        const rowData = ['Name', 'Age', 'Email'];

        // Write data to first row (A2, B2, C2)
        writeToCell(testFilePath, 'A2', rowData[0]);
        writeToCell(testFilePath, 'B2', rowData[1]);
        writeToCell(testFilePath, 'C2', rowData[2]);

        // Read the second row (index 1)
        const actualRow = readSingleRow(testFilePath, 1);
        expect(actualRow).toEqual(rowData);
    });

    test('should overwrite an existing cell', async () => {
        const cellAddress = 'A1';
        const newData = 'Updated Data';

        // Write new data to existing cell
        writeToCell(testFilePath, cellAddress, newData);

        // Read data back
        const actualData = readSingleCell(testFilePath, cellAddress);
        expect(actualData).toBe(newData);
    });

    test('should handle numeric and boolean data', async () => {
        writeToCell(testFilePath, 'B3', 100);
        writeToCell(testFilePath, 'C3', true);

        expect(readSingleCell(testFilePath, 'B3')).toBe(100);
        expect(readSingleCell(testFilePath, 'C3')).toBe(true);
    });

    test('should throw error for non-existent file when reading', async () => {
        const nonExistentPath = 'non_existent.xlsx';
        expect(() => readSingleCell(nonExistentPath, 'A1')).toThrow();
    });
});
