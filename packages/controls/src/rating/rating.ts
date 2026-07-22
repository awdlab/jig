import { NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, Component, computed, input, signal } from '@angular/core';
import { NgnPt, provideSelf } from '@ngneers/controls/base';
import { NgnIcon } from '@ngneers/controls/icon';
import { ratingControlTemplate } from '@ngneers/controls-themes/templates/rating';

import { RatingTemplates } from './rating-templates';

import type { IconType } from '@ngneers/controls-custom-types';

/**
 * @category control
 */
@Component({
  selector: 'ngn-rating',
  templateUrl: './rating.html',
  imports: [NgTemplateOutlet, NgnPt, NgnIcon],
  providers: [provideSelf(NgnRating)],
  host: {
    role: 'slider',
    'aria-valuemin': '0',
    '[attr.aria-valuemax]': 'count()',
    '[attr.aria-valuenow]': 'value()',
    '[attr.aria-readonly]': 'readonly() ? "true" : null',
    '[attr.disabled]': 'disabled() ? "" : null',
    '[attr.aria-disabled]': "disabled() ? 'true' : null",
    '[attr.aria-labelledby]': 'labelledBy()',
    '[attr.aria-label]': 'label()',
    '[attr.aria-valuetext]': 'valueTextValue()',
    '[tabindex]': 'disabled() ? -1 : 0',
    '(keydown)': 'onKeyDown($event)',
    '(pointerleave)': 'clearHover()',
    '(blur)': 'markTouched()',
  },
})
export class NgnRating extends RatingTemplates {
  protected readonly theme = this.injectThemeTemplate(ratingControlTemplate, {
    root: true,
    invalid: () => this.invalidState(),
    readonly: () => this.readonly(),
    disabled: () => this.disabled(),
  });

  private readonly _hover = signal<number | null>(null);

  /** Number of symbols. @default 5 */
  public readonly count = input<number>(5);
  /** The value increment; supports fractions (e.g. 0.5). @default 1 */
  public readonly step = input<number>(1);
  /** The filled symbol icon. Falls back to a filled star ({@link https://tabler.io/icons}). */
  public readonly iconFull = input<IconType>();
  /** The empty symbol icon. Falls back to an outline star. */
  public readonly iconEmpty = input<IconType>();
  /** Clicking the current value clears the rating back to `null`. @default true */
  public readonly clearable = input(true, { transform: booleanAttribute });
  /** Accessible value text; overrides the numeric readout. */
  public readonly valueText = input<string>();
  /** Function producing accessible value text from the value. */
  public readonly valueTextFn = input<(value: number) => string>();

  /** The value the UI should paint: hover preview when hovering, else the model value. */
  protected readonly displayValue = computed(() => this._hover() ?? this.value() ?? 0);

  /** Zero-based indices for the symbols. */
  protected readonly symbols = computed(() => Array.from({ length: this.count() }, (_, i) => i));

  protected readonly valueTextValue = computed(() => {
    const valueText = this.valueText();
    if (valueText) {
      return valueText;
    }
    const fn = this.valueTextFn();
    if (fn) {
      return fn(this.value() ?? 0);
    }
    return null;
  });

  /** Fill ratio 0..1 for symbol `index` given the current display value (hover ?? value). */
  protected fillRatio(index: number): number {
    const filled = this.displayValue() - index;
    return Math.min(1, Math.max(0, filled));
  }

  protected onKeyDown(event: KeyboardEvent) {
    if (this.readonly() || this.disabled()) {
      return;
    }
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        // Decrementing below the first step clears the rating (0 is not a valid value).
        this.value.update(v => {
          const next = (v ?? 0) - this.step();
          return next <= 0 ? null : next;
        });
        event.preventDefault();
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        this.value.update(v => Math.min(this.count(), (v ?? 0) + this.step()));
        event.preventDefault();
        break;
      case 'Home':
        // No value is the lowest state, since 0 is not selectable.
        this.value.set(null);
        event.preventDefault();
        break;
      case 'End':
        this.value.set(this.count());
        event.preventDefault();
        break;
    }
  }

  /** Pointer moved over symbol `index` at fractional `offset` (0..1 within the symbol). */
  protected onPointerMove(event: PointerEvent, index: number) {
    if (this.readonly() || this.disabled()) {
      return;
    }
    this._hover.set(this.valueAt(event, index));
  }

  protected clearHover() {
    this._hover.set(null);
  }

  protected onClick(event: PointerEvent, index: number) {
    if (this.readonly() || this.disabled()) {
      return;
    }
    const next = this.valueAt(event, index);
    if (this.clearable() && next === this.value()) {
      this.value.set(null);
    } else {
      this.value.set(next);
    }
  }

  /** Resolve the stepped value for a pointer position within symbol `index`. */
  private valueAt(event: PointerEvent, index: number): number {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const ratio = rect.width ? (event.clientX - rect.left) / rect.width : 1;
    const clamped = Math.min(1, Math.max(0, ratio));
    // Fill on area-entry: within symbol `index`, snap UP to the nearest `step`
    // sub-division. Entering the symbol anywhere (ratio > 0) selects at least its
    // first sub-step, so a whole-step rating fills the entire symbol as soon as the
    // pointer is over it, and a half-step rating fills the left/right half.
    const step = this.step();
    const subStepsPerSymbol = Math.max(1, Math.round(1 / step));
    const subIndex = Math.min(
      subStepsPerSymbol,
      Math.max(1, Math.ceil(clamped * subStepsPerSymbol))
    );
    return this.clamp(index + subIndex * step);
  }

  private clamp(value: number): number {
    return Math.min(this.count(), Math.max(0, value));
  }
}
