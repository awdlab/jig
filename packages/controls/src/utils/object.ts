export function deepCopy<T>(obj: T): T extends ReadonlyArray<infer U> ? Array<U> : T {
  return JSON.parse(JSON.stringify(obj));
}
