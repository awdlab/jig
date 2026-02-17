import {
  Component,
  input,
  ChangeDetectionStrategy,
  viewChild,
  ElementRef,
  computed,
} from '@angular/core';
import { NgnPt, provideSelf, ValueControlBase } from '@ngneers/controls/base';
import { NgnDrag, type NgnDragInfo } from '@ngneers/controls/directives';
import { sliderControlTemplate } from '@ngneers/controls-themes/templates/slider';

/**
 * @category control
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-slider',
  templateUrl: './slider.html',
  imports: [NgnPt, NgnDrag],
  providers: [provideSelf(NgnSlider)],
  host: {
    role: 'slider',
    '[attr.aria-valuemin]': 'min()',
    '[attr.aria-valuemax]': 'max()',
    '[attr.aria-valuenow]': 'value()',
    '[attr.aria-readonly]': 'readonly() ? "true" : null',
    '[attr.disabled]': 'disabled() ? "" : null',
    '[attr.aria-labelledby]': 'labelledBy()',
    '[attr.aria-label]': 'label()',
    '[attr.aria-orientation]': 'vertical() ? "vertical" : "horizontal"',
    '[attr.aria-valuetext]': 'valueTextValue()',
    '[tabindex]': 'disabled() ? -1 : 0',
    '(keydown)': 'onKeyDown($event)',
    '(blur)': 'touched.set(true)',
  },
})
export class NgnSlider extends ValueControlBase<'slider', number> {
  protected readonly theme = this.injectThemeTemplate(sliderControlTemplate, {
    root: true,
    invalid: () => this.invalid(),
    horizontal: () => !this.vertical(),
    vertical: () => this.vertical(),
  });

  private readonly _track = viewChild.required<ElementRef<HTMLDivElement>>('track');

  /**
   * The minimum value of the slider.
   */
  public readonly min = input<number>(0);

  /**
   * Whether the slider is vertical.
   */
  public readonly vertical = input<boolean>(false);

  /**
   * The maximum value of the slider.
   */
  public readonly max = input<number>(100);

  /**
   * The step increment value.
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

  protected readonly left = computed(() => {
    const percent = ((this.value() - this.min()) / (this.max() - this.min())) * 100;
    return Math.min(100, Math.max(0, percent));
  });

  constructor() {
    super();
  }

  protected readonly valueTextValue = computed(() => {
    const valueText = this.valueText();
    if (valueText) {
      return valueText;
    }
    const valueTextFn = this.valueTextFn();
    if (valueTextFn) {
      return valueTextFn(this.value());
    }
    return null;
  });

  protected onDragged(delta: NgnDragInfo) {
    if (this.readonly() || this.disabled()) {
      return;
    }
    const cursorPos = this.vertical() ? delta.absoluteY : delta.absoluteX;
    this.dragToPosition(cursorPos);
  }

  private dragToPosition(cursorPos: number) {
    const trackEl = this._track().nativeElement;
    const trackRect = trackEl.getBoundingClientRect();
    const trackStart = this.vertical() ? trackRect.top : trackRect.left;
    const trackLength = this.vertical() ? trackRect.height : trackRect.width;
    const positionInTrack = cursorPos - trackStart;
    const correctedPositionInTrack = this.vertical()
      ? trackLength - positionInTrack
      : positionInTrack;
    const positionPercent = correctedPositionInTrack / trackLength;
    const newValueUnstepped = this.min() + positionPercent * (this.max() - this.min());
    const steppedValue =
      Math.round((newValueUnstepped - this.min()) / this.step()) * this.step() + this.min();
    this.value.set(this.clampValue(steppedValue));
  }

  private clampValue(value: number): number {
    return Math.min(this.max(), Math.max(this.min(), value));
  }

  protected onDragEnd() {}

  protected onKeyDown(event: KeyboardEvent) {
    if (this.readonly() || this.disabled()) {
      return;
    }
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        this.value.update(v => this.clampValue(v - this.step()));
        event.preventDefault();
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        this.value.update(v => this.clampValue(v + this.step()));
        event.preventDefault();
        break;
      case 'Home':
        this.value.set(this.min());
        this.onDragEnd();
        event.preventDefault();
        break;
      case 'End':
        this.value.set(this.max());
        this.onDragEnd();
        event.preventDefault();
        break;
    }
  }

  protected thumbClicked(event: PointerEvent) {
    event.stopPropagation();
  }
  protected trackClicked(event: PointerEvent) {
    if (this.readonly() || this.disabled()) {
      return;
    }
    const trackEl = this._track().nativeElement;
    const trackRect = trackEl.getBoundingClientRect();
    const clickPosition = this.vertical()
      ? event.clientY - trackRect.top
      : event.clientX - trackRect.left;
    this.dragToPosition(
      this.vertical() ? trackRect.top + clickPosition : trackRect.left + clickPosition
    );
  }
}
