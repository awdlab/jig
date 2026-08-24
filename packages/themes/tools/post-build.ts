import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { rewriteDistSpecifiers } from '../../../tools/utils/rewrite-dist-specifiers';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const projectRoot = path.join(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

const THEMES = ['nova', 'shade', 'material'];

rewriteDistSpecifiers(distDir);

// Declaration-only files are not emitted by tsc, so they have to be copied over.
for (const theme of THEMES) {
  for (const file of ['theme-types.d.ts', 'typed.d.ts']) {
    fs.copyFileSync(
      path.join(projectRoot, `src/${theme}/${file}`),
      path.join(distDir, `${theme}/${file}`)
    );
  }
}
