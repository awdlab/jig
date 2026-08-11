import { Component, input, viewChild, ElementRef, computed } from '@angular/core';
import { JigPt, provideSelf, ValueControlBase } from '@awdlab/jig/base';
import { JigDrag, type JigDragInfo } from '@awdlab/jig/directives';
import { sliderControlTemplate } from '@awdlab/jig-themes/templates/slider';

import type { InputGeneric } from '@awdlab/jig/utils';

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
    role: 'slider',
    '[attr.aria-valuemin]': 'min()',
    '[attr.aria-valuemax]': 'max()',
    '[attr.aria-valuenow]': 'values()[1]',
    '[attr.aria-readonly]': 'readonly() ? "true" : null',
    '[attr.disabled]': 'disabled() ? "" : null',
    '[attr.aria-labelledby]': 'labelledBy()',
    '[attr.aria-label]': 'label()',
    '[attr.aria-orientation]': 'vertical() ? "vertical" : "horizontal"',
    '[attr.aria-valuetext]': 'valueTextFor(values()[1])',
    '[tabindex]': 'disabled() ? -1 : 0',
    '(keydown)': 'onKeyDown($event)',
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
  });

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
   * The value text representation for accessibility.
   * If both {@link valueText} and {@link valueTextFn} are provided, {@link valueText} takes precedence.
   */
  public readonly valueText = input<string>();

  /**
   * A function that generates the value text representation for accessibility.
   * If both {@link valueText} and {@link valueTextFn} are provided, {@link valueText} takes precedence.
   */
  public readonly valueTextFn = input<(value: number) => string>();

  /** Whether the slider runs in two-handle range mode. */
  protected readonly isRange = computed<boolean>(() => false);

  /**
   * The `[start, end]` pair in value space. Outside range mode the start is
   * pinned to {@link min} so the fill spans from the track origin.
   */
  protected readonly values = computed<[number, number]>(() => {
    const v = this.value() as number | [number, number] | undefined;
    return [this.min(), this.clampValue(typeof v === 'number' ? v : this.min())];
  });

  protected readonly startPercent = computed(() => this.percentOf(this.values()[0]));
  protected readonly endPercent = computed(() => this.percentOf(this.values()[1]));

  protected readonly startBounds = computed(() => this.handleBounds('start'));
  protected readonly endBounds = computed(() => this.handleBounds('end'));

  constructor() {
    super();
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

  protected onDragEnd() {}

  protected onKeyDown(event: KeyboardEvent, handle: SliderHandle = 'end') {
    if (this.readonly() || this.disabled()) {
      return;
    }
    const [lower, upper] = handle === 'start' ? this.startBounds() : this.endBounds();
    const current = handle === 'start' ? this.values()[0] : this.values()[1];
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        this.setHandle(handle, current - this.step());
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        this.setHandle(handle, current + this.step());
        break;
      case 'Home':
        this.setHandle(handle, lower);
        this.onDragEnd();
        break;
      case 'End':
        this.setHandle(handle, upper);
        this.onDragEnd();
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  protected thumbClicked(event: PointerEvent) {
    event.stopPropagation();
  }

  protected trackClicked(event: PointerEvent) {
    if (this.readonly() || this.disabled()) {
      return;
    }
    const cursorPos = this.vertical() ? event.clientY : event.clientX;
    this.setHandle('end', this.valueAtPosition(cursorPos));
  }

  /** Rounds a viewport coordinate along the track to the nearest stepped value. */
  private valueAtPosition(cursorPos: number): number {
    const trackRect = this._track().nativeElement.getBoundingClientRect();
    const trackStart = this.vertical() ? trackRect.top : trackRect.left;
    const trackLength = this.vertical() ? trackRect.height : trackRect.width;
    const positionInTrack = cursorPos - trackStart;
    const corrected = this.vertical() ? trackLength - positionInTrack : positionInTrack;
    const unstepped = this.min() + (corrected / trackLength) * (this.max() - this.min());
    return Math.round((unstepped - this.min()) / this.step()) * this.step() + this.min();
  }

  /** The legal `[lower, upper]` a handle may be moved to. */
  private handleBounds(handle: SliderHandle): [number, number] {
    if (!this.isRange()) {
      return [this.min(), this.max()];
    }
    const [start, end] = this.values();
    return handle === 'start' ? [this.min(), end] : [start, this.max()];
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
