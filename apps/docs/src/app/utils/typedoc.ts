import type TypeDocType from '../docs/_generated/typedoc.json';

let _cache: Promise<typeof TypeDocType> | null = null;

export async function getTypedocProject() {
  _cache ??= import('../docs/_generated/typedoc.json');
  return _cache;
}
