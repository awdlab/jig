type Args<T extends readonly (readonly string[])[]> = T extends readonly [infer A, ...infer B]
  ? A extends readonly string[]
    ? B extends readonly (readonly string[])[]
      ? [A[number], ...Args<B>]
      : never
    : never
  : [];

export function buildVariationCombinationStyles<const T extends readonly (readonly string[])[]>(
  variations: T,
  css: (...args: Args<T>) => string
): string {
  const indexes = Array(variations.length).fill(0);
  const maxes = variations.map(v => v.length);
  let result = '';
  while (true) {
    const args = indexes.map((index, i) => variations[i][index]) as Args<T>;
    result += css(...args);
    if (!increaseIndex(indexes, maxes)) {
      break;
    }
  }
  return result;
}

function increaseIndex(indexes: number[], maxes: number[]): boolean {
  for (let i = indexes.length - 1; i >= 0; i--) {
    if (indexes[i] < maxes[i] - 1) {
      indexes[i]++;
      return true;
    }
    indexes[i] = 0;
  }
  return false;
}
