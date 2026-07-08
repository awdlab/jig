import { describe, expect, it } from 'vitest';

import {
  composeDisplay,
  deserialize,
  fieldList,
  isComplete,
  isSectionComplete,
  nearestSectionIndex,
  paste,
  resolveMask,
  serialize,
  stepSection,
  typeIntoSection,
} from './helper';

import type { MaskInputCfg } from './types';

// ---- Fixtures ----

const timeMask: MaskInputCfg = [
  { kind: 'number', segment: 'hour', min: 0, max: 23, length: 2, placeholder: 'HH' },
  ':',
  { kind: 'number', segment: 'minute', min: 0, max: 59, length: 2, placeholder: 'MM' },
];

const varHourMask: MaskInputCfg = [
  { kind: 'number', segment: 'hour', min: 1, max: 12, placeholder: 'HH' }, // no length → variable
  ':',
  { kind: 'number', segment: 'minute', min: 0, max: 59, length: 2, placeholder: 'MM' },
];

// Both fields variable (no length on either).
const varBothMask: MaskInputCfg = [
  { kind: 'number', segment: 'hour', min: 1, max: 12, placeholder: 'HH' },
  ':',
  { kind: 'number', segment: 'minute', min: 0, max: 59, placeholder: 'MM' },
];

// Variable date with single-letter tokens: d/M/yyyy-style.
const varDateMask: MaskInputCfg = [
  { kind: 'number', segment: 'month', min: 1, max: 12, placeholder: 'MM' },
  '/',
  { kind: 'number', segment: 'day', min: 1, max: 31, placeholder: 'DD' },
  '/',
  { kind: 'number', segment: 'year', min: 0, max: 9999, length: 4, placeholder: 'YYYY' },
];

const dateEnumMask: MaskInputCfg = [
  {
    kind: 'enum',
    segment: 'month',
    values: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  ' ',
  { kind: 'number', segment: 'year', min: 0, max: 9999, length: 4, placeholder: 'YYYY' },
];

// ---- resolveMask / fieldList (unchanged behaviour) ----

describe('resolveMask', () => {
  it('returns null for null/empty/unknown raw string', () => {
    expect(resolveMask(null)).toBeNull();
    expect(resolveMask('')).toBeNull();
    expect(resolveMask('00/00')).toBeNull(); // raw patterns no longer supported
  });

  it('resolves named registry masks', () => {
    expect(resolveMask('time')).not.toBeNull();
    expect(resolveMask('phoneNumber')).not.toBeNull();
  });

  it('derives a fixed padded number field from explicit length', () => {
    const parts = resolveMask(timeMask)!;
    const hour = fieldList(parts)[0];
    expect(hour).toMatchObject({ kind: 'number', name: 'hour', maxLen: 2, pad: true });
  });

  it('derives a variable field (maxLen from max, pad false) when length omitted', () => {
    const hour = fieldList(resolveMask(varHourMask)!)[0];
    expect(hour).toMatchObject({ kind: 'number', maxLen: 2, pad: false }); // String(12).length === 2
  });

  it('parses separators as sep parts', () => {
    const parts = resolveMask(timeMask)!;
    expect(parts[1]).toEqual({ kind: 'sep', text: ':' });
  });
});

// ---- typeIntoSection ----

describe('typeIntoSection', () => {
  const timeParts = resolveMask(timeMask)!;
  const [hourField, minuteField] = fieldList(timeParts);

  const varDateParts = resolveMask(varDateMask)!;
  const [monthField] = fieldList(varDateParts);

  const enumParts = resolveMask(dateEnumMask)!;
  const [enumMonthField] = fieldList(enumParts);

  it('rejects non-digit char for a number field', () => {
    expect(typeIntoSection(hourField!, '', 'x')).toBeNull();
    expect(typeIntoSection(hourField!, '', ':')).toBeNull();
  });

  it('accepts a fitting digit into empty section (no advance)', () => {
    // '2' on hour 0-23: 2*10=20<=23, so not yet at advance threshold
    const r = typeIntoSection(hourField!, '', '2');
    expect(r).toEqual({ value: '2', advance: false });
  });

  it('single-digit overflow: digit that as a fresh single char forces advance', () => {
    // hour max 23: type '3' on empty → 3*10=30>23, advance:true
    const r = typeIntoSection(hourField!, '', '3');
    expect(r).toEqual({ value: '3', advance: true });
  });

  it('appending digit completes section → advance:true', () => {
    // hour max 23, current '2', type '3' → '23', length===maxLen → advance:true
    const r = typeIntoSection(hourField!, '2', '3');
    expect(r).toEqual({ value: '23', advance: true });
  });

  it('appending digit does NOT advance when still partial', () => {
    // minute max 59, current '3', type '0' → '30', length===maxLen → advance:true
    // But with a 4-digit year: current '2', type '0' → '20', not full yet (maxLen 4)
    const yearParts = resolveMask(varDateMask)!;
    const yearField = fieldList(yearParts)[2]!;
    const r = typeIntoSection(yearField, '2', '0');
    expect(r).toEqual({ value: '20', advance: false });
  });

  it('advance:true when appended value length equals maxLen', () => {
    // minute field maxLen=2: '3'+'5' → '35', length===2 → advance true
    const r = typeIntoSection(minuteField!, '3', '5');
    expect(r).toEqual({ value: '35', advance: true });
  });

  it('advance:true when value*10 > max (single overflow sentinel)', () => {
    // minute max 59: type '6' on empty → 6*10=60>59 → advance true
    const r = typeIntoSection(minuteField!, '', '6');
    expect(r).toEqual({ value: '6', advance: true });
  });

  it('fresh-replace: typing into a COMPLETE section starts fresh', () => {
    // month max 12, current '12' (complete, length===maxLen), type '3'
    // '3' alone: 3*10=30>12, so advance:true
    const r = typeIntoSection(monthField!, '12', '3');
    expect(r).toEqual({ value: '3', advance: true });
  });

  it('fresh-replace: complete section replaced, advance false if not overflowing', () => {
    // hour max 23, current '23' (complete), type '2'
    // '2' alone: 2*10=20<=23, so advance:false
    const r = typeIntoSection(hourField!, '23', '2');
    expect(r).toEqual({ value: '2', advance: false });
  });

  it('clamps: appending would exceed max → treat as fresh start', () => {
    // minute max 59, current '5', type '9' → '59' is valid, not clamped
    expect(typeIntoSection(minuteField!, '5', '9')).toEqual({ value: '59', advance: true });
    // minute max 59, current '6', type '5' → '65'>59 → restart with '5'
    // '5'*10=50<=59 so advance:false
    const r = typeIntoSection(minuteField!, '6', '5');
    expect(r).toEqual({ value: '5', advance: false });
  });

  it('variable field restart that overflows also advances', () => {
    // month (min 1, max 12, maxLen 2, pad false), current '1', type '3' → '13'
    // exceeds max 12 → restart with '3'; 3*10=30>12 → advance:true
    const r = typeIntoSection(monthField!, '1', '3');
    expect(r).toEqual({ value: '3', advance: true });
  });

  it('two-char completion via value*10>max sentinel (not by maxLen)', () => {
    // minute (max 59, maxLen 2), current '5', type '0' → '50'; 50*10=500>59 →
    // complete via the sentinel even though length 2 also satisfies maxLen
    const r = typeIntoSection(minuteField!, '5', '0');
    expect(r).toEqual({ value: '50', advance: true });
  });

  it('rejects a single digit that is itself out of range (tiny field max<10)', () => {
    // field min 0 max 5 maxLen 1: '9' can never be valid → null; '4' → 4*10=40>5
    const tinyField = fieldList(
      resolveMask([{ kind: 'number', segment: 'x', min: 0, max: 5, length: 1, placeholder: '0' }])!
    )[0]!;
    expect(typeIntoSection(tinyField, '', '9')).toBeNull();
    expect(typeIntoSection(tinyField, '', '4')).toEqual({ value: '4', advance: true });
  });

  it('does NOT pad the returned value while typing', () => {
    // hour fixed pad, type '3' → returns '3' not '03'
    const r = typeIntoSection(hourField!, '', '3');
    expect(r!.value).toBe('3');
    expect(r!.value).not.toBe('03');
  });

  describe('enum field', () => {
    it('matches by case-insensitive first char and returns the full value with advance:true', () => {
      const r = typeIntoSection(enumMonthField!, '', 'j');
      expect(r).toEqual({ value: 'Jan', advance: true });
    });

    it('matches uppercase char case-insensitively', () => {
      const r = typeIntoSection(enumMonthField!, '', 'F');
      expect(r).toEqual({ value: 'Feb', advance: true });
    });

    it('returns null for a char that does not match any value first char', () => {
      expect(typeIntoSection(enumMonthField!, '', 'z')).toBeNull();
    });

    it('matching replaces regardless of current value (always advance:true)', () => {
      const r = typeIntoSection(enumMonthField!, 'Mar', 'o');
      expect(r).toEqual({ value: 'Oct', advance: true });
    });
  });
});

// ---- stepSection ----

describe('stepSection', () => {
  const timeParts = resolveMask(timeMask)!; // HH:MM fixed, pad
  const [hourField, minuteField] = fieldList(timeParts);

  const varDateParts = resolveMask(varDateMask)!;
  const [monthField] = fieldList(varDateParts); // min:1 max:12 no pad

  const enumParts = resolveMask(dateEnumMask)!;
  const [enumMonthField] = fieldList(enumParts);

  describe('number field', () => {
    it('empty → min (not min+dir)', () => {
      // First ArrowUp on empty hour: yields min=0, not 1
      expect(stepSection(hourField!, '', 1)).toBe('00'); // padded
    });

    it('empty → min also for ArrowDown', () => {
      expect(stepSection(hourField!, '', -1)).toBe('00');
    });

    it('increments by 1', () => {
      expect(stepSection(hourField!, '05', 1)).toBe('06');
    });

    it('decrements by 1', () => {
      expect(stepSection(hourField!, '05', -1)).toBe('04');
    });

    it('wraps max → min on increment', () => {
      expect(stepSection(hourField!, '23', 1)).toBe('00');
    });

    it('wraps min → max on decrement', () => {
      expect(stepSection(hourField!, '00', -1)).toBe('23');
    });

    it('returns padded value when field.pad is true', () => {
      expect(stepSection(hourField!, '09', 1)).toBe('10');
      expect(stepSection(minuteField!, '01', 1)).toBe('02');
      // Single digit should be padded
      expect(stepSection(hourField!, '00', 1)).toBe('01');
    });

    it('returns unpadded value when field.pad is false', () => {
      // monthField has no length → pad:false
      expect(stepSection(monthField!, '9', 1)).toBe('10');
      expect(stepSection(monthField!, '12', 1)).toBe('1'); // wraps, no pad
      expect(stepSection(monthField!, '1', -1)).toBe('12'); // wraps, no pad
    });

    it('empty on non-padded field → min unpadded', () => {
      expect(stepSection(monthField!, '', 1)).toBe('1');
    });
  });

  describe('enum field', () => {
    it('empty → first value on dir:1', () => {
      expect(stepSection(enumMonthField!, '', 1)).toBe('Jan');
    });

    it('empty → last value on dir:-1', () => {
      expect(stepSection(enumMonthField!, '', -1)).toBe('Dec');
    });

    it('cycles forward', () => {
      expect(stepSection(enumMonthField!, 'Jan', 1)).toBe('Feb');
      expect(stepSection(enumMonthField!, 'Feb', 1)).toBe('Mar');
    });

    it('cycles backward', () => {
      expect(stepSection(enumMonthField!, 'Mar', -1)).toBe('Feb');
      expect(stepSection(enumMonthField!, 'Jan', -1)).toBe('Dec');
    });

    it('wraps at end forward', () => {
      expect(stepSection(enumMonthField!, 'Dec', 1)).toBe('Jan');
    });

    it('case-insensitive current value lookup', () => {
      expect(stepSection(enumMonthField!, 'jan', 1)).toBe('Feb');
    });

    it('not-found current → first (dir:1) or last (dir:-1)', () => {
      expect(stepSection(enumMonthField!, 'Unknown', 1)).toBe('Jan');
      expect(stepSection(enumMonthField!, 'Unknown', -1)).toBe('Dec');
    });
  });
});

// ---- isSectionComplete ----

describe('isSectionComplete', () => {
  const timeParts = resolveMask(timeMask)!;
  const [hourField, minuteField] = fieldList(timeParts);

  const enumParts = resolveMask(dateEnumMask)!;
  const [enumMonthField] = fieldList(enumParts);

  it('empty string → false for any field kind', () => {
    expect(isSectionComplete(hourField!, '')).toBe(false);
    expect(isSectionComplete(enumMonthField!, '')).toBe(false);
  });

  it('number: length===maxLen → true', () => {
    expect(isSectionComplete(hourField!, '23')).toBe(true);
    expect(isSectionComplete(minuteField!, '59')).toBe(true);
    expect(isSectionComplete(hourField!, '00')).toBe(true);
  });

  it('number: value*10 > max → true (overflow sentinel)', () => {
    // hour max 23: '3'*10=30>23 → complete
    expect(isSectionComplete(hourField!, '3')).toBe(true);
    // minute max 59: '6'*10=60>59 → complete
    expect(isSectionComplete(minuteField!, '6')).toBe(true);
  });

  it('number: partial value not yet overflowing → false', () => {
    // '2' → 2*10=20<=23, not length 2 → false
    expect(isSectionComplete(hourField!, '2')).toBe(false);
    expect(isSectionComplete(minuteField!, '5')).toBe(false);
  });

  it('enum: value in values list → true', () => {
    expect(isSectionComplete(enumMonthField!, 'Jan')).toBe(true);
    expect(isSectionComplete(enumMonthField!, 'Dec')).toBe(true);
  });

  it('enum: value not in values list → false', () => {
    expect(isSectionComplete(enumMonthField!, 'jan')).toBe(false); // case-sensitive
    expect(isSectionComplete(enumMonthField!, 'Xyz')).toBe(false);
  });
});

// ---- isComplete ----

describe('isComplete', () => {
  const timeParts = resolveMask(timeMask)!;
  const varDateParts = resolveMask(varDateMask)!;
  const enumParts = resolveMask(dateEnumMask)!;

  it('all fields complete → true', () => {
    expect(isComplete(timeParts, ['23', '59'])).toBe(true);
    expect(isComplete(timeParts, ['00', '00'])).toBe(true);
  });

  it('any field empty → false', () => {
    expect(isComplete(timeParts, ['23', ''])).toBe(false);
    expect(isComplete(timeParts, ['', '59'])).toBe(false);
    expect(isComplete(timeParts, [])).toBe(false);
  });

  it('partial number field (not yet complete) → false', () => {
    expect(isComplete(timeParts, ['2', '30'])).toBe(false); // hour '2' not complete
  });

  it('variable fields complete → true', () => {
    // month '3' → 3*10=30>12 → complete; day '5' → 5*10=50>31 → complete; year '2026' → len===4
    expect(isComplete(varDateParts, ['3', '5', '2026'])).toBe(true);
  });

  it('empty parts list → false', () => {
    expect(isComplete([], [])).toBe(false);
  });

  it('with enum: partial → false, all complete → true', () => {
    expect(isComplete(enumParts, ['Jan', '2026'])).toBe(true);
    expect(isComplete(enumParts, ['Jan', ''])).toBe(false);
    expect(isComplete(enumParts, ['', '2026'])).toBe(false);
  });
});

// ---- serialize ----

describe('serialize', () => {
  const timeParts = resolveMask(timeMask)!;
  const varDateParts = resolveMask(varDateMask)!;
  const enumParts = resolveMask(dateEnumMask)!;

  it('pads padded number fields and appends separators verbatim', () => {
    expect(serialize(timeParts, ['9', '30'])).toBe('09:30');
    expect(serialize(timeParts, ['23', '59'])).toBe('23:59');
  });

  it('does not pad variable (no-pad) number fields', () => {
    // month and day are variable in varDateMask (no length)
    expect(serialize(varDateParts, ['1', '5', '2026'])).toBe('1/5/2026');
    expect(serialize(varDateParts, ['12', '31', '2026'])).toBe('12/31/2026');
  });

  it('year (4-digit fixed) is padded', () => {
    expect(serialize(varDateParts, ['1', '1', '26'])).toBe('1/1/0026');
  });

  it('serializes enum fields verbatim', () => {
    expect(serialize(enumParts, ['Jan', '2026'])).toBe('Jan 2026');
    expect(serialize(enumParts, ['Dec', '0001'])).toBe('Dec 0001');
  });
});

// ---- composeDisplay ----

describe('composeDisplay', () => {
  const timeParts = resolveMask(timeMask)!;
  const enumParts = resolveMask(dateEnumMask)!;
  const varDateParts = resolveMask(varDateMask)!;

  it('all empty → placeholder tokens for fields, sep tokens for separators', () => {
    const tokens = composeDisplay(timeParts, ['', '']);
    expect(tokens).toEqual([
      { kind: 'section', ord: 0, text: 'HH', placeholder: true },
      { kind: 'sep', text: ':' },
      { kind: 'section', ord: 1, text: 'MM', placeholder: true },
    ]);
  });

  it('filled number (padded) → padded text, placeholder:false (no activeOrd)', () => {
    const tokens = composeDisplay(timeParts, ['9', '30']);
    expect(tokens).toEqual([
      { kind: 'section', ord: 0, text: '09', placeholder: false },
      { kind: 'sep', text: ':' },
      { kind: 'section', ord: 1, text: '30', placeholder: false },
    ]);
  });

  it('ord is 0-based field index (NOT part index)', () => {
    // parts: [field0, sep, field1] → ords 0 and 1
    const tokens = composeDisplay(timeParts, ['', '']);
    const fields = tokens.filter(
      (t): t is { kind: 'section'; ord: number; text: string; placeholder: boolean } =>
        t.kind === 'section'
    );
    expect(fields[0]).toMatchObject({ ord: 0 });
    expect(fields[1]).toMatchObject({ ord: 1 });
  });

  it('partial: filled section has its value (padded), empty section has placeholder (no activeOrd)', () => {
    const tokens = composeDisplay(timeParts, ['9', '']);
    expect(tokens[0]).toMatchObject({ kind: 'section', text: '09', placeholder: false });
    expect(tokens[2]).toMatchObject({ kind: 'section', text: 'MM', placeholder: true });
  });

  it('enum field: filled → text is the value', () => {
    const tokens = composeDisplay(enumParts, ['Jan', '2026']);
    expect(tokens[0]).toMatchObject({ kind: 'section', text: 'Jan', placeholder: false });
    expect(tokens[2]).toMatchObject({ kind: 'section', text: '2026', placeholder: false });
  });

  it('enum field: empty → shows placeholder', () => {
    // The enum field placeholder is derived from max value length ('-'.repeat(maxLen))
    const tokens = composeDisplay(enumParts, ['', '']);
    expect(tokens[0]).toMatchObject({ kind: 'section', placeholder: true });
    expect((tokens[0] as { text: string }).text.length).toBeGreaterThan(0);
  });

  it('separators pass through verbatim', () => {
    const tokens = composeDisplay(timeParts, ['', '']);
    const seps = tokens.filter((t): t is { kind: 'sep'; text: string } => t.kind === 'sep');
    expect(seps).toEqual([{ kind: 'sep', text: ':' }]);
  });

  // ---- active-section padding rule ----

  describe('active section padding rule (activeOrd provided)', () => {
    // varDateMask: month(ord 0, no pad), day(ord 1, no pad), year(ord 2, pad len 4)
    // timeMask: hour(ord 0, pad len 2), minute(ord 1, pad len 2)

    it('no activeOrd → pads all non-empty padded fields (existing behaviour preserved)', () => {
      // hour='9' without activeOrd → '09'
      const tokens = composeDisplay(timeParts, ['9', '']);
      const hourToken = tokens[0];
      expect(hourToken).toMatchObject({ kind: 'section', text: '09', placeholder: false });
    });

    it('year active + incomplete → renders raw digits, not padded', () => {
      // year ordinal=2 in varDateMask; value '2' is incomplete (length 1 < 4, 2*10=20≤9999)
      const tokens = composeDisplay(varDateParts, ['', '', '2'], 2);
      const yearToken = tokens[4]; // parts: [month, '/', day, '/', year]
      expect(yearToken).toMatchObject({ kind: 'section', ord: 2, text: '2', placeholder: false });
    });

    it('year active + complete → renders padded value', () => {
      // year='2025', length===4 → complete → should still pad (padStart is no-op for len 4)
      const tokens = composeDisplay(varDateParts, ['', '', '2025'], 2);
      const yearToken = tokens[4];
      expect(yearToken).toMatchObject({
        kind: 'section',
        ord: 2,
        text: '2025',
        placeholder: false,
      });
    });

    it('year NOT active and non-empty → padded', () => {
      // active=0 (month), year='2' → non-active padded field → '0002'
      const tokens = composeDisplay(varDateParts, ['', '', '2'], 0);
      const yearToken = tokens[4];
      expect(yearToken).toMatchObject({
        kind: 'section',
        ord: 2,
        text: '0002',
        placeholder: false,
      });
    });

    it('hour active + "5" (auto-completes, 5*10=50>23) → complete → padded "05"', () => {
      // hour ordinal=0 in timeMask; '5': 5*10=50>23 → isSectionComplete=true → pad
      const tokens = composeDisplay(timeParts, ['5', ''], 0);
      const hourToken = tokens[0];
      expect(hourToken).toMatchObject({ kind: 'section', ord: 0, text: '05', placeholder: false });
    });

    it('minute active + "3" (incomplete, 3*10=30≤59) → raw "3"', () => {
      // minute ordinal=1 in timeMask; '3': 3*10=30≤59, length 1 < 2 → incomplete → raw
      const tokens = composeDisplay(timeParts, ['', '3'], 1);
      const minuteToken = tokens[2];
      expect(minuteToken).toMatchObject({ kind: 'section', ord: 1, text: '3', placeholder: false });
    });

    it('minute active + "34" (complete, length===maxLen) → padded "34"', () => {
      const tokens = composeDisplay(timeParts, ['', '34'], 1);
      const minuteToken = tokens[2];
      expect(minuteToken).toMatchObject({
        kind: 'section',
        ord: 1,
        text: '34',
        placeholder: false,
      });
    });

    it('minute NOT active and non-empty "3" → padded "03"', () => {
      // active=0 (hour), minute='3' → non-active → padded
      const tokens = composeDisplay(timeParts, ['', '3'], 0);
      const minuteToken = tokens[2];
      expect(minuteToken).toMatchObject({
        kind: 'section',
        ord: 1,
        text: '03',
        placeholder: false,
      });
    });

    it('enum field is unaffected by activeOrd (always verbatim)', () => {
      // enum month is ord=0, active=0; value 'Jan' → still 'Jan' (enum, not a padded number)
      const tokens = composeDisplay(enumParts, ['Jan', '2026'], 0);
      expect(tokens[0]).toMatchObject({ kind: 'section', text: 'Jan', placeholder: false });
    });

    it('non-padded number field is unaffected by activeOrd (always raw)', () => {
      // varDateMask month(ord=0, pad=false); value '1', active=0 → always raw
      const tokens = composeDisplay(varDateParts, ['1', '', ''], 0);
      expect(tokens[0]).toMatchObject({ kind: 'section', ord: 0, text: '1', placeholder: false });
    });
  });
});

// ---- paste (kept, must still pass) ----

describe('paste', () => {
  const f = resolveMask(timeMask)!;

  it('fills from digits, separators optional', () => {
    expect(paste(f, '1234')!.values).toEqual(['12', '34']);
    expect(paste(f, '12:34')!.values).toEqual(['12', '34']);
  });

  it('rejects out-of-range', () => {
    expect(paste(f, '2534')).toBeNull(); // hour 25 > 23
    expect(paste(f, '1275')).toBeNull(); // minute 75 > 59
  });

  it('partial paste fills what it can', () => {
    expect(paste(f, '12')!.values).toEqual(['12', '']);
  });

  describe('variable-length masks', () => {
    const v = resolveMask(varHourMask)!;

    it('splits on the separator for a variable hour', () => {
      expect(paste(v, '1:30')!.values).toEqual(['1', '30']);
      expect(paste(v, '11:30')!.values).toEqual(['11', '30']);
    });

    it('still packs greedily when no separator is present', () => {
      expect(paste(v, '0930')!.values).toEqual(['09', '30']);
    });
  });
});

// ---- deserialize (kept, must still pass) ----

describe('deserialize', () => {
  const f = resolveMask(timeMask)!;
  const v = resolveMask(varHourMask)!;
  const both = resolveMask(varBothMask)!;
  const date = resolveMask(varDateMask)!;

  it('splits an external value back into fields', () => {
    expect(deserialize(f, '08:45')).toEqual(['08', '45']);
  });

  it('splits a variable hour on the separator', () => {
    expect(deserialize(v, '1:30')).toEqual(['1', '30']);
    expect(deserialize(v, '9:5')).toEqual(['9', '5']);
  });

  it('splits when both fields are variable', () => {
    expect(deserialize(both, '1:2')).toEqual(['1', '2']);
  });

  it('splits a non-padded date on separators', () => {
    expect(deserialize(date, '1/2/2026')).toEqual(['1', '2', '2026']);
  });

  it('returns a sane prefix for an out-of-range external value (no garbage)', () => {
    expect(deserialize(f, '25:00')).toEqual(['', '']);
  });
});

// ---- nearestSectionIndex ----

describe('nearestSectionIndex', () => {
  // Three sections laid out left→right with gaps between them.
  const rects = [
    { left: 0, right: 20 },
    { left: 30, right: 50 },
    { left: 60, right: 80 },
  ];

  it('returns -1 for an empty list', () => {
    expect(nearestSectionIndex([], 10)).toBe(-1);
  });

  it('clientX left of the first section → 0', () => {
    expect(nearestSectionIndex(rects, -100)).toBe(0);
    expect(nearestSectionIndex(rects, 0)).toBe(0); // exact left edge
  });

  it('clientX right of the last section → last index', () => {
    expect(nearestSectionIndex(rects, 1000)).toBe(2);
    expect(nearestSectionIndex(rects, 80)).toBe(2); // exact right edge
  });

  it('clientX inside a section → that section', () => {
    expect(nearestSectionIndex(rects, 10)).toBe(0);
    expect(nearestSectionIndex(rects, 40)).toBe(1);
    expect(nearestSectionIndex(rects, 70)).toBe(2);
  });

  it('in a gap, picks the nearer adjacent section', () => {
    // gap between section 0 (right 20) and section 1 (left 30); midpoint 25
    expect(nearestSectionIndex(rects, 23)).toBe(0); // closer to section 0
    expect(nearestSectionIndex(rects, 27)).toBe(1); // closer to section 1
  });

  it('on a gap midpoint, ties go to the earlier section', () => {
    // midpoint 25: dist to 0 is 5, dist to 1 is 5 → first-seen (0) wins
    expect(nearestSectionIndex(rects, 25)).toBe(0);
  });

  it('single section → always that section', () => {
    const one = [{ left: 10, right: 20 }];
    expect(nearestSectionIndex(one, -5)).toBe(0);
    expect(nearestSectionIndex(one, 15)).toBe(0);
    expect(nearestSectionIndex(one, 99)).toBe(0);
  });
});

// ---- robustness / range validation (CodeRabbit findings) ----

describe('range + input validation', () => {
  const dateParts = resolveMask(varDateMask)!; // month(min1), day(min1), year
  const [monthField] = fieldList(dateParts);
  const timeParts = resolveMask(timeMask)!; // hour(min0), minute(min0)
  const [hourField] = fieldList(timeParts);

  it('resolveMask does not throw on an empty enum values array', () => {
    expect(() => resolveMask([{ kind: 'enum', segment: 'x', values: [] }])).not.toThrow();
  });

  it('typeIntoSection rejects a non-single-character input', () => {
    expect(typeIntoSection(hourField!, '', '12')).toBeNull();
    expect(typeIntoSection(hourField!, '', 'a1')).toBeNull();
  });

  it('typeIntoSection rejects a full-width value below the field minimum', () => {
    // month min 1: typing 0 then 0 → "00" is below min → rejected (stays "0")
    expect(typeIntoSection(monthField!, '0', '0')).toBeNull();
  });

  it('isSectionComplete is false for a value below min, true for in-range', () => {
    expect(isSectionComplete(monthField!, '00')).toBe(false); // 0 < min 1
    expect(isSectionComplete(hourField!, '00')).toBe(true); // 0 >= min 0
    expect(isSectionComplete(monthField!, '01')).toBe(true);
  });

  it('paste rejects trailing unconsumed input', () => {
    expect(paste(timeParts, '12:34abc')).toBeNull();
    expect(paste(timeParts, '12:x')).toBeNull();
  });

  it('deserialize keeps the best-effort prefix despite a trailing tail', () => {
    expect(deserialize(timeParts, '12:34abc')).toEqual(['12', '34']);
    expect(deserialize(timeParts, '12:x')).toEqual(['12', '']);
  });
});
