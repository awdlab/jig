import {
  Component,
  input,
  ChangeDetectionStrategy,
  computed,
  booleanAttribute,
} from '@angular/core';
import { NgnBase, provideSelf } from '@ngneers/controls/base';
import { progressControlTemplate } from '@ngneers/controls-themes/templates/progress';

const TAU = Math.PI * 2;

/**
 * @category control
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-progress',
  templateUrl: './progress.html',
  imports: [],
  providers: [provideSelf(NgnProgress)],
  host: {
    '[class]': 'theme.classes({"": true, indeterminate: indeterminate(), circular: circular()})',
    role: 'progressbar',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': '100',
    '[attr.aria-valuenow]': 'indeterminate() ? null : safeValue()',
    '[style.--progress.%]': 'indeterminate() ? null : safeValue()',
  },
})
export class NgnProgress extends NgnBase<'progress'> {
  protected readonly theme = this.injectThemeTemplate(progressControlTemplate);

  /**
   * The current progress value (0-100).
   */
  public readonly value = input<number>(0);
  /**
   * Whether the progress indicator is indeterminate.
   */
  public readonly indeterminate = input(false, { transform: booleanAttribute });
  /**
   * Whether the progress indicator is circular.
   */
  public readonly circular = input(false, { transform: booleanAttribute });

  /**
   * Radius of the circular progress indicator (in px).
   */
  public readonly radius = input<number>(40);

  /**
   * Thickness of the circular progress indicator stroke (in px).
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
