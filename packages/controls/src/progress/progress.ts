import { Component, input, computed, booleanAttribute } from '@angular/core';
import { JigBase, JigPt, provideSelf } from '@awdlab/jig/base';
import { progressControlTemplate } from '@awdlab/jig-themes/templates/progress';

const TAU = Math.PI * 2;

/**
 * @category control
 */
@Component({
  selector: 'jig-progress',
  templateUrl: './progress.html',
  imports: [JigPt],
  providers: [provideSelf(JigProgress)],
  host: {
    role: 'progressbar',
    '[class.jig-motion-loop]': 'indeterminate()',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': '100',
    '[attr.aria-valuenow]': 'indeterminate() ? null : safeValue()',
    '[style.--progress.%]': 'indeterminate() ? null : safeValue()',
  },
})
export class JigProgress extends JigBase<'progress'> {
  protected readonly theme = this.injectThemeTemplate(progressControlTemplate, {
    root: true,
    indeterminate: () => this.indeterminate(),
    circular: () => this.circular(),
  });

  /**
   * The current progress value, clamped to the 0-100 range.
   * @default 0
   */
  public readonly value = input<number>(0);
  /**
   * Whether the progress indicator is indeterminate (animated, no fixed value).
   * @default false
   */
  public readonly indeterminate = input(false, { transform: booleanAttribute });
  /**
   * Whether the progress indicator renders as a circle instead of a bar.
   * @default false
   */
  public readonly circular = input(false, { transform: booleanAttribute });

  /**
   * Radius of the circular progress indicator, in px. Only applies when {@link circular} is `true`.
   * @default 40
   */
  public readonly radius = input<number>(40);

  /**
   * Thickness of the circular progress indicator stroke, in px. Only applies when {@link circular} is `true`.
   * @default 8
   */
  public readonly thickness = input<number>(8);

  protected readonly safeValue = computed(() => Math.min(Math.max(this.value(), 0), 100));

  protected readonly safeRadius = computed(() => Math.max(this.radius(), 0));
  protected readonly safeThickness = computed(() => Math.max(this.thickness(), 1));

  protected readonly svgSize = computed(() => {
    // Full size of the SVG in px.
    return this.safeRadius() * 2 + this.safeThickness();
  });

  protected readonly svgCenter = computed(() => this.svgSize() / 2);

  protected readonly circumference = computed(() => TAU * this.safeRadius());

  protected readonly strokeDasharray = computed(() => {
    const circumference = this.circumference();
    // Arc length for indeterminate mode.
    if (this.indeterminate()) {
      return `${circumference * 0.28} ${circumference}`;
    }
    return `${circumference}`;
  });

  protected readonly strokeDashoffset = computed(() => {
    const circumference = this.circumference();
    if (this.indeterminate()) {
      return `${circumference * 0.72}`;
    }
    return `${circumference * (1 - this.safeValue() / 100)}`;
  });

  constructor() {
    super();
  }
}
