import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export async function readJsonFile<T>(fileName: string, defaultValue: T): Promise<T> {
  try {
    const filePath = path.join(DATA_DIR, fileName);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // File does not exist, initialize with default value
      await writeJsonFile(fileName, defaultValue);
      return defaultValue;
    }
    console.error(`Error reading ${fileName}:`, error);
    return defaultValue;
  }
}

export async function writeJsonFile<T>(fileName: string, data: T): Promise<boolean> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const filePath = path.join(DATA_DIR, fileName);
    const tempPath = `${filePath}.tmp`;
    
    // Write formatted JSON
    await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    await fs.rename(tempPath, filePath);
    return true;
  } catch (error) {
    console.error(`Error writing ${fileName}:`, error);
    return false;
  }
}
