import fs from 'fs';
import path from 'path';

export function getSvelteFilesInDirectory(dirPath) {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const files = entries
      .filter(entry => entry.isFile() && entry.name.endsWith('.svelte'))
      .map(file => path.resolve(dirPath, file.name));

    return files;
  } catch (error) {
    throw new Error(error);
  }
}