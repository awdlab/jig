import { notNullish } from '@awdlab/jig/utils';

import { isMacPlatform } from '@awdlab/jig/api/ng';

/** A shortcut with `mod` already resolved to the platform's primary modifier. */
export type ParsedShortcut = {
  ctrl: boolean;
  meta: boolean;
  alt: boolean;
  shift: boolean;
  key: string;
};

/** Glyph shown for each token. `mod` resolves per platform, see {@link modGlyph}. */
const GLYPHS: Record<string, string> = {
  meta: '⌘',
  ctrl: '⌃',
  alt: '⌥',
  shift: '⇧',
  enter: '↵',
  escape: 'esc',
  tab: '⇥',
  space: '␣',
  backspace: '⌫',
  delete: '⌦',
  arrowup: '↑',
  arrowdown: '↓',
  arrowleft: '←',
  arrowright: '→',
  pageup: '⇞',
  pagedown: '⇟',
  home: '↖',
  end: '↘',
};

/** Display order of the modifier glyphs. */
const MODIFIER_ORDER = ['ctrl', 'alt', 'shift', 'mod', 'meta'];

/** Tokens whose `event.key` differs from the token itself. */
const KEY_ALIASES: Record<string, string> = {
  space: ' ',
  plus: '+',
  esc: 'escape',
};

/** Modifier token → its `KeyboardEvent.key` / ARIA name. */
const ARIA_MODIFIER_NAMES: Record<string, string> = {
  ctrl: 'Control',
  meta: 'Meta',
  alt: 'Alt',
  shift: 'Shift',
};

/** Named keys whose `KeyboardEvent.key` spelling differs from the lowercase token. */
const ARIA_KEY_NAMES: Record<string, string> = {
  enter: 'Enter',
  escape: 'Escape',
  tab: 'Tab',
  backspace: 'Backspace',
  delete: 'Delete',
  arrowup: 'ArrowUp',
  arrowdown: 'ArrowDown',
  arrowleft: 'ArrowLeft',
  arrowright: 'ArrowRight',
  pageup: 'PageUp',
  pagedown: 'PageDown',
  home: 'Home',
  end: 'End',
};

function tokenize(shortcut: string): string[] {
  return shortcut
    .split('+')
    .map(token => token.trim().toLowerCase())
    .filter(Boolean);
}

/** Parses a shortcut string into a form directly comparable to a `KeyboardEvent`. */
export function parseShortcut(shortcut: string): ParsedShortcut {
  const parsed: ParsedShortcut = { ctrl: false, meta: false, alt: false, shift: false, key: '' };
  const mac = isMacPlatform();

  for (const token of tokenize(shortcut)) {
    switch (token) {
      case 'mod':
        if (mac) {
          parsed.meta = true;
        } else {
          parsed.ctrl = true;
        }
        break;
      case 'ctrl':
        parsed.ctrl = true;
        break;
      case 'meta':
        parsed.meta = true;
        break;
      case 'alt':
        parsed.alt = true;
        break;
      case 'shift':
        parsed.shift = true;
        break;
      default:
        parsed.key = KEY_ALIASES[token] ?? token;
    }
  }
  return parsed;
}

/** Whether a keydown event satisfies a parsed shortcut. Modifiers must match exactly. */
export function matchesShortcut(event: KeyboardEvent, parsed: ParsedShortcut): boolean {
  if (!parsed.key || event.key.toLowerCase() !== parsed.key.toLowerCase()) {
    return false;
  }
  if (
    event.ctrlKey !== parsed.ctrl ||
    event.metaKey !== parsed.meta ||
    event.altKey !== parsed.alt
  ) {
    return false;
  }
  // Punctuation often requires Shift to type at all, so its state is only compared when the
  // shortcut names shift explicitly. Letters, digits and space are not punctuation here.
  const punctuation = parsed.key.length === 1 && !/[a-z0-9 ]/i.test(parsed.key);
  if (punctuation && !parsed.shift) {
    return true;
  }
  return event.shiftKey === parsed.shift;
}

/** `mod` renders as the key it actually resolves to: ⌘ on macOS, ⌃ elsewhere. */
function modGlyph(): string {
  return isMacPlatform() ? '⌘' : '⌃';
}

/** Renders a shortcut as glyphs, e.g. `mod+shift+a` → `⇧⌘A` on macOS, `⇧⌃A` elsewhere. */
export function formatShortcut(shortcut: string): string {
  const tokens = tokenize(shortcut);
  const modifiers = MODIFIER_ORDER.filter(token => tokens.includes(token))
    .map(token => (token === 'mod' ? modGlyph() : GLYPHS[token]))
    .filter(notNullish);
  // Last non-modifier token, matching parseShortcut's key resolution.
  const key = tokens.filter(token => !MODIFIER_ORDER.includes(token)).pop() ?? '';
  return [...new Set(modifiers), formatKey(key)].join('');
}

/**
 * Renders a shortcut for `aria-keyshortcuts`: each token becomes a valid
 * `KeyboardEvent.key` name (`mod` → `Meta`/`Control`, `ctrl` → `Control`, a single
 * character is upper-cased, a named key uses its `KeyboardEvent.key` spelling).
 */
export function ariaKeyShortcuts(shortcut: string): string {
  const mac = isMacPlatform();
  return tokenize(shortcut)
    .map(token => {
      if (token === 'mod') {
        return mac ? 'Meta' : 'Control';
      }
      if (token in ARIA_MODIFIER_NAMES) {
        return ARIA_MODIFIER_NAMES[token];
      }
      const key = KEY_ALIASES[token] ?? token;
      if (key.length === 1) {
        return key.toUpperCase();
      }
      return ARIA_KEY_NAMES[key] ?? key.charAt(0).toUpperCase() + key.slice(1);
    })
    .join('+');
}

function formatKey(key: string): string {
  if (!key) {
    return '';
  }
  const alias = KEY_ALIASES[key] ?? key;
  return (
    GLYPHS[key] ??
    GLYPHS[alias] ??
    (alias.length === 1 ? alias.toUpperCase() : key.charAt(0).toUpperCase() + key.slice(1))
  );
}
