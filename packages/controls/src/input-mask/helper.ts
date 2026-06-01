import { MASKS } from './masks';
import { DATE_TIME_MASKS } from './masks-date-time';

import type {
  InputMaskCfg,
  InputMaskCfgResolved,
  MaskResolution,
  NumberSegment,
  ResolvedSegment,
} from './types';

// Interface for communicating with the parent component
type MaskData = {
  updateValue: (element: HTMLInputElement, value: string, position: number) => void;
  announce?: (message: string) => void;
};

/**
 * Helper class for handling masked input functionality
 */
export class MaskHelper {
  private readonly _data: MaskData;

  constructor(data: MaskData) {
    this._data = data;
  }

  /**
   * Ensure the mask is in the correct format
   * Converts string masks to TextFieldMaskCfg format
   * Returns null if no mask is provided
   */
  public ensureMask(mask: InputMaskCfg | string | null): MaskResolution | null {
    if (!mask) return null;
    if (typeof mask === 'string') {
      const named =
        MASKS[mask as keyof typeof MASKS] ?? DATE_TIME_MASKS[mask as keyof typeof DATE_TIME_MASKS];
      if (named) return this.ensureMask(named);
      // Convert string mask to TextFieldMaskCfg
      // 0 => digit, A => letter, * => alphanumeric
      const entries: InputMaskCfgResolved = mask.split('').map(char => {
        if (char === '0') {
          return { placeholder: char, accepts: /\d/, default: '0' };
        } else if (char === 'A') {
          return { placeholder: char, accepts: /[a-zA-Z]/, default: 'A' };
        } else if (char === '*') {
          return { placeholder: char, accepts: /[a-zA-Z0-9]/, default: 'A' };
        }
        return char;
      });
      return { entries, segments: new Map() };
    }

    // Process array mask — expand MaskSegment objects into entries
    const entries: InputMaskCfgResolved = [];
    const segments = new Map<string, ResolvedSegment>();

    for (const item of mask) {
      if (isMaskSegment(item)) {
        const start = entries.length;
        if (item.kind === 'number') {
          const expanded = this._expandNumberSegment(item as import('./types').NumberSegment);
          entries.push(...expanded);
        } else if (item.kind === 'enum') {
          const enumSeg = item as import('./types').EnumSegment;
          this._validateEnumSegment(enumSeg);
          const expanded = this._expandEnumSegment(enumSeg);
          entries.push(...expanded);
        }
        const end = entries.length - 1;
        segments.set(item.segment, { config: item, positions: { start, end } });
      } else {
        // string or InputMaskCfgEntry — pass through as-is
        entries.push(item);
      }
    }

    return { entries, segments };
  }

  /**
   * Handle key down events to manage special keys like Backspace and Delete
   */
  public handleKeyDown(event: KeyboardEvent, resolution: MaskResolution): void {
    const mask = resolution.entries;
    if (!mask || this._shouldIgnoreEvent(event)) {
      return;
    }
    const el = event.target as HTMLInputElement;
    const key = event.key;
    const currentPosition = el.selectionStart ?? 0;

    // Arrow Up/Down for segment increment/decrement
    if (key === 'ArrowUp' || key === 'ArrowDown') {
      const seg = this.getSegmentAtPosition(currentPosition, resolution.segments, true);
      if (seg) {
        event.preventDefault();
        const direction = key === 'ArrowUp' ? 1 : -1;
        this._incrementSegment(el, seg, direction, resolution);
        return;
      }
    }

    const selEnd = el.selectionEnd ?? 0;
    if (selEnd - currentPosition > 0) {
      return;
    }

    if (this._isSpecialKey(key)) {
      this._handleSpecialKey(event, el, key, currentPosition, mask);
    }
  }

  /**
   * Handle before input event to manage character input with mask validation
   */
  public handleBeforeInput(event: InputEvent, resolution: MaskResolution): void {
    const mask = resolution.entries;
    const el = event.target as HTMLInputElement;
    const key = event.data;
    const selStart = el.selectionStart ?? 0;
    const selEnd = el.selectionEnd ?? 0;

    // Paste, selection, and multi-character input handling for segment-based masks
    if (resolution.segments.size > 0) {
      if (event.inputType === 'insertFromPaste' || event.inputType === 'insertFromDrop') {
        event.preventDefault();
        const pastedText = key;
        if (pastedText) {
          this._tryPaste(el, pastedText, resolution);
        }
        return;
      }

      // Handle selection
      if (selEnd - selStart > 0) {
        const startSeg = this.getSegmentAtPosition(selStart, resolution.segments);
        const endSeg = this.getSegmentAtPosition(selEnd - 1, resolution.segments);

        // Cross-segment or no-segment selection: allow deletion, block typing
        if (!startSeg || !endSeg || startSeg !== endSeg) {
          if (!key) {
            // Deletion (Backspace/Delete/clear) — let it through
            return;
          }
          event.preventDefault();
          return;
        }

        // Single-segment selection: clear segment to defaults, reset cursor to segment start
        const seg = startSeg;
        const { start, end } = seg.positions;
        let defaultVal = '';
        for (let i = start; i <= end; i++) {
          const entry = mask[i];
          if (entry && typeof entry !== 'string') {
            defaultVal += entry.default;
          } else if (typeof entry === 'string') {
            defaultVal += entry;
          }
        }
        const newVal = el.value.slice(0, start) + defaultVal + el.value.slice(end + 1);
        el.value = newVal;
        el.setSelectionRange(start, start);
        // Fall through — the character input handler will process the keystroke at the new position
        if (!key) {
          event.preventDefault();
          return;
        }
        this._handleCharacterInput(event, el, key, start, resolution);
        return;
      }
    }

    const currentPosition = selStart;

    if (!key) {
      // If no key data, just return
      return;
    }

    // Route to appropriate handler based on key type
    if (!this._isSpecialKey(key)) {
      this._handleCharacterInput(event, el, key, currentPosition, resolution);
    }
  }

  /**
   * Get the resolved segment at a given cursor position, or null if not in a segment
   */
  public getSegmentAtPosition(
    cursorPos: number,
    segments: Map<string, ResolvedSegment>,
    fuzzy = false
  ): ResolvedSegment | null {
    let closest: ResolvedSegment | null = null;
    for (const seg of segments.values()) {
      if (cursorPos >= seg.positions.start && cursorPos <= seg.positions.end) {
        return seg;
      }
      if (fuzzy && cursorPos > seg.positions.end) {
        if (!closest || seg.positions.end > closest.positions.end) {
          closest = seg;
        }
      }
    }
    return fuzzy ? closest : null;
  }

  /**
   * Expand a NumberSegment into positional InputMaskCfgEntry array
   */
  private _expandNumberSegment(seg: import('./types').NumberSegment): InputMaskCfgResolved {
    const placeholder = seg.placeholder ?? '0'.repeat(seg.length);
    const result: InputMaskCfgResolved = [];
    for (let i = 0; i < seg.length; i++) {
      result.push({
        placeholder: placeholder[i] ?? '0',
        accepts: /^\d$/,
        default: '0',
      });
    }
    return result;
  }

  /**
   * Expand an EnumSegment into positional InputMaskCfgEntry array
   */
  private _expandEnumSegment(seg: import('./types').EnumSegment): InputMaskCfgResolved {
    const result: InputMaskCfgResolved = [];
    for (let i = 0; i < seg.length; i++) {
      const validChars = new Set<string>();
      for (const value of seg.values) {
        const ch = value[i];
        if (ch !== undefined) {
          validChars.add(ch);
        }
      }
      const chars = [...validChars].join('');
      const accepts = new RegExp(`^[${chars.replace(/[\]\\^-]/g, '\\$&')}]$`, 'i');
      const placeholder = seg.placeholder?.[i] ?? seg.values[0]?.[i] ?? '_';
      result.push({
        placeholder,
        accepts,
        default: seg.values[0]?.[i] ?? '_',
      });
    }
    return result;
  }

  /**
   * Validate an EnumSegment and warn on duplicate first chars
   */
  private _validateEnumSegment(seg: import('./types').EnumSegment): void {
    const firstChars = new Set<string>();
    for (const value of seg.values) {
      const firstChar = value[0];
      if (firstChar !== undefined) {
        if (firstChars.has(firstChar)) {
          console.warn(
            `[NgnInputMask] EnumSegment "${seg.segment}" has duplicate first char "${firstChar}" in values: ${seg.values.join(', ')}`
          );
        }
        firstChars.add(firstChar);
      }
    }
  }

  /**
   * Check if the event should be ignored (modifier keys)
   */
  private _shouldIgnoreEvent(event: KeyboardEvent): boolean {
    return event.ctrlKey || event.metaKey || event.altKey;
  }

  /**
   * Check if key is a special key (Backspace/Delete)
   */
  private _isSpecialKey(key: string): boolean {
    return key.length > 1;
  }

  /**
   * Handle special keys like Backspace and Delete
   */
  private _handleSpecialKey(
    event: KeyboardEvent,
    el: HTMLInputElement,
    key: string,
    currentPosition: number,
    mask: InputMaskCfgResolved
  ): void {
    if (key === 'Backspace' && currentPosition > 0) {
      const maskEntry = mask[currentPosition - 1];
      if (!maskEntry) {
        return;
      }
      // Get the default character for this position
      const defaultChar = typeof maskEntry === 'string' ? maskEntry : maskEntry.default;

      if (currentPosition === el.value.length) {
        return;
      }

      const newVal =
        el.value.slice(0, currentPosition - 1) + defaultChar + el.value.slice(currentPosition);

      this._data.updateValue(el, newVal, currentPosition - 1);
      event.preventDefault();
    } else if (key === 'Delete' && currentPosition < el.value.length) {
      const maskEntry = mask[currentPosition];
      if (!maskEntry) {
        return;
      }
      // Get the default character for this position
      const defaultChar = typeof maskEntry === 'string' ? maskEntry : maskEntry.default;
      const newVal =
        el.value.slice(0, currentPosition) + defaultChar + el.value.slice(currentPosition + 1);

      this._data.updateValue(el, newVal, currentPosition + 1);
      event.preventDefault();
    }
  }

  /**
   * Handle regular character input with mask validation
   */
  private _handleCharacterInput(
    event: InputEvent,
    el: HTMLInputElement,
    key: string,
    currentPosition: number,
    resolution: MaskResolution
  ): void {
    const mask = resolution.entries;
    // Skip over static characters and find the next input position
    const { position, autoPrintChars } = this._processStaticCharacters(el, currentPosition, mask);
    const maskEntry = mask[position];

    // Check if we're at a valid input position
    if (!maskEntry || typeof maskEntry === 'string') {
      event.preventDefault();
      return;
    }

    // Validate the character against the mask requirements
    if (!maskEntry.accepts.test(key)) {
      event.preventDefault();
      setTimeout(() => {
        // Ensure the cursor position is set after the value update for android compatibility
        el.setSelectionRange(position, position);
      });
      return;
    }

    // --- Segment-aware validation ---
    const seg = this.getSegmentAtPosition(position, resolution.segments);

    // Smart validation for number segments
    if (seg && seg.config.kind === 'number') {
      const validation = this._validateNumberInput(key, position, el, seg);
      if (validation.action === 'reject') {
        event.preventDefault();
        return;
      }
      if (validation.action === 'autocomplete' && validation.value !== undefined) {
        const newVal =
          el.value.slice(0, currentPosition) +
          autoPrintChars +
          validation.value +
          el.value.slice(seg.positions.end + 1);
        this._data.updateValue(el, newVal, seg.positions.end + 1);
        event.preventDefault();
        return;
      }
      // action === 'accept' — fall through to normal handling
    }

    // Enum segment typing — match first character against values
    if (seg && seg.config.kind === 'enum') {
      const enumConfig = seg.config as import('./types').EnumSegment;
      const matched = enumConfig.values.find(v => v[0]?.toLowerCase() === key.toLowerCase());
      if (!matched) {
        event.preventDefault();
        return;
      }
      // Fill entire segment with the matched value, including any preceding separators
      const newVal =
        el.value.slice(0, currentPosition) +
        autoPrintChars +
        matched +
        el.value.slice(seg.positions.end + 1);
      this._data.updateValue(el, newVal, seg.positions.end + 1);
      event.preventDefault();
      return;
    }

    // Build the new value with auto-inserted static characters
    const newVal =
      el.value.slice(0, position) + autoPrintChars + key + el.value.slice(position + 1);

    this._data.updateValue(el, newVal, position + 1);
    event.preventDefault();
  }

  /**
   * Read a segment's current value from the input element
   */
  private _getSegmentValue(el: HTMLInputElement, seg: ResolvedSegment): string {
    return el.value.slice(seg.positions.start, seg.positions.end + 1);
  }

  private _tryPaste(el: HTMLInputElement, text: string, resolution: MaskResolution): void {
    const mask = resolution.entries;
    const separators = new Set<string>();
    for (const entry of mask) {
      if (typeof entry === 'string') separators.add(entry);
    }

    // Strip separators from pasted text — they're optional
    let stripped = '';
    for (const ch of text) {
      if (!separators.has(ch)) stripped += ch;
    }

    // Walk segments in order, consume chars from stripped text
    let charIdx = 0;
    let result = '';

    for (let maskIdx = 0; maskIdx < mask.length; ) {
      const entry = mask[maskIdx];

      if (typeof entry === 'string') {
        result += entry;
        maskIdx++;
        continue;
      }

      const seg = this.getSegmentAtPosition(maskIdx, resolution.segments);
      if (!seg) {
        // Legacy entry — consume one char and validate
        if (charIdx >= stripped.length) return;
        const ch = stripped[charIdx]!;
        if (!entry!.accepts.test(ch)) return;
        result += ch;
        charIdx++;
        maskIdx++;
        continue;
      }

      const config = seg.config;
      const segLen = seg.positions.end - seg.positions.start + 1;

      if (config.kind === 'number') {
        const available = stripped.slice(charIdx, charIdx + segLen);
        if (available.length === 0) return;

        let segValue: string;
        if (available.length < segLen) {
          // Fewer digits than segment length — left-pad
          segValue = available.padStart(segLen, '0');
        } else {
          segValue = available.slice(0, segLen);
        }

        // Validate all chars are digits
        for (const ch of segValue) {
          if (!/^\d$/.test(ch)) return;
        }

        const numVal = parseInt(segValue, 10);
        if (numVal < config.min || numVal > config.max) return;

        result += segValue;
        charIdx += available.length < segLen ? available.length : segLen;
      } else if (config.kind === 'enum') {
        const available = stripped.slice(charIdx, charIdx + segLen);
        if (available.length === 0) return;

        // Try exact match first, then first-char match
        let matched = config.values.find(v => v.toUpperCase() === available.toUpperCase());
        if (!matched) {
          matched = config.values.find(v => v[0]?.toUpperCase() === available[0]?.toUpperCase());
        }
        if (!matched) return;

        result += matched;
        charIdx += available.length <= segLen ? available.length : segLen;
      }

      maskIdx = seg.positions.end + 1;
    }

    // All segments must be filled
    if (result.length !== mask.length) return;

    this._data.updateValue(el, result, result.length);
  }

  /**
   * Validate a digit keystroke against a number segment's min/max bounds.
   * Returns 'accept' to allow the keystroke, 'reject' to block it,
   * or 'autocomplete' with a padded value when the digit only works if
   * the remaining positions are filled with the correct padding.
   */
  private _validateNumberInput(
    key: string,
    cursorPos: number,
    el: HTMLInputElement,
    seg: ResolvedSegment
  ): { action: 'accept' | 'reject' | 'autocomplete'; value?: string } {
    const config = seg.config as NumberSegment;
    const { start, end } = seg.positions;
    const segLen = end - start + 1;

    // Build the value-so-far with the new key inserted
    const currentVal = this._getSegmentValue(el, seg);
    const offsetInSeg = cursorPos - start;
    const withKey = currentVal.slice(0, offsetInSeg) + key + currentVal.slice(offsetInSeg + 1);

    const remaining = end - cursorPos; // digits still to fill after this one

    if (remaining === 0) {
      // Final digit — the value is now fully determined
      const numVal = parseInt(withKey, 10);
      if (numVal < config.min || numVal > config.max) {
        return { action: 'reject' };
      }
      return { action: 'accept' };
    }

    // Not the final digit — check whether any valid completion exists
    const prefix = withKey.slice(0, offsetInSeg + 1);
    const suffixLen = segLen - prefix.length;
    const minCompletion = parseInt(prefix + '0'.repeat(suffixLen), 10);
    const maxCompletion = parseInt(prefix + '9'.repeat(suffixLen), 10);

    // Check if the ranges overlap: [minCompletion, maxCompletion] ∩ [min, max]
    if (minCompletion <= config.max && maxCompletion >= config.min) {
      return { action: 'accept' };
    }

    // No natural completion works — try left-padding the entered value
    const paddedStr = withKey.padStart(segLen, '0');
    const paddedVal = parseInt(paddedStr, 10);
    if (paddedVal >= config.min && paddedVal <= config.max) {
      return { action: 'autocomplete', value: paddedStr };
    }

    return { action: 'reject' };
  }

  /**
   * Pad el.value to full mask length using entry defaults and separator characters.
   * This ensures the input is fully populated before performing segment operations.
   */
  private _ensureFullValue(el: HTMLInputElement, resolution: MaskResolution): void {
    const mask = resolution.entries;
    if (el.value.length >= mask.length) {
      return;
    }
    let value = el.value;
    for (let i = value.length; i < mask.length; i++) {
      const entry = mask[i];
      if (typeof entry === 'string') {
        value += entry;
      } else if (entry) {
        value += entry.default;
      }
    }
    el.value = value;
  }

  /**
   * Increment or decrement a segment value by the given direction (+1 or -1).
   * For number segments: parse, adjust, wrap at bounds, pad and write.
   * For enum segments: cycle through values array with wrapping.
   */
  private _incrementSegment(
    el: HTMLInputElement,
    seg: ResolvedSegment,
    direction: 1 | -1,
    resolution: MaskResolution
  ): void {
    this._ensureFullValue(el, resolution);
    const { start, end } = seg.positions;
    const segLen = end - start + 1;

    if (seg.config.kind === 'number') {
      const config = seg.config as NumberSegment;
      const raw = this._getSegmentValue(el, seg);
      let numVal = parseInt(raw, 10);
      if (isNaN(numVal)) {
        numVal = direction === 1 ? config.min : config.max;
      } else {
        numVal += direction;
        if (numVal > config.max) numVal = config.min;
        if (numVal < config.min) numVal = config.max;
      }
      const padded = String(numVal).padStart(segLen, '0');
      const newVal = el.value.slice(0, start) + padded + el.value.slice(end + 1);
      this._data.updateValue(el, newVal, start);
      this._data.announce?.(`${config.segment}: ${padded}`);
    } else if (seg.config.kind === 'enum') {
      const config = seg.config as import('./types').EnumSegment;
      const raw = this._getSegmentValue(el, seg);
      let idx = config.values.indexOf(raw);
      if (idx === -1) {
        idx = direction === 1 ? 0 : config.values.length - 1;
      } else {
        idx += direction;
        if (idx >= config.values.length) idx = 0;
        if (idx < 0) idx = config.values.length - 1;
      }
      const newValue = config.values[idx] ?? config.values[0] ?? '';
      const newVal = el.value.slice(0, start) + newValue + el.value.slice(end + 1);
      this._data.updateValue(el, newVal, start);
      this._data.announce?.(`${config.segment}: ${newValue}`);
    }
  }

  /**
   * Process static characters in the mask and auto-insert them
   * Returns the next input position and any static characters to insert
   */
  private _processStaticCharacters(
    el: HTMLInputElement,
    startPosition: number,
    mask: InputMaskCfgResolved
  ): { position: number; autoPrintChars: string } {
    let currentPosition = startPosition;
    let autoPrintChars = '';
    let currentMaskEntry = mask[currentPosition];

    // Skip over static characters and collect them for auto-insertion
    while (currentMaskEntry && typeof currentMaskEntry === 'string') {
      if (el.value.charAt(currentPosition) !== currentMaskEntry) {
        autoPrintChars += currentMaskEntry;
      }
      currentPosition++;
      currentMaskEntry = mask[currentPosition];
    }

    return { position: currentPosition, autoPrintChars };
  }
}

/**
 * Type guard to check if an entry is a MaskSegment
 */
function isMaskSegment(entry: unknown): entry is import('./types').MaskSegment {
  return typeof entry === 'object' && entry !== null && 'kind' in entry;
}
