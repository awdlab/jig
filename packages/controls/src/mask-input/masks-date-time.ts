import type { MaskInputCfg } from './types';

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
export function getDateOrTimeMask(mask: string): MaskInputCfg {
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

  const result: MaskInputCfg = cfg.map(segment => {
    if ('literal' in segment) {
      return segment.literal;
    } else {
      const { symbol, length } = segment;
      // A single-letter token (length 1) yields a variable-length, non-padded field
      // (`length` omitted); a doubled token (length >= 2) yields a fixed, zero-padded field.
      const len = length >= 2 ? length : undefined;
      switch (symbol) {
        case 'day':
          return {
            segment: 'day',
            kind: 'number',
            min: 1,
            max: 31,
            length: len,
            placeholder: 'DD',
          } as const;
        case 'month':
          return {
            segment: 'month',
            kind: 'number',
            min: 1,
            max: 12,
            length: len,
            placeholder: 'MM',
          } as const;
        case 'year':
          return {
            segment: 'year',
            kind: 'number',
            min: 0,
            max: 9999,
            length: len,
            placeholder: 'YYYY',
          } as const;
        case 'hour24':
          return {
            segment: 'hour24',
            kind: 'number',
            min: 0,
            max: 23,
            length: len,
            placeholder: 'HH',
          } as const;
        case 'hour12':
          return {
            segment: 'hour12',
            kind: 'number',
            min: 1,
            max: 12,
            length: len,
            placeholder: 'HH',
          } as const;
        case 'minute':
          return {
            segment: 'minute',
            kind: 'number',
            min: 0,
            max: 59,
            length: len,
            placeholder: 'MM',
          } as const;
        case 'second':
          return {
            segment: 'second',
            kind: 'number',
            min: 0,
            max: 59,
            length: len,
            placeholder: 'SS',
          } as const;
        case 'period':
          return {
            segment: 'period',
            kind: 'enum',
            values: ['AM', 'PM'],
          } as const;
        case 'fractionalSecond':
          return {
            segment: 'fractionalSecond',
            kind: 'number',
            min: 0,
            max: 999,
            length: len,
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
