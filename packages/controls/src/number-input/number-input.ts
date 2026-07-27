import {
  computed,
  Directive,
  effect,
  inject,
  input,
  LOCALE_ID,
  numberAttribute,
  signal,
  untracked,
} from '@angular/core';
import { domEventHandler } from '@ngneers/controls/api/ng';
import { provideSelf, ValueControlBase } from '@ngneers/controls/base';
import { inputControlTemplate } from '@ngneers/controls-themes/templates/input';

import { clampValue, localeNumberInfo, parseLocaleNumber, stepNumberValue } from './helper';

/** `numberAttribute` that keeps `undefined`/`null`/`''` as "no bound" instead of `NaN`. */
function optionalNumberAttribute(value: unknown): number | undefined {
  return value == null || value === '' ? undefined : numberAttribute(value);
}

/** A finite, strictly-positive step, or `undefined` for an invalid input. */
function positiveStep(value: number | undefined): number | undefined {
  return value != null && Number.isFinite(value) && value > 0 ? value : undefined;
}

/**
 * Turns a native `<input>` into a locale-aware number input with a
 * `number | null` value model:
 *
 * - Free typing while focused; the value is committed on blur/Enter
 *   (unparseable text reverts, out-of-range values are clamped — no wrapping).
 * - Display is formatted via `Intl.NumberFormat` while blurred; while focused
 *   the text is the raw, ungrouped edit form.
 * - `ArrowUp`/`ArrowDown` step by `step`, with `Shift` by `bigStep`.
 *   Results are rounded to the operands' precision so float drift never shows.
 * - Exposes the {@link NgnBase.stepValue}/{@link NgnBase.canStepValue} hooks,
 *   so `ngn-spin-buttons` (or a surrounding field) can step the value.
 *
 * @category control
 */
@Directive({
  selector: 'input[ngnNumberInput]',
  providers: [provideSelf(NgnNumberInput)],
  exportAs: 'ngnNumberInput',
  host: {
    type: 'text',
    role: 'spinbutton',
    inputmode: 'decimal',
    autocomplete: 'off',
    '[attr.aria-valuenow]': 'value() ?? null',
    '[attr.aria-valuemin]': 'min() ?? null',
    '[attr.aria-valuemax]': 'max() ?? null',
    '[attr.aria-label]': 'label()',
    '[attr.aria-invalid]': 'invalidState() ? "true" : null',
    '[disabled]': 'disabled()',
    '[readOnly]': 'readonly()',
  },
})
export class NgnNumberInput extends ValueControlBase<'numberInput', number | null> {
  public override readonly isFieldControl = true;
  protected readonly theme = this.injectThemeTemplate(inputControlTemplate, {
    root: true,
    invalid: () => this.invalidState(),
    empty: () => this.empty(),
  });

  /**
   * The minimum allowed value (inclusive). Typed values below are clamped on
   * commit; stepping stops here.
   */
  public readonly min = input(undefined, { transform: optionalNumberAttribute });
  /**
   * The maximum allowed value (inclusive). Typed values above are clamped on
   * commit; stepping stops here.
   */
  public readonly max = input(undefined, { transform: optionalNumberAttribute });
  /**
   * The step amount applied by the spin buttons and `ArrowUp`/`ArrowDown`.
   * Non-finite or non-positive values fall back to `1`.
   * @default 1
   */
  public readonly step = input(1, { transform: numberAttribute });
  /**
   * The step amount applied with `Shift+ArrowUp`/`Shift+ArrowDown`.
   * Non-finite or non-positive values fall back to `appliedStep * 10`.
   * @default step * 10
   */
  public readonly bigStep = input(undefined, { transform: optionalNumberAttribute });
  /**
   * The locale used for formatting and parsing.
   * @default LOCALE_ID
   */
  public readonly locale = input<string | undefined>(undefined);
  /**
   * Additional `Intl.NumberFormat` options for the blurred display format only
   * (e.g. `{ minimumFractionDigits: 2 }`). While focused the input shows the
   * plain, ungrouped edit form, so display options never round or reshape the
   * value the user is typing.
   */
  public readonly formatOptions = input<Intl.NumberFormatOptions | undefined>(undefined);

  private readonly _input = this.element.nativeElement as HTMLInputElement;
  private readonly _localeId = inject(LOCALE_ID);

  protected readonly appliedLocale = computed(() => this.locale() ?? this._localeId);
  /** Sanitized step — a finite positive number, defaulting to `1`. */
  protected readonly appliedStep = computed(() => positiveStep(this.step()) ?? 1);
  protected readonly appliedBigStep = computed(
    () => positiveStep(this.bigStep()) ?? this.appliedStep() * 10
  );

  private readonly _localeInfo = computed(() => localeNumberInfo(this.appliedLocale()));
  private readonly _displayFormat = computed(
    () =>
      new Intl.NumberFormat(this.appliedLocale(), {
        maximumFractionDigits: 20,
        ...this.formatOptions(),
      })
  );
  // The edit formatter is deliberately plain — it does NOT apply formatOptions.
  // Display options (fraction digits, currency, percent) would round the
  // in-progress value or make the editable text unparsable on commit.
  private readonly _editFormat = computed(
    () =>
      new Intl.NumberFormat(this.appliedLocale(), {
        maximumFractionDigits: 20,
        useGrouping: false,
      })
  );

  /** Whether the input currently holds focus (raw edit format while focused). */
  protected readonly focused = signal(false);

  /** Mirror of the input element's current text (drives the `empty` class). */
  private readonly _text = signal(this._input.value ?? '');

  /**
   * The last value applied by an internal mutation (step/commit/clear) that
   * already set the edit text itself. Lets the value→text effect ignore those
   * changes while focused, so a deferred flush can't clobber text the user
   * typed right after (`undefined` = nothing applied internally yet).
   */
  private readonly _appliedValue = signal<number | null | undefined>(undefined);

  /** Whether the input holds no text at all. */
  public override readonly empty = computed(() => this._text() === '');

  constructor() {
    super();

    // External value → text. While focused only overwrite when the parsed text
    // semantically differs (programmatic set wins, typing is never clobbered).
    effect(() => {
      const value = this.value() ?? null;
      const text = untracked(() => this._text());
      if (!this.focused()) {
        const next = value === null ? '' : this._displayFormat().format(value);
        if (next !== text) {
          this._setText(next);
        }
        // Record the reconciled value so a later focus (with no intervening
        // external change) short-circuits below instead of re-parsing the
        // edit text — otherwise focusing then typing can race this effect,
        // which would clobber the freshly typed text back to `value`.
        this._appliedValue.set(value);
        return;
      }
      // Only reflect EXTERNAL value changes into the edit text. Internal
      // mutations (step/commit/clear) set the text themselves and record
      // `_appliedValue`; skipping them here prevents a deferred effect flush
      // from clobbering text the user typed right after such a mutation.
      if (value === untracked(() => this._appliedValue())) {
        return;
      }
      const parsed = parseLocaleNumber(
        text,
        untracked(() => this._localeInfo())
      );
      const current = parsed.kind === 'value' ? parsed.value : null;
      if (current !== value) {
        this._setText(value === null ? '' : this._editFormat().format(value));
      }
      this._appliedValue.set(value);
    });

    domEventHandler(this.element, 'input', () => {
      this._text.set(this._input.value);
    });

    domEventHandler(this.element, 'focus', () => {
      this.focused.set(true);
      const value = this.value() ?? null;
      if (value !== null) {
        this._setText(this._editFormat().format(value));
      }
    });

    domEventHandler(this.element, 'blur', () => {
      this._commit();
      this.focused.set(false);
      this.markTouched();
    });

    domEventHandler(this.element, 'keydown', event => {
      if (this.disabled() || this.readonly()) {
        return;
      }
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        if (event.altKey || event.ctrlKey || event.metaKey) {
          return;
        }
        event.preventDefault();
        this.stepValue(event.key === 'ArrowUp' ? 1 : -1, event.shiftKey);
      } else if (event.key === 'Enter') {
        // Commit before a potential form submit sees the value.
        this._commit();
      }
    });
  }

  /**
   * Steps the value by `step` (or `bigStep`) without wrapping. Uncommitted
   * typed text is parsed and used as the base; an empty value seeds at `min`
   * (increment) or `max` (decrement), falling back to `0` on open bounds.
   */
  public override stepValue(direction: 1 | -1, big = false): boolean {
    if (this.disabled() || this.readonly()) {
      return false;
    }
    const parsed = parseLocaleNumber(this._input.value, this._localeInfo());
    const base =
      parsed.kind === 'value'
        ? clampValue(parsed.value, this.min(), this.max())
        : (this.value() ?? null);
    const amount = big ? this.appliedBigStep() : this.appliedStep();
    const next = stepNumberValue(base, direction, amount, this.min(), this.max());
    this._appliedValue.set(next);
    this.value.set(next);
    this._setText((this.focused() ? this._editFormat() : this._displayFormat()).format(next));
    return true;
  }

  /** Whether stepping in `direction` is currently possible (bound not reached). */
  public override canStepValue(direction: 1 | -1): boolean {
    if (this.disabled() || this.readonly()) {
      return false;
    }
    const value = this.value() ?? null;
    if (value === null) {
      return true;
    }
    const bound = direction === 1 ? this.max() : this.min();
    if (bound == null) {
      return true;
    }
    return direction === 1 ? value < bound : value > bound;
  }

  /** Clears value and text (invoked by a surrounding field's clear button). */
  public override clearValue(): boolean {
    if (this.disabled() || this.readonly()) {
      return false;
    }
    this._appliedValue.set(null);
    this.value.set(null);
    this._setText('');
    return true;
  }

  /**
   * Parses the current text and commits it to the value model: empty → `null`,
   * out-of-range → clamped, unparseable → reverted to the last committed value.
   */
  private _commit(): void {
    const format = this.focused() ? this._editFormat() : this._displayFormat();
    const parsed = parseLocaleNumber(this._input.value, this._localeInfo());
    if (parsed.kind === 'invalid') {
      const value = this.value() ?? null;
      this._appliedValue.set(value);
      this._setText(value === null ? '' : format.format(value));
      return;
    }
    const next = parsed.kind === 'empty' ? null : clampValue(parsed.value, this.min(), this.max());
    this._appliedValue.set(next);
    this.value.set(next);
    this._setText(next === null ? '' : format.format(next));
  }

  private _setText(text: string): void {
    this._input.value = text;
    this._text.set(text);
  }
}
