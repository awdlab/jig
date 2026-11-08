import {
  booleanAttribute,
  Component,
  input,
  output,
  viewChild,
  ElementRef,
  computed,
  effect,
  inject,
  isDevMode,
} from '@angular/core';
import { JigPt, provideSelf, ValueControlBase } from '@awdlab/jig/base';
import { hostOrGeneratedId } from '@awdlab/jig/utils-ng';
import { JigDrag, type JigDragInfo } from '@awdlab/jig/directives';
import { I18n } from '@awdlab/jig/i18n';
import { sliderControlTemplate } from '@awdlab/jig-themes/templates/slider';
import { addWithPrecision, clamp, JigError } from '@awdlab/jig/utils';

import type { InputGeneric } from '@awdlab/jig/utils';
import { inlineArrowStep, isRtl } from '@awdlab/jig/api/ng';

/**
 * The value type of the slider: a `[start, end]` tuple when `range` is `true`,
 * a single number otherwise.
 */
export type SliderValue<Range extends boolean> =
  InputGeneric<Range, false> extends true ? [number, number] : number;

/** Which of the two range handles an operation targets. */
export type SliderHandle = 'start' | 'end';

/**
 * @category control
 */
@Component({
  selector: 'jig-slider',
  templateUrl: './slider.html',
  imports: [JigPt, JigDrag],
  providers: [provideSelf(JigSlider)],
  host: {
    '[attr.role]': 'isRange() ? "group" : "slider"',
    '[attr.aria-valuemin]': 'isRange() ? null : min()',
    '[attr.aria-valuemax]': 'isRange() ? null : max()',
    '[attr.aria-valuenow]': 'isRange() ? null : values()[1]',
    '[attr.aria-readonly]': '!isRange() && readonly() ? "true" : null',
    '[attr.disabled]': 'disabled() ? "" : null',
    '[attr.aria-labelledby]': 'labelledBy()',
    '[id]': 'inputId()',
    '[attr.aria-label]': 'label()',
    '[attr.aria-orientation]': 'isRange() ? null : vertical() ? "vertical" : "horizontal"',
    '[attr.aria-valuetext]': 'isRange() ? null : valueTextFor(values()[1])',
    '[attr.tabindex]': 'isRange() ? null : disabled() ? -1 : 0',
    '(keydown)': 'onHostKeyDown($event)',
    '(blur)': 'markTouched()',
  },
})
export class JigSlider<Range extends boolean = false> extends ValueControlBase<
  'slider',
  SliderValue<Range>
> {
  /**
   * The ID for the control, rendered on its host. Defaults to the host's `id` attribute, else a
   * generated id.
   */
  public override readonly inputId = input<string>(hostOrGeneratedId());

  protected readonly theme = this.injectThemeTemplate(sliderControlTemplate, {
    root: true,
    invalid: () => this.invalidState(),
    horizontal: () => !this.vertical(),
    vertical: () => this.vertical(),
    range: () => this.isRange(),
    readonly: () => this.readonly(),
  });

  protected readonly translations = inject(I18n).translations;

  private readonly _track = viewChild.required<ElementRef<HTMLDivElement>>('track');

  /**
   * The minimum value of the slider.
   * @default 0
   */
  public readonly min = input<number>(0);

  /**
   * Whether the slider is oriented vertically instead of horizontally.
   * @default false
   */
  public readonly vertical = input(false, { transform: booleanAttribute });

  /**
   * The maximum value of the slider.
   * @default 100
   */
  public readonly max = input<number>(100);

  /**
   * The increment between selectable values.
   * @default 1
   */
  public readonly step = input<number>(1);

  /**
   * The increment applied with `PageUp`/`PageDown`. Non-finite or non-positive
   * values fall back to `step * 10`.
   * @default step * 10
   */
  public readonly bigStep = input<number>();

  /** {@link bigStep}, falling back to ten {@link step}s. */
  protected readonly appliedBigStep = computed(() => {
    const bigStep = this.bigStep();
    return bigStep !== undefined && Number.isFinite(bigStep) && bigStep > 0
      ? bigStep
      : this.step() * 10;
  });

  /**
   * Turns the slider into a two-handle range slider. When enabled the value
   * becomes a `[start, end]` tuple instead of a single number.
   *
   * See {@link minRangeDistance} to require a gap between the handles.
   * @default false
   */
  public readonly range = input<Range>();

  /**
   * The smallest gap the two handles may have, in value units. Dragging or
   * stepping a handle stops this far from the other one; the other handle never
   * moves.
   *
   * Only applies when {@link range} is `true`. Values outside `0 … max - min` are
   * clamped into that window, with a dev-mode error.
   * @default 0
   */
  public readonly minRangeDistance = input<number>(0);

  /**
   * The value text representation for accessibility.
   * If both {@link valueText} and {@link valueTextFn} are provided, {@link valueText} takes precedence.
   */
  public readonly valueText = input<string>();

  /**
   * A function that generates the value text representation for accessibility.
   * If both {@link valueText} and {@link valueTextFn} are provided, {@link valueText} takes precedence.
   */
  public readonly valueTextFn = input<(value: number) => string>();

  /**
   * Emits the settled value when the user finishes an interaction: a drag
   * release, a track click, or a key press. Fires even when the value did not
   * change — use {@link value} for continuous updates.
   */
  public readonly valueCommitted = output<SliderValue<Range>>();

  /** Whether the slider runs in two-handle range mode. */
  protected readonly isRange = computed<boolean>(() => !!this.range());

  /**
   * The `[start, end]` pair in value space, sorted, clamped to
   * {@link min}/{@link max} and widened to {@link minRangeDistance}. Outside range
   * mode the start is pinned to {@link min} so the fill spans from the track
   * origin.
   */
  protected readonly values = computed<[number, number]>(() => {
    const v = this.value() as number | [number, number] | undefined;
    if (this.isRange()) {
      const pair: [number, number] = Array.isArray(v) ? v : [this.min(), this.max()];
      return this.enforceGap(
        this.clampValue(Math.min(...pair)),
        this.clampValue(Math.max(...pair))
      );
    }
    return [this.min(), this.clampValue(typeof v === 'number' ? v : this.min())];
  });

  /** {@link minRangeDistance}, held to a gap the track can actually hold. */
  private readonly gap = computed(() =>
    clamp(this.minRangeDistance(), 0, Math.max(0, this.max() - this.min()))
  );

  protected readonly startPercent = computed(() => this.percentOf(this.values()[0]));
  protected readonly endPercent = computed(() => this.percentOf(this.values()[1]));

  protected readonly startBounds = computed(() => this.handleBounds('start'));
  protected readonly endBounds = computed(() => this.handleBounds('end'));

  constructor() {
    super();
    if (isDevMode()) {
      effect(() => {
        if (!this.isRange()) {
          return;
        }
        const distance = this.minRangeDistance();
        if (distance !== this.gap()) {
          console.error(
            new JigError(
              'slider',
              `minRangeDistance must be between 0 and max - min (${this.max() - this.min()}); ` +
                `${distance} was clamped to ${this.gap()}.`
            )
          );
        }
        const bound = this.value();
        const [start, end] = this.values();
        if (Array.isArray(bound) && (bound[0] !== start || bound[1] !== end)) {
          console.error(
            new JigError(
              'slider',
              `value [${bound.join(', ')}] does not satisfy min, max and minRangeDistance; ` +
                `displayed as [${start}, ${end}].`
            )
          );
        }
      });
    }
  }

  protected valueTextFor(value: number): string | null {
    const valueText = this.valueText();
    if (valueText) {
      return valueText;
    }
    return this.valueTextFn()?.(value) ?? null;
  }

  /** The handle the running pointer gesture moves. */
  private _dragHandle?: SliderHandle;

  /** Claims the gesture for a thumb before its pointerdown bubbles to {@link onTrackPointerDown}. */
  protected onThumbPointerDown(handle: SliderHandle) {
    this._dragHandle = handle;
  }

  /** Jumps the nearest handle to a press beside the thumbs, then leaves it to the drag. */
  protected onTrackPointerDown(event: PointerEvent) {
    if (this._dragHandle || event.button !== 0 || this.readonly() || this.disabled()) {
      return;
    }
    const cursorPos = this.vertical() ? event.clientY : event.clientX;
    const next = this.valueAtPosition(cursorPos);
    this._dragHandle = this.isRange() ? this.nearestHandle(next) : 'end';
    this.setHandle(this._dragHandle, next);
  }

  protected onDragged(delta: JigDragInfo) {
    if (!this._dragHandle || this.readonly() || this.disabled()) {
      return;
    }
    const cursorPos = this.vertical() ? delta.absoluteY : delta.absoluteX;
    this.setHandle(this._dragHandle, this.valueAtPosition(cursorPos));
  }

  protected onDragEnd() {
    const handle = this._dragHandle;
    this._dragHandle = undefined;
    if (!handle || this.readonly() || this.disabled()) {
      return;
    }
    this.commitValue();
  }

  private commitValue(): void {
    this.valueCommitted.emit(this.value());
  }

  protected onKeyDown(event: KeyboardEvent, handle: SliderHandle = 'end') {
    if (this.readonly() || this.disabled()) {
      return;
    }
    const [lower, upper] = handle === 'start' ? this.startBounds() : this.endBounds();
    const current = handle === 'start' ? this.values()[0] : this.values()[1];
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowRight': {
        // Only the inline axis flips; Up/Down below stay physical.
        const step = inlineArrowStep(event.currentTarget as Element, event.key);
        this.setHandle(handle, addWithPrecision(current, step * this.step()));
        break;
      }
      case 'ArrowDown':
        this.setHandle(handle, addWithPrecision(current, -this.step()));
        break;
      case 'ArrowUp':
        this.setHandle(handle, addWithPrecision(current, this.step()));
        break;
      case 'PageDown':
        this.setHandle(handle, addWithPrecision(current, -this.appliedBigStep()));
        break;
      case 'PageUp':
        this.setHandle(handle, addWithPrecision(current, this.appliedBigStep()));
        break;
      case 'Home':
        this.setHandle(handle, lower);
        break;
      case 'End':
        this.setHandle(handle, upper);
        break;
      default:
        return;
    }
    event.preventDefault();
    this.commitValue();
  }

  /** Host keyboard only drives single mode; range mode keys land on the thumbs. */
  protected onHostKeyDown(event: KeyboardEvent) {
    if (this.isRange()) {
      return;
    }
    this.onKeyDown(event);
  }

  /** The handle closest to a value; ties go to the start handle. */
  private nearestHandle(value: number): SliderHandle {
    const [start, end] = this.values();
    return Math.abs(value - start) <= Math.abs(value - end) ? 'start' : 'end';
  }

  /** Rounds a viewport coordinate along the track to the nearest stepped value. */
  private valueAtPosition(cursorPos: number): number {
    const track = this._track().nativeElement;
    const trackRect = track.getBoundingClientRect();
    const trackLength = this.vertical() ? trackRect.height : trackRect.width;
    // Distance from the track's minimum end: the bottom when vertical, otherwise
    // the inline-start edge — which is the right edge in RTL.
    const fromMin = this.vertical()
      ? trackRect.bottom - cursorPos
      : isRtl(track)
        ? trackRect.right - cursorPos
        : cursorPos - trackRect.left;
    const unstepped = this.min() + (fromMin / trackLength) * (this.max() - this.min());
    const steps = Math.round((unstepped - this.min()) / this.step());
    return addWithPrecision(this.min(), steps * this.step());
  }

  /** The legal `[lower, upper]` a handle may be moved to. */
  private handleBounds(handle: SliderHandle): [number, number] {
    if (!this.isRange()) {
      return [this.min(), this.max()];
    }
    const [start, end] = this.values();
    const gap = this.gap();
    return handle === 'start' ? [this.min(), end - gap] : [start + gap, this.max()];
  }

  /** Widens a clamped pair until it satisfies the gap, moving the end first. */
  private enforceGap(start: number, end: number): [number, number] {
    const gap = this.gap();
    if (end - start >= gap) {
      return [start, end];
    }
    return start + gap <= this.max() ? [start, start + gap] : [this.max() - gap, this.max()];
  }

  private setHandle(handle: SliderHandle, next: number): void {
    const [lower, upper] = handle === 'start' ? this.startBounds() : this.endBounds();
    const clamped = clamp(next, lower, upper);
    if (this.isRange()) {
      const [start, end] = this.values();
      const pair: [number, number] = handle === 'start' ? [clamped, end] : [start, clamped];
      this.value.set(pair as SliderValue<Range>);
      return;
    }
    this.value.set(clamped as SliderValue<Range>);
  }

  private percentOf(value: number): number {
    const span = this.max() - this.min();
    if (span <= 0) {
      return 0;
    }
    return Math.min(100, Math.max(0, ((value - this.min()) / span) * 100));
  }

  private clampValue(value: number): number {
    return Math.min(this.max(), Math.max(this.min(), value));
  }
}
