import {
  getTimeSpan,
  getTimeSpanMilliseconds,
  getTimeSpanString,
  isTimeSpan,
  type TimeSpan,
} from './time-span';

describe('TimeSpan', () => {
  it('should allow number', () => {
    assertType<TimeSpan>(4711);
    assertType<TimeSpan>(-45.145);
  });

  it('should allow string in correct format', () => {
    assertType<TimeSpan>('');
    assertType<TimeSpan>('1d');
    assertType<TimeSpan>('2h');
    assertType<TimeSpan>('3m');
    assertType<TimeSpan>('4s');
    assertType<TimeSpan>('5ms');
    assertType<TimeSpan>('3m5ms');
    assertType<TimeSpan>('1d2h3m4s5ms');
  });

  it('should not allow string in incorrect format', () => {
    // @ts-expect-error 6x is not a valid time unit
    assertType<TimeSpan>('1d2h3m4s5ms6x');
    // @ts-expect-error wrong order of time units
    assertType<TimeSpan>('1h2d');
    // @ts-expect-error missing value
    assertType<TimeSpan>('1d2hm4s5');
  });

  it('should allow object with time units', () => {
    assertType<TimeSpan>({ days: 1 });
    assertType<TimeSpan>({ hours: 2 });
    assertType<TimeSpan>({ minutes: 3 });
    assertType<TimeSpan>({ seconds: 4 });
    assertType<TimeSpan>({ milliseconds: 5 });
    assertType<TimeSpan>({ days: 1, hours: 2, minutes: 3, seconds: 4, milliseconds: 5 });
  });

  it('should not allow object with invalid properties', () => {
    // @ts-expect-error invalid property
    assertType<TimeSpan>({ days: 1, foo: 2 });
  });

  it('should not allow other types', () => {
    // @ts-expect-error null is not a valid TimeSpan
    assertType<TimeSpan>(null);
    // @ts-expect-error undefined is not a valid TimeSpan
    assertType<TimeSpan>(undefined);
    // @ts-expect-error boolean is not a valid TimeSpan
    assertType<TimeSpan>(true);
    // @ts-expect-error array is not a valid TimeSpan
    assertType<TimeSpan>([1, 2, 3]);
    // @ts-expect-error function is not a valid TimeSpan
    assertType<TimeSpan>(() => {});
  });
});

it.each([
  [4711, true],
  ['', true],
  ['1d', true],
  ['2h', true],
  ['3m', true],
  ['4s', true],
  ['5ms', true],
  ['3m5ms', true],
  ['1d2h3m4s5ms', true],
  [{ days: 1 }, true],
  [{ hours: 2 }, true],
  [{ minutes: 3 }, true],
  [{ seconds: 4 }, true],
  [{ milliseconds: 5 }, true],
  [{ days: 1, hours: 2, minutes: 3, seconds: 4, milliseconds: 5 }, true],
  ['1d2h3m4s5ms6x', false],
  ['1h2d', false],
  ['1d2hm4s5', false],
  [{ days: 1, foo: 2 }, true],
  [null, false],
  [undefined, false],
  [true, false],
  [[1, 2, 3], false],
  [() => {}, false],
])('isTimeSpan(%j) -> %j', (value, expected) => {
  expect(isTimeSpan(value)).toBe(expected);
});

it.each<[TimeSpan, number]>([
  [1000, 1000],
  [-500, -500],
  ['', 0],
  ['1d', 86400000],
  ['2h', 7200000],
  ['3m', 180000],
  ['4s', 4000],
  ['5ms', 5],
  ['3m5ms', 180005],
  ['1d2h3m4s5ms', 93784005],
  [{ days: 1 }, 86400000],
  [{ hours: 2 }, 7200000],
  [{ minutes: 3 }, 180000],
  [{ seconds: 4 }, 4000],
  [{ milliseconds: 5 }, 5],
  [{ days: 1, hours: 2, minutes: 3, seconds: 4, milliseconds: 5 }, 93784005],
  ['invalid' as any, 0],
  [{ foo: true } as any, 0],
])('getTimeSpanMilliseconds(%j) -> %j', (timeSpan, expected) => {
  expect(getTimeSpanMilliseconds(timeSpan)).toBe(expected);
});

it.each<[TimeSpan, string]>([
  [1000, '1000ms'],
  [-500, '-500ms'],
  ['', ''],
  ['1d', '1d'],
  ['2h', '2h'],
  ['3m', '3m'],
  ['4s', '4s'],
  ['5ms', '5ms'],
  ['3m5ms', '3m5ms'],
  ['1d2h3m4s5ms', '1d2h3m4s5ms'],
  [{ days: 1 }, '1d'],
  [{ hours: 2 }, '2h'],
  [{ minutes: 3 }, '3m'],
  [{ seconds: 4 }, '4s'],
  [{ milliseconds: 5 }, '5ms'],
  [{ days: 1, hours: 2, minutes: 3, seconds: 4, milliseconds: 5 }, '1d2h3m4s5ms'],
  ['invalid' as any, 'invalid'],
  [{ foo: true } as any, ''],
])('getTimeSpanString(%j) -> %j', (timeSpan, expected) => {
  expect(getTimeSpanString(timeSpan)).toBe(expected);
});

it.each<[TimeSpan, TimeSpan & object]>([
  [1000, { milliseconds: 1000 }],
  [-500, { milliseconds: -500 }],
  ['', { days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }],
  ['1d', { days: 1, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }],
  ['2h', { days: 0, hours: 2, minutes: 0, seconds: 0, milliseconds: 0 }],
  ['3m', { days: 0, hours: 0, minutes: 3, seconds: 0, milliseconds: 0 }],
  ['4s', { days: 0, hours: 0, minutes: 0, seconds: 4, milliseconds: 0 }],
  ['5ms', { days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 5 }],
  ['3m5ms', { days: 0, hours: 0, minutes: 3, seconds: 0, milliseconds: 5 }],
  ['1d2h3m4s5ms', { days: 1, hours: 2, minutes: 3, seconds: 4, milliseconds: 5 }],
  [{ days: 1 }, { days: 1 }],
  [{ hours: 2 }, { hours: 2 }],
  [{ minutes: 3 }, { minutes: 3 }],
  [{ seconds: 4 }, { seconds: 4 }],
  [{ milliseconds: 5 }, { milliseconds: 5 }],
  [
    { days: 1, hours: 2, minutes: 3, seconds: 4, milliseconds: 5 },
    { days: 1, hours: 2, minutes: 3, seconds: 4, milliseconds: 5 },
  ],
  ['invalid' as any, { days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }],
  [{ foo: true } as any, { foo: true } as any],
])('getTimeSpan(%j) -> %j', (timeSpan, expected) => {
  expect(getTimeSpan(timeSpan)).toEqual(expected);
});
