import * as xlsx from 'xlsx';

export function readExcel(filePath: string, sheetName?: string) {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheet = sheetName || workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheet];
    return xlsx.utils.sheet_to_json(worksheet, { defval: '' });
  } catch (error: any) {
    throw new Error(`Failed to read Excel file ${filePath}: ${error.message}`);
  }
}

/**
 * Reads a single cell value from an Excel file.
 * @param filePath Path to the Excel file.
 * @param cellAddress Cell address (e.g., 'A1').
 * @param sheetName Optional sheet name. Defaults to the first sheet.
 * @returns The cell value.
 */
export function readSingleCell(filePath: string, cellAddress: string, sheetName?: string): any {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheet = sheetName || workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheet];
    const cell = worksheet[cellAddress];
    return cell ? cell.v : undefined;
  } catch (error: any) {
    throw new Error(`Failed to read cell ${cellAddress} from ${filePath}: ${error.message}`);
  }
}

/**
 * Reads a single row from an Excel file.
 * @param filePath Path to the Excel file.
 * @param rowIndex Zero-based row index.
 * @param sheetName Optional sheet name. Defaults to the first sheet.
 * @returns Array of values in the row.
 */
export function readSingleRow(filePath: string, rowIndex: number, sheetName?: string): any[] {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheet = sheetName || workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheet];
    const jsonData: any[][] = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
    return jsonData[rowIndex] || [];
  } catch (error: any) {
    throw new Error(`Failed to read row ${rowIndex} from ${filePath}: ${error.message}`);
  }
}

/**
 * Writes data to a specific cell in an Excel file.
 * @param filePath Path to the Excel file.
 * @param cellAddress Cell address (e.g., 'A1').
 * @param data Data to write.
 * @param sheetName Optional sheet name. Defaults to the first sheet.
 */
export function writeToCell(filePath: string, cellAddress: string, data: any, sheetName?: string): void {
  try {
    let workbook: xlsx.WorkBook;
    try {
      workbook = xlsx.readFile(filePath);
    } catch {
      workbook = xlsx.utils.book_new();
    }

    const sheet = sheetName || workbook.SheetNames[0] || 'Sheet1';
    if (!workbook.Sheets[sheet]) {
      xlsx.utils.book_append_sheet(workbook, xlsx.utils.aoa_to_sheet([]), sheet);
    }

    const worksheet = workbook.Sheets[sheet];

    // Convert address to cell object
    xlsx.utils.sheet_add_aoa(worksheet, [[data]], { origin: cellAddress });

    xlsx.writeFile(workbook, filePath);
  } catch (error: any) {
    throw new Error(`Failed to write to cell ${cellAddress} in ${filePath}: ${error.message}`);
  }
}
