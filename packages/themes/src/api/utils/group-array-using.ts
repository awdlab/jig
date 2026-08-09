export function groupArrayUsing<T, G>(array: readonly T[], groupFn: (item: T) => G): Map<G, T[]> {
  const map = new Map<G, T[]>();
  for (const item of array) {
    const key = groupFn(item);
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)?.push(item);
  }
  return map;
}
