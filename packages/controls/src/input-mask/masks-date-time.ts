import type { InputMaskCfg } from './types';

const formatSymbols = {
  d: 'day',
  M: 'month',
  y: 'year',
  H: 'hour24',
  h: 'hour12',
  m: 'minute',
  s: 'second',
  a: 'period',
  S: 'fractionalSecond',
} as const;

type GroupedFormatSymbol = {
  symbol: (typeof formatSymbols)[keyof typeof formatSymbols];
  length: number;
};

type Literal = {
  literal: string;
};

type GroupedMaskSegment = GroupedFormatSymbol | Literal;

/**
 * Returns the input mask configuration for a given date or time mask.
 * @param mask The mask string representing the date or time format.
 * For example, 'MM/dd/yyyy' for date, 'HH:mm:ss' for time, 'hh:mm:ss a' for 12-hour time with period.
 * @returns The input mask configuration that can be used with the input mask component.
 */
export function getDateOrTimeMask(mask: string): InputMaskCfg {
  const cfg: GroupedMaskSegment[] = [];
  let i = 0;
  while (i < mask.length) {
    const char = mask[i] as keyof typeof formatSymbols;
    const symbol = formatSymbols[char];
    if (symbol) {
      // Count how many times this symbol repeats
      let length = 1;
      while (i + length < mask.length && mask[i + length] === char) {
        length++;
      }
      cfg.push({ symbol, length });
      i += length;
    } else {
      cfg.push({ literal: char });
      i++;
    }
  }

  const result: InputMaskCfg = cfg.map(segment => {
    if ('literal' in segment) {
      return segment.literal;
    } else {
      const { symbol, length } = segment;
      switch (symbol) {
        case 'day':
          return {
            segment: 'day',
            kind: 'number',
            min: 1,
            max: 31,
            length,
            placeholder: 'DD',
          } as const;
        case 'month':
          return {
            segment: 'month',
            kind: 'number',
            min: 1,
            max: 12,
            length,
            placeholder: 'MM',
          } as const;
        case 'year':
          return {
            segment: 'year',
            kind: 'number',
            min: 0,
            max: 9999,
            length,
            placeholder: 'YYYY',
          } as const;
        case 'hour24':
          return {
            segment: 'hour24',
            kind: 'number',
            min: 0,
            max: 23,
            length,
            placeholder: 'HH',
          } as const;
        case 'hour12':
          return {
            segment: 'hour12',
            kind: 'number',
            min: 1,
            max: 12,
            length,
            placeholder: 'HH',
          } as const;
        case 'minute':
          return {
            segment: 'minute',
            kind: 'number',
            min: 0,
            max: 59,
            length,
            placeholder: 'MM',
          } as const;
        case 'second':
          return {
            segment: 'second',
            kind: 'number',
            min: 0,
            max: 59,
            length,
            placeholder: 'SS',
          } as const;
        case 'period':
          return {
            segment: 'period',
            kind: 'enum',
            values: ['AM', 'PM'],
            length: 2,
          } as const;
        case 'fractionalSecond':
          return {
            segment: 'fractionalSecond',
            kind: 'number',
            min: 0,
            max: 999,
            length,
            placeholder: 'SSS',
          } as const;
      }
    }
  });
  return result;
}

export const DATE_TIME_MASKS = {
  date: getDateOrTimeMask('MM/dd/yyyy'),
  time: getDateOrTimeMask('HH:mm:ss'),
  timeShort: getDateOrTimeMask('HH:mm'),
  time12: getDateOrTimeMask('hh:mm:ss a'),
};
