import type { TypeMatrix } from './playground/type-model';

let _cache: Promise<TypeMatrix> | null = null;

export async function getTypeMatrix(): Promise<TypeMatrix> {
  _cache ??= import('../docs/_generated/type-matrix.json').then(m => m.default as TypeMatrix);
  return _cache;
}
