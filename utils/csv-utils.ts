import fs from 'fs';
import { parse } from 'csv-parse';

export async function readCsv(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const records: any[] = [];
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, skip_empty_lines: true }))
      .on('data', (data) => records.push(data))
      .on('end', () => {
        console.log('Finished reading CSV:', records);
        resolve(records);
      })
      .on('error', (err) => reject(err));
  });
}

export async function writeCsv(filePath: string, data: any[]): Promise<void> {
  // For simplicity, this example only supports reading. Writing CSV would require a different library or manual string formatting.
  // This function is a placeholder and would need a proper implementation for writing.
  console.log('CSV writing not implemented in this example.');
  return Promise.resolve();
}
