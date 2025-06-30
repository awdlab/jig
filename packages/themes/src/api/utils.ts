type _DeepKeys<
  T,
  MaxDepth extends number,
  P extends string = '',
  D extends null[] = [],
> = D['length'] extends MaxDepth
  ? never
  : T extends object
    ? {
        [K in keyof T]-?: K extends string
          ? T[K] extends object
            ? _DeepKeys<T[K], MaxDepth, `${P}${K}.`, [...D, null]>
            : `${P}${K}`
          : never;
      }[keyof T]
    : P;
export type DeepKeys<T, D extends number = 10> = _DeepKeys<T, D>;

type _DeepMerge<T, M extends any[]> = T extends T
  ? M extends [infer A, ...infer R]
    ? never extends A
      ? _DeepMerge<T, R>
      : A extends object
        ? T extends object
          ? _DeepMerge<
              {
                [K in keyof T | keyof A]: K extends keyof T
                  ? K extends keyof A
                    ? _DeepMerge<T[K], [A[K]]>
                    : T[K]
                  : K extends keyof A
                    ? A[K]
                    : never;
              },
              R
            >
          : _DeepMerge<A, R>
        : undefined extends A
          ? _DeepMerge<T | A, R>
          : _DeepMerge<A, R>
    : T
  : never;
export type DeepMerge<T extends object[]> = T extends [infer A, ...infer R]
  ? _DeepMerge<A, R>
  : never;

export function deepMerge<T extends object[]>(...objects: T): DeepMerge<T> {
  return objects.reduce((acc, obj: any) => {
    if (typeof obj !== 'object' || obj === null) {
      return acc;
    }
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      if (Array.isArray(value)) {
        acc[key] = [...(acc[key] || []), ...value];
      } else if (typeof value === 'object' && value !== null) {
        acc[key] = deepMerge(acc[key] || {}, value);
      } else {
        acc[key] = value;
      }
    });
    return acc;
  }, {} as any) as DeepMerge<T>;
}
