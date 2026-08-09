import { booleanAttribute, Component, input, computed } from '@angular/core';
import { AwdBase, AwdPt, provideSelf } from '@awdlab/jig/base';
import { spinnerControlTemplate } from '@awdlab/jig-themes/templates/spinner';

/**
 * @category control
 */
@Component({
  selector: 'jig-spinner',
  templateUrl: './spinner.html',
  imports: [AwdPt],
  providers: [provideSelf(AwdSpinner)],
  host: {
    role: 'status',
    '[style.--size]': 'size()',
    '[style.--thickness]': 'thickness() || null',
  },
})
export class AwdSpinner extends AwdBase<'spinner'> {
  protected readonly theme = this.injectThemeTemplate(spinnerControlTemplate, {
    root: true,
    centered: () => !!this.centered(),
  });

  /**
   * Diameter of the spinner in pixels.
   * @default 64
   */
  public readonly size = input<number>(64);
  /**
   * Stroke width of the spinner ring as a CSS length (e.g. `'4px'`).
   * Falls back to the theme's default thickness when unset.
   */
  public readonly thickness = input<string>();
  /**
   * Whether to center the spinner within its containing block.
   * @default false
   */
  public readonly centered = input(false, { transform: booleanAttribute });

  protected readonly viewBox = computed(() => `0 0 ${this.size()} ${this.size()}`);
}
