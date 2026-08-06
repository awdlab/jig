import { afterEach, describe, expect, it } from 'vitest';

import { ariaKeyShortcuts, formatShortcut, matchesShortcut, parseShortcut } from './shortcut';

/** jsdom's navigator.platform is a configurable getter, so it can be swapped per test. */
function setPlatform(platform: string): void {
  Object.defineProperty(navigator, 'platform', { value: platform, configurable: true });
}

const originalPlatform = navigator.platform;

afterEach(() => setPlatform(originalPlatform));

function keyEvent(key: string, modifiers: Partial<KeyboardEventInit> = {}): KeyboardEvent {
  return new KeyboardEvent('keydown', { key, ...modifiers });
}

describe('parseShortcut', () => {
  it('resolves mod to ctrl off mac', () => {
    setPlatform('Win32');
    expect(parseShortcut('mod+a')).toEqual({
      ctrl: true,
      meta: false,
      alt: false,
      shift: false,
      key: 'a',
    });
  });

  it('resolves mod to meta on mac', () => {
    setPlatform('MacIntel');
    expect(parseShortcut('mod+a')).toEqual({
      ctrl: false,
      meta: true,
      alt: false,
      shift: false,
      key: 'a',
    });
  });

  it('keeps ctrl literal on mac', () => {
    setPlatform('MacIntel');
    expect(parseShortcut('ctrl+a').ctrl).toBe(true);
    expect(parseShortcut('ctrl+a').meta).toBe(false);
  });

  it('is order-insensitive and case-insensitive', () => {
    setPlatform('Win32');
    expect(parseShortcut('A+Shift+Alt')).toEqual(parseShortcut('alt+shift+a'));
  });

  it('maps the space and plus aliases', () => {
    expect(parseShortcut('space').key).toBe(' ');
    expect(parseShortcut('mod+plus').key).toBe('+');
  });

  it('yields no key for a modifier-only string', () => {
    expect(parseShortcut('mod+shift').key).toBe('');
  });

  it('takes the last non-modifier token, matching formatShortcut', () => {
    expect(parseShortcut('a+b').key).toBe('b');
    expect(formatShortcut('a+b')).toBe('B');
  });
});

describe('matchesShortcut', () => {
  it('matches a shifted letter case-insensitively', () => {
    setPlatform('Win32');
    const parsed = parseShortcut('shift+a');
    expect(matchesShortcut(keyEvent('A', { shiftKey: true }), parsed)).toBe(true);
  });

  it('rejects extra modifiers', () => {
    setPlatform('Win32');
    expect(matchesShortcut(keyEvent('a', { ctrlKey: true }), parseShortcut('a'))).toBe(false);
  });

  it('rejects missing modifiers', () => {
    setPlatform('Win32');
    expect(matchesShortcut(keyEvent('s'), parseShortcut('mod+s'))).toBe(false);
  });

  it('matches mod against ctrl off mac', () => {
    setPlatform('Win32');
    expect(matchesShortcut(keyEvent('s', { ctrlKey: true }), parseShortcut('mod+s'))).toBe(true);
  });

  it('matches mod against meta on mac', () => {
    setPlatform('MacIntel');
    expect(matchesShortcut(keyEvent('s', { metaKey: true }), parseShortcut('mod+s'))).toBe(true);
  });

  it('ignores the shift state for punctuation keys', () => {
    expect(matchesShortcut(keyEvent('?', { shiftKey: true }), parseShortcut('?'))).toBe(true);
  });

  it('never matches a modifier-only string', () => {
    expect(matchesShortcut(keyEvent('Control', { ctrlKey: true }), parseShortcut('mod'))).toBe(
      false
    );
  });

  it('requires shift to match for a space binding (space is not punctuation)', () => {
    const parsed = parseShortcut('space');
    expect(matchesShortcut(keyEvent(' '), parsed)).toBe(true);
    expect(matchesShortcut(keyEvent(' ', { shiftKey: true }), parsed)).toBe(false);
  });
});

describe('formatShortcut', () => {
  it('renders mod as the key it resolves to on this platform', () => {
    setPlatform('Win32');
    expect(formatShortcut('mod+shift+a')).toBe('⇧⌃A');
    setPlatform('MacIntel');
    expect(formatShortcut('mod+shift+a')).toBe('⇧⌘A');
  });

  it('keeps ctrl and meta literal regardless of platform', () => {
    setPlatform('Win32');
    expect(formatShortcut('ctrl+a')).toBe('⌃A');
    expect(formatShortcut('meta+a')).toBe('⌘A');
    setPlatform('MacIntel');
    expect(formatShortcut('ctrl+a')).toBe('⌃A');
    expect(formatShortcut('meta+a')).toBe('⌘A');
  });

  it('orders ctrl, alt, shift, then mod', () => {
    setPlatform('MacIntel');
    expect(formatShortcut('shift+mod+alt+ctrl+k')).toBe('⌃⌥⇧⌘K');
  });

  it('collapses glyphs that resolve to the same key', () => {
    setPlatform('MacIntel');
    expect(formatShortcut('mod+meta+a')).toBe('⌘A');
    setPlatform('Win32');
    expect(formatShortcut('mod+ctrl+a')).toBe('⌃A');
  });

  it('uses glyphs for named keys', () => {
    setPlatform('MacIntel');
    expect(formatShortcut('enter')).toBe('↵');
    expect(formatShortcut('mod+arrowup')).toBe('⌘↑');
    expect(formatShortcut('escape')).toBe('esc');
  });

  it('title-cases an unknown key name', () => {
    expect(formatShortcut('f2')).toBe('F2');
  });

  it('resolves aliases to their glyph', () => {
    setPlatform('MacIntel');
    expect(formatShortcut('esc')).toBe('esc');
    expect(formatShortcut('space')).toBe('␣');
    expect(formatShortcut('mod+plus')).toBe('⌘+');
  });

  it('returns an empty string for an empty shortcut', () => {
    expect(formatShortcut('')).toBe('');
  });
});

describe('ariaKeyShortcuts', () => {
  it('maps mod to Control off mac', () => {
    setPlatform('Win32');
    expect(ariaKeyShortcuts('mod+s')).toBe('Control+S');
  });

  it('maps mod to Meta on mac', () => {
    setPlatform('MacIntel');
    expect(ariaKeyShortcuts('mod+s')).toBe('Meta+S');
  });

  it('keeps ctrl and meta literal regardless of platform', () => {
    expect(ariaKeyShortcuts('ctrl+s')).toBe('Control+S');
    expect(ariaKeyShortcuts('meta+s')).toBe('Meta+S');
  });

  it('maps alt and shift', () => {
    expect(ariaKeyShortcuts('alt+shift+a')).toBe('Alt+Shift+A');
  });

  it('spells named keys as their KeyboardEvent.key value', () => {
    setPlatform('Win32');
    expect(ariaKeyShortcuts('mod+enter')).toBe('Control+Enter');
    expect(ariaKeyShortcuts('escape')).toBe('Escape');
    expect(ariaKeyShortcuts('alt+arrowup')).toBe('Alt+ArrowUp');
  });

  it('resolves the esc alias to Escape', () => {
    expect(ariaKeyShortcuts('esc')).toBe('Escape');
  });

  it('upper-cases a single-character key', () => {
    setPlatform('Win32');
    expect(ariaKeyShortcuts('mod+/')).toBe('Control+/');
  });
});
