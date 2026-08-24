import fs from 'fs';
import path from 'path';

/**
 * `module: preserve` emits import specifiers verbatim, so the extensionless and directory
 * specifiers the source uses survive into `dist` — where Node's ESM resolver rejects them
 * (`ERR_UNSUPPORTED_DIR_IMPORT`). Rewrite them to the real emitted file.
 */
export function rewriteDistSpecifiers(dir: string) {
  const files = fs
    .readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter(entry => entry.isFile() && /\.(js|d\.ts)$/.test(entry.name))
    .map(entry => path.join(entry.parentPath, entry.name));

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf-8');
    const rewritten = source.replace(
      /(from\s*|import\s*\(?\s*)'(\.\.?\/[^']*)'/g,
      (match, prefix: string, specifier: string) => {
        if (/\.(js|json|css)$/.test(specifier)) return match;
        const target = path.join(path.dirname(file), specifier);
        const suffix = fs.existsSync(target) && fs.statSync(target).isDirectory() ? '/index' : '';
        return `${prefix}'${specifier}${suffix}.js'`;
      }
    );
    if (rewritten !== source) fs.writeFileSync(file, rewritten, 'utf-8');
  }
}
