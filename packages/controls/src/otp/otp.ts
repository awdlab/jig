import {
  booleanAttribute,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  numberAttribute,
  output,
  signal,
  untracked,
  viewChildren,
} from '@angular/core';
import { JigPt, provideSelf, ValueControlBase } from '@awdlab/jig/base';
import { I18n } from '@awdlab/jig/i18n';
import { otpControlTemplate } from '@awdlab/jig-themes/templates/otp';

/**
 * Coerce a requested length to a sane cell count (at least one). Coerces
 * strings too, so a value set without the `numberAttribute` transform (e.g. via
 * a dynamic property write) still yields a number instead of collapsing to 1.
 */
function normalizeLength(value: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
}

/**
 * A one-time-password / verification-code input that splits a short code across
 * a row of single-character cells (like the PrimeNG `InputOtp`).
 *
 * - Typing a character fills the active cell and advances focus to the next.
 * - **Backspace** clears the active cell, or steps back and clears the previous
 *   one when the active cell is already empty.
 * - **←/→** move between cells, **Home/End** jump to the first/last.
 * - Pasting a code distributes its characters across the cells.
 *
 * It is a self-contained value control — bind `[value]`/`(valueChange)` (or
 * `[(value)]`) directly on `<jig-otp>`. The value is the composed string
 * (`null` while every cell is empty); {@link completed} fires once the whole
 * code is filled.
 *
 * @category control
 */
@Component({
  selector: 'jig-otp',
  templateUrl: './otp.html',
  imports: [JigPt],
  providers: [provideSelf(JigOtp)],
  host: {
    role: 'group',
    '[attr.aria-label]': 'label()',
    '[attr.aria-labelledby]': 'labelledBy()',
    '[attr.aria-invalid]': 'invalidState() ? "true" : null',
    '[attr.aria-required]': 'requiredState() ? "true" : null',
    '(focusout)': 'onFocusOut($event)',
  },
})
export class JigOtp extends ValueControlBase<'otp', string | null> {
  protected readonly theme = this.injectThemeTemplate(otpControlTemplate, {
    root: true,
    invalid: () => this.invalidState(),
  });
  protected readonly i18n = inject(I18n).translations;

  /**
   * The number of character cells the code is split across.
   * @default 6
   */
  public readonly length = input(6, { transform: numberAttribute });
  /**
   * Render each entered character as a masked dot instead of the character
   * itself (like a password field).
   * @default false
   */
  public readonly mask = input(false, { transform: booleanAttribute });
  /**
   * Restrict entry to digits (`0`–`9`) only. Also switches the on-screen
   * keyboard to numeric on touch devices.
   * @default false
   */
  public readonly integerOnly = input(false, { transform: booleanAttribute });

  /** Emits the fully composed code once every cell holds a character. */
  public readonly completed = output<string>();

  /** Per-cell characters — the source of truth the composed value derives from. */
  protected readonly cells = signal<string[]>([]);

  /** Effective, sanitized cell count. */
  protected readonly appliedLength = computed(() => normalizeLength(this.length()));

  /** Cell indices for the template `@for` loop. */
  protected readonly indices = computed(() =>
    Array.from({ length: this.appliedLength() }, (_, i) => i)
  );

  protected readonly boxType = computed(() => (this.mask() ? 'password' : 'text'));
  protected readonly boxInputMode = computed(() => (this.integerOnly() ? 'numeric' : 'text'));

  private readonly _boxes = viewChildren<ElementRef<HTMLInputElement>>('box');

  constructor() {
    super();

    // Keep the cell array sized to `length`, preserving already-typed chars so
    // shrinking/growing the field does not wipe what the user entered.
    effect(() => {
      const len = this.appliedLength();
      const cur = untracked(() => this.cells());
      if (cur.length !== len) {
        this.cells.set(Array.from({ length: len }, (_, i) => cur[i] ?? ''));
      }
    });

    // External value → cells. Guard the write-loop by comparing to the current
    // composed value so internal typing never re-triggers a reset.
    effect(() => {
      const len = this.appliedLength();
      const ext = this.value() ?? '';
      const current = untracked(() => this.cells().join(''));
      if (ext !== current) {
        const chars = ext.split('').slice(0, len);
        this.cells.set(Array.from({ length: len }, (_, i) => chars[i] ?? ''));
      }
    });

    // Cells → external value + completion. `null` while the field is empty.
    effect(() => {
      const cells = this.cells();
      const composed = cells.join('');
      this.value.set(composed === '' ? null : composed);
      if (cells.length > 0 && cells.every(c => c !== '')) {
        this.completed.emit(composed);
      }
    });
  }

  /** Accessible name for a cell — its 1-based position within the code. */
  protected cellLabel(index: number): string {
    return this.i18n['otp_cellLabel']({ index: index + 1, total: this.appliedLength() });
  }

  /**
   * The control fully owns each cell's value: every text mutation is cancelled
   * and the character is written to the {@link cells} signal instead, which the
   * `[value]` binding reflects back. This makes overtype work from any caret
   * position (no `maxlength`/selection tricks) and lets a single multi-character
   * insert — e.g. SMS one-time-code autofill — spread across the cells.
   */
  protected onBeforeInput(index: number, event: InputEvent): void {
    if (this.disabled() || this.readonly()) return;
    const type = event.inputType;

    // Deletions: desktop goes through keydown, but mobile soft keyboards emit
    // these directly, so handle them here too.
    if (type.startsWith('delete')) {
      event.preventDefault();
      if (this.cells()[index]) {
        this._setCell(index, '');
      } else if (index > 0) {
        this._setCell(index - 1, '');
        this._focusCell(index - 1);
      }
      return;
    }

    // Paste/drop are handled by the dedicated (paste) handler.
    if (type === 'insertFromPaste' || type === 'insertFromDrop') return;
    if (!type.startsWith('insert')) return;

    event.preventDefault();
    let data = event.data ?? '';
    if (this.integerOnly()) data = data.replace(/\D/g, '');
    if (!data) return;
    this._fillFrom(index, data);
  }

  protected onKeyDown(index: number, event: KeyboardEvent): void {
    if (this.disabled() || this.readonly()) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    switch (event.key) {
      case 'Backspace': {
        event.preventDefault();
        const cells = this.cells();
        if (cells[index]) {
          this._setCell(index, '');
        } else if (index > 0) {
          this._setCell(index - 1, '');
          this._focusCell(index - 1);
        }
        break;
      }
      case 'Delete':
        event.preventDefault();
        this._setCell(index, '');
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (index > 0) this._focusCell(index - 1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (index < this.appliedLength() - 1) this._focusCell(index + 1);
        break;
      case 'Home':
        event.preventDefault();
        this._focusCell(0);
        break;
      case 'End':
        event.preventDefault();
        this._focusCell(this.appliedLength() - 1);
        break;
    }
  }

  protected onPaste(event: ClipboardEvent): void {
    if (this.disabled() || this.readonly()) return;
    event.preventDefault();
    let text = event.clipboardData?.getData('text') ?? '';
    text = this.integerOnly() ? text.replace(/\D/g, '') : text.replace(/\s/g, '');
    if (!text) return;
    // A paste replaces the whole code from the first cell, clearing the rest.
    const len = this.appliedLength();
    const chars = text.split('').slice(0, len);
    this.cells.set(Array.from({ length: len }, (_, i) => chars[i] ?? ''));
    this._focusCell(chars.length >= len ? len - 1 : chars.length);
  }

  /**
   * Mark touched once focus leaves the whole group — moving between cells keeps
   * the host focused, so those intra-cell hops don't count as a blur.
   */
  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget;
    if (next instanceof Node && this.element.nativeElement.contains(next)) {
      return;
    }
    this.markTouched();
  }

  /** Clears every cell (also serves a surrounding field's clear button). */
  public override clearValue(): boolean {
    if (this.disabled() || this.readonly()) return false;
    this.cells.set(Array.from({ length: this.appliedLength() }, () => ''));
    this._focusCell(0);
    return true;
  }

  private _setCell(index: number, value: string): void {
    const next = [...this.cells()];
    next[index] = value;
    this.cells.set(next);
  }

  /** Writes `text` into consecutive cells starting at `start`, then focuses the
   * next empty cell (or the last one). Used by typing and autofill. */
  private _fillFrom(start: number, text: string): void {
    const len = this.appliedLength();
    const next = [...this.cells()];
    let i = start;
    for (const ch of text.split('')) {
      if (i >= len) break;
      next[i] = ch;
      i++;
    }
    this.cells.set(next);
    this._focusCell(Math.min(i, len - 1));
  }

  private _focusCell(index: number): void {
    this._boxes()[index]?.nativeElement.focus();
  }
}
