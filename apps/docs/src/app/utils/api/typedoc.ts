let _cache: Promise<any> | null = null;

export async function getTypedocProject() {
  _cache ??= import('../../docs/_generated/typedoc.json');
  return _cache;
}
