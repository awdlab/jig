/**
 * The only reason this should be okay is because playwright generates the screenshots with `-win32` even
 * though we are running against the playwright docker container (linux). The playwright UI is running
 * on windows while the rendering happens in the container, yet the screenshots are saved with the `-win32` suffix.
 */

import { copyFile, readdir, stat } from 'fs/promises';
import { join } from 'path';

const SNAPSHOT_DIR = 'tests/snapshots';

async function getAllPngFilesRecursive(dir: string): Promise<string[]> {
  const entries = await readdir(dir);
  let pngFiles: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stats = await stat(fullPath);

    if (stats.isDirectory()) {
      const nestedPngFiles = await getAllPngFilesRecursive(fullPath);
      pngFiles = pngFiles.concat(nestedPngFiles);
    } else if (entry.endsWith('.png')) {
      pngFiles.push(fullPath);
    }
  }

  return pngFiles;
}

async function fixScreenshot(filePath: string) {
  // copy *-win32.png to *-linux.png
  const newFilePath = filePath.replace('-win32.png', '-linux.png');
  await copyFile(filePath, newFilePath);
}

async function run() {
  const files = await getAllPngFilesRecursive(SNAPSHOT_DIR);

  await Promise.all(files.map(fixScreenshot));
}

run();
