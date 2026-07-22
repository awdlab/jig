/**
 * In-memory fake backend for the lazy-loading table demos. Simulates network
 * latency with a delay; not part of the published control library.
 */
export type Person = { id: number; name: string; email: string; age: number };

const DATA: Person[] = Array.from({ length: 523 }, (_, i) => ({
  id: i + 1,
  name: `Person ${i + 1}`,
  email: `person${i + 1}@example.com`,
  age: 18 + (i % 50),
}));

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

/** Offset-based loader (pagination + infinite scroll). */
export async function fetchPage(skip: number, take: number, withTotal = true) {
  await delay(400);
  const rows = DATA.slice(skip, skip + take);
  return {
    rows,
    total: withTotal ? DATA.length : undefined,
    hasMore: skip + take < DATA.length,
  };
}

/** Cursor-based loader (compact pagination) — token is the next offset, total omitted. */
export async function fetchCursor(cursor: number | undefined, take: number) {
  await delay(400);
  const skip = cursor ?? 0;
  const rows = DATA.slice(skip, skip + take);
  const nextSkip = skip + take;
  return { rows, hasMore: nextSkip < DATA.length, cursor: nextSkip };
}
