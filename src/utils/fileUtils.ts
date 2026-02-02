import fs from 'fs/promises';
import PropertiesReader from 'properties-reader';

export async function readText(filePath: string): Promise<string> {
  return fs.readFile(filePath, { encoding: 'utf-8' });
}

export async function readJson<T = any>(filePath: string): Promise<T> {
  const txt = await readText(filePath);
  return JSON.parse(txt) as T;
}

export function readProperties(filePath: string): Record<string, any> {
  const props = PropertiesReader(filePath);
  const result: Record<string, any> = {};
  props.each((key: string, value: any) => {
    result[key] = value;
  });
  return result;
}
