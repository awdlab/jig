export type SubKey<T extends readonly string[]> = T extends readonly [infer P, ...infer R]
  ? P extends string
    ? R extends readonly string[]
      ? P extends ''
        ? SubKey<R>
        : SubKey<R> extends ''
          ? P
          : `${P}.${SubKey<R>}`
      : never
    : never
  : '';

export function subKey<T extends readonly string[]>(...parts: T): SubKey<T> {
  return parts.reduce((acc, part) => {
    return part ? (acc ? `${acc}.${part}` : part) : acc;
  }, '') as SubKey<T>;
}
