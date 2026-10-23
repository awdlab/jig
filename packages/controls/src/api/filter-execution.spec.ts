import { describe, expect, it } from 'vitest';

import {
  executeAttributeFilter,
  executeFilter,
  parseFilterRawDate,
  parseFilterRawValue,
  readFilterAttributeValue,
} from './filter-execution';

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

describe('executeAttributeFilter', () => {
  type Row = { name: string; email: string; age: number };
  const attributes = [
    { key: 'name', label: 'Name', dataType: 'string' },
    { key: 'email', label: 'Email', dataType: 'string' },
    { key: 'age', label: 'Age', dataType: 'number' },
  ] as const;
  const data: Row[] = [
    { name: 'Ann', email: 'ann@gmail.com', age: 31 },
    { name: 'Bo', email: 'bo@work.com', age: 44 },
    { name: 'Cal', email: 'cal@gmail.com', age: 22 },
  ];
  const names = (rows: readonly Row[]) => rows.map(r => r.name);
  const gmail = { attribute: 'email', operator: 'contains', rawValue: '@gmail.com' } as const;
  const over25 = { attribute: 'age', operator: 'greaterThan', rawValue: '25' } as const;

  it('filters on the attribute each condition names', () => {
    const result = executeAttributeFilter(
      data,
      { matchMode: 'all', conditions: [gmail] },
      attributes
    );
    expect(names(result)).toEqual(['Ann', 'Cal']);
  });

  it('joins conditions across attributes with all', () => {
    const result = executeAttributeFilter(
      data,
      { matchMode: 'all', conditions: [gmail, over25] },
      attributes
    );
    expect(names(result)).toEqual(['Ann']);
  });

  it('joins conditions across attributes with any', () => {
    const result = executeAttributeFilter(
      data,
      { matchMode: 'any', conditions: [gmail, over25] },
      attributes
    );
    expect(names(result)).toEqual(['Ann', 'Bo', 'Cal']);
  });

  it('reads values through a supplied selector', () => {
    const result = executeAttributeFilter(
      data,
      {
        matchMode: 'all',
        conditions: [{ attribute: 'domain', operator: 'isEqual', rawValue: 'work.com' }],
      },
      [
        {
          computedKey: 'domain',
          label: 'Domain',
          dataType: 'string',
          selector: (r: Row) => r.email.split('@')[1],
        },
      ]
    );
    expect(names(result)).toEqual(['Bo']);
  });

  it('reads a JigItem through its data payload by default', () => {
    const items = data.map(row => ({ label: row.name, value: row.name, data: row }));
    const result = executeAttributeFilter(items, { matchMode: 'all', conditions: [over25] }, [
      { key: 'age', label: 'Age', dataType: 'number' },
    ]);
    expect(result.map(i => i.label)).toEqual(['Ann', 'Bo']);
  });

  it('ignores a condition naming an unknown attribute', () => {
    const result = executeAttributeFilter(
      data,
      {
        matchMode: 'all',
        conditions: [{ attribute: 'nope', operator: 'contains', rawValue: 'x' }, gmail],
      },
      attributes
    );
    expect(names(result)).toEqual(['Ann', 'Cal']);
  });

  it('returns the data unchanged when no condition is active', () => {
    const result = executeAttributeFilter(
      data,
      {
        matchMode: 'all',
        conditions: [{ attribute: 'email', operator: 'contains', rawValue: '' }],
      },
      attributes
    );
    expect(result).toBe(data);
  });

  it('keeps a group whose children survive and drops one whose children do not', () => {
    type Node = { name: string; email: string; age: number; items?: Node[] };
    const [ann, bo] = data as [Row, Row];
    const groups: Node[] = [
      { name: 'G1', email: '', age: 0, items: [ann, bo] },
      { name: 'G2', email: '', age: 0, items: [bo] },
    ];
    const result = executeAttributeFilter(
      groups,
      { matchMode: 'all', conditions: [gmail] },
      attributes,
      'items'
    );
    expect(result).toEqual([{ name: 'G1', email: '', age: 0, items: [ann] }]);
  });
});

describe('readFilterAttributeValue', () => {
  const email = { key: 'email', label: 'Email', dataType: 'string' } as const;
  const row = { name: 'Ann', email: 'ann@gmail.com' };

  it('reads the property named by the key', () => {
    expect(readFilterAttributeValue(row, email)).toBe('ann@gmail.com');
  });

  it('reads through a JigItem data payload', () => {
    expect(readFilterAttributeValue({ label: 'Ann', value: 1, data: row }, email)).toBe(
      'ann@gmail.com'
    );
  });

  it('prefers the attribute selector over the key', () => {
    const domain = {
      key: 'email',
      label: 'Domain',
      dataType: 'string',
      selector: (r: typeof row) => r.email.split('@')[1],
    } as const;
    expect(readFilterAttributeValue(row, domain)).toBe('gmail.com');
  });

  it('is undefined for a key the item does not carry', () => {
    expect(
      readFilterAttributeValue(row, { key: 'age', label: 'Age', dataType: 'number' })
    ).toBeUndefined();
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
