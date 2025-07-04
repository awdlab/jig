import { SubKey } from '../utils/sub-key';

type CombineVariableVariations<
  A extends readonly string[],
  B extends readonly string[],
  Result extends string[] = [],
> = A extends readonly [infer AH, ...infer AT]
  ? AH extends string
    ? AT extends readonly string[]
      ? [
          ...CombineVariableVariations<AT, B, Result>,
          ...{
            [K in keyof B]: SubKey<[AH, B[K]]>;
          },
        ]
      : Result
    : Result
  : Result;

export function combineVariableVariations<
  const A extends readonly string[],
  const B extends readonly string[],
>(a: A, b: B): CombineVariableVariations<A, B> {
  const result: unknown[] = [];
  for (const itemA of a) {
    for (const itemB of b) {
      result.push(itemA === '' ? itemB : itemB === '' ? itemA : `${itemA}.${itemB}`);
    }
  }
  return result as CombineVariableVariations<A, B>;
}
