import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';

export interface DiscoveredControl {
  name: string;
  /** Absolute path of the file declaring the class. */
  file: string;
  typeParams: { name: string; constraint: string | null }[];
}

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    if (!entry.name.endsWith('.ts')) return [];
    if (entry.name.endsWith('.spec.ts') || entry.name.endsWith('.test.ts')) return [];
    return [full];
  });
}

function hasControlCategory(node: ts.Node): boolean {
  return ts
    .getJSDocTags(node)
    .some(
      tag =>
        tag.tagName.text === 'category' &&
        typeof tag.comment === 'string' &&
        ['control', 'directive'].includes(tag.comment.trim())
    );
}

/** Finds every exported class annotated with `@category control` or `@category directive`. */
export function discoverControls(srcDir: string): DiscoveredControl[] {
  const controls: DiscoveredControl[] = [];

  for (const file of walk(srcDir)) {
    const source = ts.createSourceFile(
      file,
      readFileSync(file, 'utf-8'),
      ts.ScriptTarget.Latest,
      true
    );

    for (const statement of source.statements) {
      if (!ts.isClassDeclaration(statement) || !statement.name) continue;
      if (!hasControlCategory(statement)) continue;

      controls.push({
        name: statement.name.text,
        file,
        typeParams: (statement.typeParameters ?? []).map(param => ({
          name: param.name.text,
          constraint: param.constraint ? param.constraint.getText(source) : null,
        })),
      });
    }
  }

  return controls.sort((a, b) => a.name.localeCompare(b.name));
}
