export function deepCopy<T>(obj: T): T extends ReadonlyArray<infer U> ? Array<U> : T {
  return JSON.parse(JSON.stringify(obj));
}

export function objectKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}
