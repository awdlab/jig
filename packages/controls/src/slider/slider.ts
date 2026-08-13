import {
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
import { JigDrag, type JigDragInfo } from '@awdlab/jig/directives';
import { I18n } from '@awdlab/jig/i18n';
import { sliderControlTemplate } from '@awdlab/jig-themes/templates/slider';
import { JigError } from '@awdlab/jig/utils';

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
  public readonly vertical = input<boolean>(false);

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
  public readonly valueCommit = output<SliderValue<Range>>();

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
    Math.min(Math.max(0, this.max() - this.min()), Math.max(0, this.minRangeDistance()))
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

  protected onDragged(delta: JigDragInfo, handle: SliderHandle = 'end') {
    if (this.readonly() || this.disabled()) {
      return;
    }
    const cursorPos = this.vertical() ? delta.absoluteY : delta.absoluteX;
    this.setHandle(handle, this.valueAtPosition(cursorPos));
  }

  /** Set when a drag ends, so the synthesized click that follows it doesn't reach {@link trackClicked}. */
  private _suppressTrackClick = false;

  protected onDragEnd() {
    this._suppressTrackClick = true;
    if (this.readonly() || this.disabled()) {
      return;
    }
    this.commitValue();
  }

  private commitValue(): void {
    this.valueCommit.emit(this.value());
  }

  /** Clears the drag-release click suppression; a genuine track interaction starts here, not with a stale flag. */
  protected onTrackPointerDown() {
    this._suppressTrackClick = false;
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
        this.setHandle(handle, current + step * this.step());
        break;
      }
      case 'ArrowDown':
        this.setHandle(handle, current - this.step());
        break;
      case 'ArrowUp':
        this.setHandle(handle, current + this.step());
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

  protected thumbClicked(event: PointerEvent) {
    event.stopPropagation();
  }

  protected trackClicked(event: PointerEvent) {
    if (this._suppressTrackClick) {
      this._suppressTrackClick = false;
      return;
    }
    if (this.readonly() || this.disabled()) {
      return;
    }
    const cursorPos = this.vertical() ? event.clientY : event.clientX;
    const next = this.valueAtPosition(cursorPos);
    this.setHandle(this.isRange() ? this.nearestHandle(next) : 'end', next);
    this.commitValue();
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
    return Math.round((unstepped - this.min()) / this.step()) * this.step() + this.min();
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
    const clamped = Math.min(upper, Math.max(lower, next));
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
