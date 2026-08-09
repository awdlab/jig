import {
  booleanAttribute,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { NgnBase, provideSelf } from '@awdlab/jig/base';
import { NgnIcon } from '@awdlab/jig/icon';
import { ariaKeyShortcuts, closestShortcutScope, NgnKbd } from '@awdlab/jig/kbd';
import { NgnTooltip } from '@awdlab/jig/tooltip';
import { Logger, maybeCallback } from '@awdlab/jig/utils';

import { NgnButton } from './button';

import type { NgnActionButtonConfig } from '@awdlab/jig/api';

/**
 * Renders a single {@link NgnActionButtonConfig} as a button — label or icon,
 * tooltip, keyboard shortcut and the action callback — so action lists can be
 * driven by data instead of markup.
 *
 * An icon-only button takes its accessible name from the config's label via a
 * tooltip, and a configured `shortcut` is registered against the nearest
 * shortcut scope and mirrored into `aria-keyshortcuts`.
 *
 * @category control
 */
@Component({
  selector: 'awd-action-button',
  templateUrl: 'action-button.html',
  imports: [NgnButton, NgnIcon, NgnKbd, NgnTooltip],
  providers: [provideSelf(NgnActionButton)],
})
export class NgnActionButton<T> extends NgnBase<null> {
  protected readonly theme = null;

  /**
   * The configuration describing the button: its label, icon, tooltip, value,
   * shortcut, and the action callback fired on click.
   * @see {@link NgnActionButtonConfig}
   */
  public readonly config = input.required<NgnActionButtonConfig<T>>();

  /**
   * Whether the inner button is displayed inline (line-height sized).
   * @default false
   */
  public readonly inline = input(false, { transform: booleanAttribute });

  /**
   * Emits the {@link config}'s `value` when the button is clicked, after its
   * `action` callback has run.
   */
  public readonly clicked = output<T>();

  private readonly _host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected readonly maybeCallback = maybeCallback;

  /** Whether the button renders an icon in place of its label — drives icon/tooltip layout. */
  private readonly _hasIcon = computed(() => !!(this.config().icon || this.config().defaultIcon));

  /** The shortcut rendered as a hidden keycap inside the button, for every kind. */
  protected readonly shortcutHint = computed(() => this.config().shortcut ?? null);

  /** Icon-only buttons get a tooltip carrying the plain label as their accessible name. */
  protected readonly tooltip = computed(() =>
    this._hasIcon() ? maybeCallback(this.config().label) : null
  );

  /** Live shortcut, i.e. one that actually resolved an ancestor scope — drives `aria-keyshortcuts`. */
  private readonly _activeShortcut = signal<string | null>(null);

  protected readonly ariaShortcut = computed(() => {
    const shortcut = this._activeShortcut();
    return shortcut ? ariaKeyShortcuts(shortcut) : null;
  });

  private readonly _shortcutConfig = computed(() => this.config().shortcut);

  constructor() {
    super();
    effect(onCleanup => {
      const shortcut = this._shortcutConfig();
      if (!shortcut) {
        this._activeShortcut.set(null);
        return;
      }
      const scope = closestShortcutScope(this._host);
      if (!scope) {
        this._activeShortcut.set(null);
        Logger.warn(
          `[awd-action-button] shortcut "${shortcut}" is ignored: no ancestor [ngnKeyboardShortcut] scope.`
        );
        return;
      }
      this._activeShortcut.set(shortcut);
      onCleanup(
        scope.register(() => ({
          shortcut,
          callback: () => this.click(),
          disabled: this.config().disabled,
        }))
      );
    });
  }

  protected click(event?: PointerEvent): void {
    // Run the config's action callback first, then emit `clicked` — consumers
    // (snackbar, dialog) treat `clicked` as the dismiss signal, so the action
    // must fire before the host tears the button down.
    this.config().action?.(event);
    this.clicked.emit(this.config().value);
  }
}
