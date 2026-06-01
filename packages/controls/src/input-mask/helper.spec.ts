import { describe, expect, it, vi } from 'vitest';

import { MaskHelper } from './helper';

import type { InputMaskCfg, MaskResolution } from './types';

function createHelper() {
  const calls: { value: string; position: number }[] = [];
  const announcements: string[] = [];
  const helper = new MaskHelper({
    updateValue: (_el, value, position) => calls.push({ value, position }),
    announce: msg => announcements.push(msg),
  });
  return { helper, calls, announcements };
}

function timeMask(): InputMaskCfg {
  return [
    { kind: 'number', segment: 'hour', min: 0, max: 23, length: 2, placeholder: 'HH' },
    ':',
    { kind: 'number', segment: 'minute', min: 0, max: 59, length: 2, placeholder: 'MM' },
  ];
}

function time12Mask(): InputMaskCfg {
  return [
    { kind: 'number', segment: 'hour', min: 1, max: 12, length: 2, placeholder: 'HH' },
    ':',
    { kind: 'number', segment: 'minute', min: 0, max: 59, length: 2, placeholder: 'MM' },
    ' ',
    { kind: 'enum', segment: 'period', values: ['AM', 'PM'], length: 2 },
  ];
}

function dateMask(): InputMaskCfg {
  return [
    { kind: 'number', segment: 'day', min: 1, max: 31, length: 2, placeholder: 'DD' },
    '/',
    { kind: 'number', segment: 'month', min: 1, max: 12, length: 2, placeholder: 'MM' },
    '/',
    { kind: 'number', segment: 'year', min: 1900, max: 2099, length: 4, placeholder: 'YYYY' },
  ];
}

describe('MaskHelper', () => {
  describe('ensureMask', () => {
    it('should return null for null/empty input', () => {
      const { helper } = createHelper();
      expect(helper.ensureMask(null)).toBeNull();
      expect(helper.ensureMask('')).toBeNull();
    });

    it('should resolve named masks from MASKS registry', () => {
      const { helper } = createHelper();
      const result = helper.ensureMask('phoneNumber');
      expect(result).not.toBeNull();
      expect(result!.entries.length).toBeGreaterThan(0);
    });

    it('should resolve named masks from DATE_TIME_MASKS registry', () => {
      const { helper } = createHelper();
      const result = helper.ensureMask('time');
      expect(result).not.toBeNull();
      expect(result!.segments.size).toBeGreaterThan(0);
    });

    it('should parse string mask patterns (0=digit, A=letter, *=alphanumeric)', () => {
      const { helper } = createHelper();
      const result = helper.ensureMask('000-AAA');
      expect(result).not.toBeNull();
      expect(result!.entries).toHaveLength(7);
      expect(result!.segments.size).toBe(0);

      // Position 0: digit
      const digit = result!.entries[0];
      expect(typeof digit).not.toBe('string');
      if (typeof digit !== 'string') {
        expect(digit.accepts.test('5')).toBe(true);
        expect(digit.accepts.test('a')).toBe(false);
      }

      // Position 3: separator
      expect(result!.entries[3]).toBe('-');

      // Position 4: letter
      const letter = result!.entries[4];
      if (typeof letter !== 'string') {
        expect(letter.accepts.test('a')).toBe(true);
        expect(letter.accepts.test('5')).toBe(false);
      }
    });

    it('should expand NumberSegment into positional entries', () => {
      const { helper } = createHelper();
      const result = helper.ensureMask(timeMask());
      expect(result).not.toBeNull();

      // HH:MM → 2 entries + ':' + 2 entries = 5
      expect(result!.entries).toHaveLength(5);
      expect(result!.entries[2]).toBe(':');

      // First entry: digit with placeholder 'H'
      const entry = result!.entries[0];
      expect(typeof entry).not.toBe('string');
      if (typeof entry !== 'string') {
        expect(entry.placeholder).toBe('H');
        expect(entry.accepts.test('5')).toBe(true);
        expect(entry.accepts.test('a')).toBe(false);
        expect(entry.default).toBe('0');
      }
    });

    it('should expand EnumSegment into positional entries with case-insensitive accepts', () => {
      const { helper } = createHelper();
      const result = helper.ensureMask(time12Mask());
      expect(result).not.toBeNull();

      // Find the enum positions (after the space at index 5)
      // HH : MM ' ' AM → positions 0,1, 2, 3,4, 5, 6,7
      const enumEntry0 = result!.entries[6];
      expect(typeof enumEntry0).not.toBe('string');
      if (typeof enumEntry0 !== 'string') {
        expect(enumEntry0.accepts.test('A')).toBe(true);
        expect(enumEntry0.accepts.test('a')).toBe(true);
        expect(enumEntry0.accepts.test('P')).toBe(true);
        expect(enumEntry0.accepts.test('p')).toBe(true);
        expect(enumEntry0.accepts.test('X')).toBe(false);
        expect(enumEntry0.default).toBe('A');
      }
    });

    it('should build segment map with correct positions', () => {
      const { helper } = createHelper();
      const result = helper.ensureMask(timeMask())!;

      expect(result.segments.size).toBe(2);

      const hour = result.segments.get('hour')!;
      expect(hour.positions).toEqual({ start: 0, end: 1 });
      expect(hour.config.kind).toBe('number');

      const minute = result.segments.get('minute')!;
      expect(minute.positions).toEqual({ start: 3, end: 4 });
    });

    it('should build correct segment positions for date mask', () => {
      const { helper } = createHelper();
      const result = helper.ensureMask(dateMask())!;

      expect(result.segments.size).toBe(3);

      const day = result.segments.get('day')!;
      expect(day.positions).toEqual({ start: 0, end: 1 });

      const month = result.segments.get('month')!;
      expect(month.positions).toEqual({ start: 3, end: 4 });

      const year = result.segments.get('year')!;
      expect(year.positions).toEqual({ start: 6, end: 9 });
    });

    it('should warn on enum segments with duplicate first characters', () => {
      const { helper } = createHelper();
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      helper.ensureMask([{ kind: 'enum', segment: 'test', values: ['Mon', 'Mar'], length: 3 }]);

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('duplicate first char'));
      warnSpy.mockRestore();
    });
  });

  describe('getSegmentAtPosition', () => {
    it('should return segment when cursor is within segment bounds', () => {
      const { helper } = createHelper();
      const resolution = helper.ensureMask(timeMask())!;

      const seg = helper.getSegmentAtPosition(0, resolution.segments);
      expect(seg).not.toBeNull();
      expect(seg!.config.segment).toBe('hour');

      const seg2 = helper.getSegmentAtPosition(1, resolution.segments);
      expect(seg2!.config.segment).toBe('hour');

      const seg3 = helper.getSegmentAtPosition(3, resolution.segments);
      expect(seg3!.config.segment).toBe('minute');
    });

    it('should return null for separator positions (non-fuzzy)', () => {
      const { helper } = createHelper();
      const resolution = helper.ensureMask(timeMask())!;

      const seg = helper.getSegmentAtPosition(2, resolution.segments);
      expect(seg).toBeNull();
    });

    it('should return null for position past end (non-fuzzy)', () => {
      const { helper } = createHelper();
      const resolution = helper.ensureMask(timeMask())!;

      const seg = helper.getSegmentAtPosition(5, resolution.segments);
      expect(seg).toBeNull();
    });

    it('should return closest preceding segment in fuzzy mode', () => {
      const { helper } = createHelper();
      const resolution = helper.ensureMask(timeMask())!;

      // Position 2 (separator ':') → closest preceding = hour (end: 1)
      const seg = helper.getSegmentAtPosition(2, resolution.segments, true);
      expect(seg).not.toBeNull();
      expect(seg!.config.segment).toBe('hour');

      // Position 5 (past end) → closest preceding = minute (end: 4)
      const seg2 = helper.getSegmentAtPosition(5, resolution.segments, true);
      expect(seg2).not.toBeNull();
      expect(seg2!.config.segment).toBe('minute');
    });
  });

  describe('_tryPaste (via handleBeforeInput)', () => {
    function pasteInto(
      helper: MaskHelper,
      resolution: MaskResolution,
      text: string,
      currentValue = ''
    ) {
      const calls: { value: string; position: number }[] = [];
      const origHelper = createHelper();
      const h = new MaskHelper({
        updateValue: (_el, value, position) => calls.push({ value, position }),
      });
      const res = h.ensureMask(timeMask())!;

      // Use the passed resolution instead
      const el = {
        value: currentValue,
        selectionStart: 0,
        selectionEnd: 0,
      } as unknown as HTMLInputElement;

      const event = {
        target: el,
        data: text,
        inputType: 'insertFromPaste',
        preventDefault: vi.fn(),
      } as unknown as InputEvent;

      h.handleBeforeInput(event, resolution);
      return { calls, prevented: event.preventDefault };
    }

    it('should accept valid paste for 24h time', () => {
      const { helper } = createHelper();
      const resolution = helper.ensureMask(timeMask())!;
      const el = { value: '', selectionStart: 0, selectionEnd: 0 } as unknown as HTMLInputElement;
      const prevented = vi.fn();
      const event = {
        target: el,
        data: '1234',
        inputType: 'insertFromPaste',
        preventDefault: prevented,
      } as unknown as InputEvent;

      helper.handleBeforeInput(event, resolution);
      expect(prevented).toHaveBeenCalled();
    });

    it('should accept paste with separators', () => {
      const { helper, calls } = createHelper();
      const resolution = helper.ensureMask(timeMask())!;
      const el = { value: '', selectionStart: 0, selectionEnd: 0 } as unknown as HTMLInputElement;
      const event = {
        target: el,
        data: '12:34',
        inputType: 'insertFromPaste',
        preventDefault: vi.fn(),
      } as unknown as InputEvent;

      helper.handleBeforeInput(event, resolution);
      expect(calls).toHaveLength(1);
      expect(calls[0]!.value).toBe('12:34');
    });

    it('should reject paste with out-of-range hour', () => {
      const { helper, calls } = createHelper();
      const resolution = helper.ensureMask(timeMask())!;
      const el = { value: '', selectionStart: 0, selectionEnd: 0 } as unknown as HTMLInputElement;
      const event = {
        target: el,
        data: '2534',
        inputType: 'insertFromPaste',
        preventDefault: vi.fn(),
      } as unknown as InputEvent;

      helper.handleBeforeInput(event, resolution);
      expect(calls).toHaveLength(0); // No updateValue called = rejected
    });

    it('should reject paste with out-of-range minute', () => {
      const { helper, calls } = createHelper();
      const resolution = helper.ensureMask(timeMask())!;
      const el = { value: '', selectionStart: 0, selectionEnd: 0 } as unknown as HTMLInputElement;
      const event = {
        target: el,
        data: '1275',
        inputType: 'insertFromPaste',
        preventDefault: vi.fn(),
      } as unknown as InputEvent;

      helper.handleBeforeInput(event, resolution);
      expect(calls).toHaveLength(0);
    });

    it('should reject paste with non-digit characters', () => {
      const { helper, calls } = createHelper();
      const resolution = helper.ensureMask(timeMask())!;
      const el = { value: '', selectionStart: 0, selectionEnd: 0 } as unknown as HTMLInputElement;
      const event = {
        target: el,
        data: 'ab:cd',
        inputType: 'insertFromPaste',
        preventDefault: vi.fn(),
      } as unknown as InputEvent;

      helper.handleBeforeInput(event, resolution);
      expect(calls).toHaveLength(0);
    });

    it('should accept paste for date mask', () => {
      const { helper, calls } = createHelper();
      const resolution = helper.ensureMask(dateMask())!;
      const el = { value: '', selectionStart: 0, selectionEnd: 0 } as unknown as HTMLInputElement;
      const event = {
        target: el,
        data: '15/06/2026',
        inputType: 'insertFromPaste',
        preventDefault: vi.fn(),
      } as unknown as InputEvent;

      helper.handleBeforeInput(event, resolution);
      expect(calls).toHaveLength(1);
      expect(calls[0]!.value).toBe('15/06/2026');
    });

    it('should accept paste without separators for date mask', () => {
      const { helper, calls } = createHelper();
      const resolution = helper.ensureMask(dateMask())!;
      const el = { value: '', selectionStart: 0, selectionEnd: 0 } as unknown as HTMLInputElement;
      const event = {
        target: el,
        data: '15062026',
        inputType: 'insertFromPaste',
        preventDefault: vi.fn(),
      } as unknown as InputEvent;

      helper.handleBeforeInput(event, resolution);
      expect(calls).toHaveLength(1);
      expect(calls[0]!.value).toBe('15/06/2026');
    });

    it('should reject date paste with day > 31', () => {
      const { helper, calls } = createHelper();
      const resolution = helper.ensureMask(dateMask())!;
      const el = { value: '', selectionStart: 0, selectionEnd: 0 } as unknown as HTMLInputElement;
      const event = {
        target: el,
        data: '32/01/2026',
        inputType: 'insertFromPaste',
        preventDefault: vi.fn(),
      } as unknown as InputEvent;

      helper.handleBeforeInput(event, resolution);
      expect(calls).toHaveLength(0);
    });

    it('should reject date paste with month > 12', () => {
      const { helper, calls } = createHelper();
      const resolution = helper.ensureMask(dateMask())!;
      const el = { value: '', selectionStart: 0, selectionEnd: 0 } as unknown as HTMLInputElement;
      const event = {
        target: el,
        data: '15/13/2026',
        inputType: 'insertFromPaste',
        preventDefault: vi.fn(),
      } as unknown as InputEvent;

      helper.handleBeforeInput(event, resolution);
      expect(calls).toHaveLength(0);
    });
  });

  describe('_validateNumberInput (via handleBeforeInput)', () => {
    function typeKey(
      helper: MaskHelper,
      resolution: MaskResolution,
      el: HTMLInputElement,
      key: string
    ) {
      const event = {
        target: el,
        data: key,
        inputType: 'insertText',
        preventDefault: vi.fn(),
      } as unknown as InputEvent;
      helper.handleBeforeInput(event, resolution);
      return event.preventDefault;
    }

    it('should accept valid first digit for hour (0-23)', () => {
      const { helper, calls } = createHelper();
      const resolution = helper.ensureMask(timeMask())!;
      const el = { value: '', selectionStart: 0, selectionEnd: 0 } as unknown as HTMLInputElement;

      const prevented = typeKey(helper, resolution, el, '1');
      expect(prevented).toHaveBeenCalled(); // Always prevents default (mask handles it)
      expect(calls).toHaveLength(1);
    });

    it('should auto-complete when digit only valid as left-padded', () => {
      const mask: InputMaskCfg = [
        { kind: 'number', segment: 'hour', min: 1, max: 12, length: 2, placeholder: 'HH' },
        ':',
        { kind: 'number', segment: 'minute', min: 0, max: 59, length: 2, placeholder: 'MM' },
      ];
      const { helper, calls } = createHelper();
      const resolution = helper.ensureMask(mask)!;
      const el = { value: '', selectionStart: 0, selectionEnd: 0 } as unknown as HTMLInputElement;

      typeKey(helper, resolution, el, '3');
      // 30-39 all > 12, but 03 is valid → autocomplete to '03'
      expect(calls).toHaveLength(1);
      expect(calls[0]!.value).toBe('03');
    });

    it('should reject final digit exceeding max', () => {
      const mask: InputMaskCfg = [
        { kind: 'number', segment: 'hour', min: 1, max: 12, length: 2, placeholder: 'HH' },
      ];
      const { helper, calls } = createHelper();
      const resolution = helper.ensureMask(mask)!;
      const el = { value: '1', selectionStart: 1, selectionEnd: 1 } as unknown as HTMLInputElement;

      typeKey(helper, resolution, el, '5');
      // 15 > 12 → reject
      expect(calls).toHaveLength(0);
    });

    it('should accept final digit within range', () => {
      const mask: InputMaskCfg = [
        { kind: 'number', segment: 'hour', min: 1, max: 12, length: 2, placeholder: 'HH' },
      ];
      const { helper, calls } = createHelper();
      const resolution = helper.ensureMask(mask)!;
      const el = { value: '1', selectionStart: 1, selectionEnd: 1 } as unknown as HTMLInputElement;

      typeKey(helper, resolution, el, '2');
      // 12 ≤ 12 → accept
      expect(calls).toHaveLength(1);
    });

    it('should reject digit below min for final position', () => {
      const mask: InputMaskCfg = [
        { kind: 'number', segment: 'hour', min: 1, max: 12, length: 2, placeholder: 'HH' },
      ];
      const { helper, calls } = createHelper();
      const resolution = helper.ensureMask(mask)!;
      const el = { value: '0', selectionStart: 1, selectionEnd: 1 } as unknown as HTMLInputElement;

      typeKey(helper, resolution, el, '0');
      // 00 < 1 → reject
      expect(calls).toHaveLength(0);
    });

    it('should reject year digit with no valid completions', () => {
      const mask: InputMaskCfg = [
        { kind: 'number', segment: 'year', min: 1900, max: 2099, length: 4, placeholder: 'YYYY' },
      ];
      const { helper, calls } = createHelper();
      const resolution = helper.ensureMask(mask)!;
      const el = { value: '', selectionStart: 0, selectionEnd: 0 } as unknown as HTMLInputElement;

      typeKey(helper, resolution, el, '3');
      // 3000-3999 all > 2099, and 0003 < 1900 → reject
      expect(calls).toHaveLength(0);
    });
  });

  describe('_incrementSegment (via handleKeyDown)', () => {
    function createEl(value: string, cursorPos: number) {
      return {
        value,
        selectionStart: cursorPos,
        selectionEnd: cursorPos,
        setSelectionRange: vi.fn(),
      } as unknown as HTMLInputElement;
    }

    function arrowKey(
      helper: MaskHelper,
      resolution: MaskResolution,
      el: HTMLInputElement,
      direction: 'ArrowUp' | 'ArrowDown'
    ) {
      const event = {
        target: el,
        key: direction,
        ctrlKey: false,
        metaKey: false,
        altKey: false,
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent;
      helper.handleKeyDown(event, resolution);
      return event.preventDefault;
    }

    it('should increment number segment', () => {
      const { helper, calls } = createHelper();
      const resolution = helper.ensureMask(timeMask())!;
      const el = createEl('12:30', 0);

      arrowKey(helper, resolution, el, 'ArrowUp');
      expect(calls).toHaveLength(1);
      expect(calls[0]!.value).toBe('13:30');
      expect(calls[0]!.position).toBe(0); // Cursor stays at segment start
    });

    it('should decrement number segment', () => {
      const { helper, calls } = createHelper();
      const resolution = helper.ensureMask(timeMask())!;
      const el = createEl('12:30', 0);

      arrowKey(helper, resolution, el, 'ArrowDown');
      expect(calls).toHaveLength(1);
      expect(calls[0]!.value).toBe('11:30');
    });

    it('should wrap around max → min', () => {
      const { helper, calls } = createHelper();
      const resolution = helper.ensureMask(timeMask())!;
      const el = createEl('23:30', 0);

      arrowKey(helper, resolution, el, 'ArrowUp');
      expect(calls[0]!.value).toBe('00:30');
    });

    it('should wrap around min → max', () => {
      const { helper, calls } = createHelper();
      const resolution = helper.ensureMask(timeMask())!;
      const el = createEl('00:30', 0);

      arrowKey(helper, resolution, el, 'ArrowDown');
      expect(calls[0]!.value).toBe('23:30');
    });

    it('should handle empty input by filling defaults first', () => {
      const { helper, calls } = createHelper();
      const resolution = helper.ensureMask(timeMask())!;
      const el = createEl('', 0);

      arrowKey(helper, resolution, el, 'ArrowUp');
      expect(calls).toHaveLength(1);
      // Empty → ensureFullValue fills '00:00' → increment hour → '01:00'
      expect(calls[0]!.value).toBe('01:00');
    });

    it('should cycle enum segment', () => {
      const { helper, calls } = createHelper();
      const resolution = helper.ensureMask(time12Mask())!;
      const el = createEl('12:30 AM', 6); // Cursor on enum

      arrowKey(helper, resolution, el, 'ArrowUp');
      expect(calls[0]!.value).toBe('12:30 PM');
    });

    it('should wrap enum segment', () => {
      const { helper, calls } = createHelper();
      const resolution = helper.ensureMask(time12Mask())!;
      const el = createEl('12:30 PM', 6);

      arrowKey(helper, resolution, el, 'ArrowUp');
      expect(calls[0]!.value).toBe('12:30 AM');
    });

    it('should use fuzzy matching for cursor on separator', () => {
      const { helper, calls } = createHelper();
      const resolution = helper.ensureMask(timeMask())!;
      const el = createEl('12:30', 2); // Cursor on ':'

      arrowKey(helper, resolution, el, 'ArrowUp');
      // Fuzzy match → hour segment (closest preceding)
      expect(calls[0]!.value).toBe('13:30');
    });

    it('should use fuzzy matching for cursor past end', () => {
      const { helper, calls } = createHelper();
      const resolution = helper.ensureMask(timeMask())!;
      const el = createEl('12:30', 5); // Past end

      arrowKey(helper, resolution, el, 'ArrowUp');
      // Fuzzy match → minute segment
      expect(calls[0]!.value).toBe('12:31');
    });

    it('should announce value change', () => {
      const { helper, announcements } = createHelper();
      const resolution = helper.ensureMask(timeMask())!;
      const el = createEl('12:30', 0);

      arrowKey(helper, resolution, el, 'ArrowUp');
      expect(announcements).toHaveLength(1);
      expect(announcements[0]).toBe('hour: 13');
    });
  });
});
