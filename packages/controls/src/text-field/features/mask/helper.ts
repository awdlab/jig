import { TextFieldMaskCfg } from './types';

// Interface for communicating with the parent component
type MaskData = {
  updateValue: (element: HTMLInputElement, value: string, position: number) => void;
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
  public ensureMask(mask: TextFieldMaskCfg | string | null): TextFieldMaskCfg | null {
    if (!mask) return null;
    if (typeof mask === 'string') {
      // Convert string mask to TextFieldMaskCfg
      // 0 => digit, A => letter, * => alphanumeric
      return mask.split('').map(char => {
        if (char === '0') {
          return { placeholder: char, accepts: /\d/, default: '0' };
        } else if (char === 'A') {
          return { placeholder: char, accepts: /[a-zA-Z]/, default: 'A' };
        } else if (char === '*') {
          return { placeholder: char, accepts: /[a-zA-Z0-9]/, default: 'A' };
        }
        return char;
      });
    }
    return mask;
  }

  /**
   * Main entry point for handling keyboard input with mask validation
   */
  public handleKeyDown(event: KeyboardEvent, mask: TextFieldMaskCfg): void {
    if (!mask || this._shouldIgnoreEvent(event)) {
      return;
    }
    const el = event.target as HTMLInputElement;
    const key = event.key;
    const currentPosition = el.selectionStart ?? 0;

    // Route to appropriate handler based on key type
    if (this._isSpecialKey(key)) {
      this._handleSpecialKey(event, el, key, currentPosition, mask);
    } else {
      this._handleCharacterInput(event, el, key, currentPosition, mask);
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
    mask: TextFieldMaskCfg
  ): void {
    if (key === 'Backspace' && currentPosition > 0) {
      const maskEntry = mask[currentPosition - 1];
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
    event: KeyboardEvent,
    el: HTMLInputElement,
    key: string,
    currentPosition: number,
    mask: TextFieldMaskCfg
  ): void {
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
      return;
    }

    // Build the new value with auto-inserted static characters
    const newVal =
      el.value.slice(0, position) + autoPrintChars + key + el.value.slice(position + 1);

    this._data.updateValue(el, newVal, position + 1);
    event.preventDefault();
  }

  /**
   * Process static characters in the mask and auto-insert them
   * Returns the next input position and any static characters to insert
   */
  private _processStaticCharacters(
    el: HTMLInputElement,
    startPosition: number,
    mask: TextFieldMaskCfg
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
