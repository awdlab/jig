import { Component, computed, DestroyRef, inject, input } from '@angular/core';
import { type AnyNgnBase, NgnBase, NgnPt, provideSelf } from '@awdlab/jig/base';
import { NgnButton } from '@awdlab/jig/button';
import { NgnIcon } from '@awdlab/jig/icon';
import { NgnInputField } from '@awdlab/jig/input-field';
import { spinButtonsControlTemplate } from '@awdlab/jig-themes/templates/spin-buttons';

import type { IconType } from '@awdlab/jig-custom-types';

/** Delay before press-and-hold starts auto-repeating (ms). */
const HOLD_DELAY = 400;
/** Interval between auto-repeated steps while holding (ms). */
const HOLD_INTERVAL = 60;

/**
 * Increment/decrement buttons for a steppable control (e.g. `ngnNumberInput`).
 *
 * Inside an `awd-input-field` the buttons find the field's primary control
 * automatically; outside (or to target a specific control) bind `[for]` to a
 * control instance (e.g. a `#num="ngnNumberInput"` template reference).
 *
 * The buttons are a pointer affordance only (`tabindex="-1"`, `aria-hidden`):
 * keyboard users step via `ArrowUp`/`ArrowDown` on the control itself, which
 * carries the `spinbutton` role. Press-and-hold auto-repeats; the buttons
 * disable at the control's min/max bounds.
 *
 * Use `buttons="increment"`/`buttons="decrement"` on two instances to flank
 * an input on both sides; the stacked/inline arrangement of the `both` pair
 * is a theme kind (`kind="stacked" | "inline"`).
 *
 * @category control
 */
@Component({
  selector: 'awd-spin-buttons',
  templateUrl: './spin-buttons.html',
  imports: [NgnPt, NgnButton, NgnIcon],
  providers: [provideSelf(NgnSpinButtons)],
})
export class NgnSpinButtons extends NgnBase<'spinButtons'> {
  protected readonly theme = this.injectThemeTemplate(spinButtonsControlTemplate, {
    root: true,
    // A lone decrement button flanks the input's leading edge; everything else
    // (increment, the stacked/inline pair) sits at the trailing edge.
    leading: () => this.buttons() === 'decrement',
    trailing: () => this.buttons() !== 'decrement',
    pair: () => this.buttons() === 'both',
  });

  /**
   * Which buttons to render. Use two instances (`decrement` + `increment`)
   * to place one button on each side of the input.
   * @default 'both'
   */
  public readonly buttons = input<'both' | 'increment' | 'decrement'>('both');
  /**
   * The control to step. Falls back to the primary control of a surrounding
   * `awd-input-field`.
   */
  public readonly for = input<AnyNgnBase | undefined>(undefined);
  /** Custom icon for the increment button. */
  public readonly iconIncrement = input<IconType>();
  /** Custom icon for the decrement button. */
  public readonly iconDecrement = input<IconType>();

  private readonly _field = inject(NgnInputField, { optional: true });

  /** The resolved step target: explicit `for` wins over the surrounding field. */
  protected readonly target = computed(() => this.for() ?? this._field?.control());

  private _holdTimeout: ReturnType<typeof setTimeout> | undefined;
  private _holdInterval: ReturnType<typeof setInterval> | undefined;

  constructor() {
    super();
    inject(DestroyRef).onDestroy(() => this._stopRepeat());
  }

  protected canStep(direction: 1 | -1): boolean {
    return this.target()?.canStepValue(direction) ?? false;
  }

  /**
   * First step on pointer down (like native spinners), then auto-repeat while
   * held. `preventDefault` keeps focus (and caret) where it is.
   */
  protected pressStart(event: PointerEvent, direction: 1 | -1): void {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }
    event.preventDefault();
    this._stopRepeat();
    if (!this.target()?.stepValue(direction)) {
      return;
    }
    this._holdTimeout = setTimeout(() => {
      this._holdInterval = setInterval(() => {
        // Stop at the bound: a disabled button may no longer emit pointerup.
        const target = this.target();
        if (!target?.canStepValue(direction) || !target.stepValue(direction)) {
          this._stopRepeat();
        }
      }, HOLD_INTERVAL);
    }, HOLD_DELAY);
  }

  protected pressEnd(): void {
    this._stopRepeat();
  }

  /** Stepping already happened on pointer down — just keep the click local. */
  protected clicked(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
  }

  private _stopRepeat(): void {
    if (this._holdTimeout !== undefined) {
      clearTimeout(this._holdTimeout);
      this._holdTimeout = undefined;
    }
    if (this._holdInterval !== undefined) {
      clearInterval(this._holdInterval);
      this._holdInterval = undefined;
    }
  }
}
