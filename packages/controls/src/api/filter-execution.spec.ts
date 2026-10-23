import { describe, expect, it } from 'vitest';

import { executeFilter, parseFilterRawDate, parseFilterRawValue } from './filter-execution';

describe('parseFilterRawDate', () => {
  it('reads a bare YYYY-MM-DD as local midnight, not UTC midnight', () => {
    expect(parseFilterRawDate('2026-03-14')?.getTime()).toBe(new Date(2026, 2, 14).getTime());
  });

  it('keeps datetime-local strings local', () => {
    expect(parseFilterRawDate('2026-03-14T08:30')?.getTime()).toBe(
      new Date(2026, 2, 14, 8, 30).getTime()
    );
  });

  it('honours an explicit offset', () => {
    expect(parseFilterRawDate('2026-03-14T00:00:00Z')?.getTime()).toBe(Date.UTC(2026, 2, 14));
  });

  it('returns null for garbage', () => {
    expect(parseFilterRawDate('not-a-date')).toBeNull();
  });

  it('round-trips the date rawValue format without shifting the day', () => {
    const raw = '2026-03-14';
    const parsed = parseFilterRawValue(raw, 'date') as Date;
    const pad = (n: number) => String(n).padStart(2, '0');
    expect(`${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`).toBe(
      raw
    );
  });
});

describe('executeFilter date granularity', () => {
  const morning = new Date(2026, 2, 14, 8, 0);
  const evening = new Date(2026, 2, 14, 23, 30);
  const nextDay = new Date(2026, 2, 15, 1, 0);
  const data = [morning, evening, nextDay];

  type Config = Parameters<typeof executeFilter<Date>>[1];

  const run = (
    dataType: 'date' | 'dateTime',
    operator: Config['conditions'][number]['operator'],
    rawValue: string
  ) => executeFilter(data, { dataType, matchMode: 'all', conditions: [{ operator, rawValue }] });

  it('matches any time on the day for isEqual', () => {
    expect(run('date', 'isEqual', '2026-03-14')).toEqual([morning, evening]);
  });

  it('includes the whole day for lessThanOrEqual', () => {
    expect(run('date', 'lessThanOrEqual', '2026-03-14')).toEqual([morning, evening]);
  });

  it('excludes the whole day for greaterThan', () => {
    expect(run('date', 'greaterThan', '2026-03-14')).toEqual([nextDay]);
  });

  it('keeps dateTime exact to the minute', () => {
    expect(run('dateTime', 'isEqual', '2026-03-14T08:00')).toEqual([morning]);
  });
});

describe('executeFilter notContains', () => {
  const data = ['Nigeria', 'Algeria', 'Germany', 'France', ''];

  it('keeps only the values without the substring, empty ones included', () => {
    expect(
      executeFilter(data, {
        dataType: 'string',
        matchMode: 'all',
        conditions: [{ operator: 'notContains', rawValue: 'ger' }],
      })
    ).toEqual(['France', '']);
  });
});
