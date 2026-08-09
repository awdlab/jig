export function deepSet(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  let current = obj;
  keys.forEach(key => {
    if (!current[key]) {
      current[key] = {};
    }
    current = current[key];
  });
  const lastKey = keys[keys.length - 1];
  if (!lastKey) {
    throw new Error('Path cannot be empty');
  }
  current[lastKey] = value;
}
