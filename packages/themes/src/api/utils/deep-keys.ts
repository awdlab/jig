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
