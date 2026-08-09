import { isPlatformBrowser } from '@angular/common';
import {
  computed,
  DestroyRef,
  Directive,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  input,
  PLATFORM_ID,
  signal,
} from '@angular/core';

import { matchesShortcut, parseShortcut } from './shortcut';

/** One shortcut and the callback it runs. */
export type AwdShortcutBinding = {
  /** Shortcut config string, e.g. `mod+shift+a`. */
  shortcut: string;
  /** Runs when the combo is pressed while focus is inside the scope. */
  callback: (event: KeyboardEvent) => void;
  /** Skips this binding while `true`. */
  disabled?: boolean;
  /**
   * Fires from anywhere on the page instead of only while focus is inside the scope —
   * for app-level commands. Scoped bindings in the same scope keep their focus requirement.
   * @default false
   */
  global?: boolean;
};

function isEditableTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}

/** Keys that type nothing in a field, so they must still fire there: Escape and the function keys. */
const FIRES_WHILE_EDITING = /^(escape|f(?:[1-9]|1[0-2]))$/;

function firesWhileEditing(key: string): boolean {
  return FIRES_WHILE_EDITING.test(key.toLowerCase());
}

const SCOPES = new WeakMap<Element, AwdKeyboardShortcut>();

/** Bumped whenever a scope enrolls or is torn down, so `closestShortcutScope` reruns in an effect. */
const SCOPES_VERSION = signal(0);

/** The nearest shortcut scope at or above `element`, or null when there is none. */
export function closestShortcutScope(element: Element | null): AwdKeyboardShortcut | null {
  SCOPES_VERSION();
  for (let node = element; node; node = node.parentElement) {
    const scope = SCOPES.get(node);
    if (scope) {
      return scope;
    }
  }
  return null;
}

/**
 * Runs shortcut callbacks while focus is inside the host element — or anywhere on the page for
 * a binding marked {@link AwdShortcutBinding.global}. A handled shortcut stops propagating, so a
 * nested scope wins over an outer one.
 *
 * @category directive
 */
@Directive({
  selector: '[ngnKeyboardShortcut]',
  host: {
    '(keydown)': 'onKeydown($event)',
  },
})
export class AwdKeyboardShortcut {
  /**
   * Shortcuts owned by this scope. Descendant registrations (e.g. an
   * {@link AwdActionButton} config's `shortcut`) are checked before these.
   */
  public readonly bindings = input<AwdShortcutBinding[]>([], { alias: 'ngnKeyboardShortcut' });

  private readonly _host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly _document = inject(DOCUMENT);
  private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly _registered = new Set<() => AwdShortcutBinding>();
  /** Bumped on register/unregister so {@link _hasGlobalBinding} reruns for descendant bindings. */
  private readonly _registeredVersion = signal(0);

  private readonly _hasGlobalBinding = computed(() => {
    this._registeredVersion();
    return this.candidates().some(binding => binding.global);
  });

  constructor() {
    SCOPES.set(this._host, this);
    SCOPES_VERSION.update(v => v + 1);
    inject(DestroyRef).onDestroy(() => {
      SCOPES.delete(this._host);
      SCOPES_VERSION.update(v => v + 1);
    });

    effect(onCleanup => {
      if (!this._isBrowser || !this._hasGlobalBinding()) {
        return;
      }
      // Bubble phase, so a scope that already handled the event has stopped it from arriving.
      const listener = (event: Event) => this.onKeydown(event as KeyboardEvent, true);
      this._document.addEventListener('keydown', listener);
      onCleanup(() => this._document.removeEventListener('keydown', listener));
    });
  }

  /** Adds a descendant-owned binding and returns its unregister function. */
  public register(binding: () => AwdShortcutBinding): () => void {
    this._registered.add(binding);
    this._registeredVersion.update(v => v + 1);
    return () => {
      this._registered.delete(binding);
      this._registeredVersion.update(v => v + 1);
    };
  }

  /** `globalOnly` marks the document-level pass, where scoped bindings must not fire. */
  protected onKeydown(event: KeyboardEvent, globalOnly = false): void {
    if (event.repeat) {
      return;
    }
    for (const binding of this.candidates()) {
      if (binding.disabled || (globalOnly && !binding.global)) {
        continue;
      }
      const parsed = parseShortcut(binding.shortcut);
      if (!matchesShortcut(event, parsed)) {
        continue;
      }
      // A bare letter must not steal keystrokes from a field the user is typing in — unless
      // the key types nothing there anyway (Escape, function keys).
      if (
        isEditableTarget(event.target) &&
        !parsed.ctrl &&
        !parsed.meta &&
        !parsed.alt &&
        !firesWhileEditing(parsed.key)
      ) {
        continue;
      }
      event.preventDefault();
      event.stopPropagation();
      binding.callback(event);
      return;
    }
  }

  private candidates(): AwdShortcutBinding[] {
    return [...[...this._registered].map(binding => binding()), ...this.bindings()];
  }
}
