type CombineVariations<
  A extends readonly string[],
  B extends readonly string[],
  Result extends string[] = [],
> = A extends readonly [infer AH, ...infer AT]
  ? AH extends string
    ? AT extends readonly string[]
      ? [
          ...CombineVariations<AT, B, Result>,
          ...{
            [K in keyof B]: [AH, B[K]];
          },
        ]
      : Result
    : Result
  : Result;

export function combineVariations<
  const A extends readonly string[],
  const B extends readonly string[],
>(a: A, b: B): CombineVariations<A, B> {
  const result: unknown[] = [];
  for (const itemA of a) {
    for (const itemB of b) {
      result.push([itemA, itemB]);
    }
  }
  return result as CombineVariations<A, B>;
}
