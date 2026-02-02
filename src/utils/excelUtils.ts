import xlsx from 'xlsx';

export function readExcel(filePath: string, sheetName?: string) {
  const workbook = xlsx.readFile(filePath);
  const sheet = sheetName || workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheet];
  return xlsx.utils.sheet_to_json(worksheet, { defval: '' });
}
