let _cache: Promise<typeof import('../docs/_generated/typedoc.json')> | null = null;

export async function getTypedocProject() {
  _cache ??= import('../docs/_generated/typedoc.json');
  return _cache;
}
