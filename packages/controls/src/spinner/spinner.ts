import { booleanAttribute, Component, input, computed } from '@angular/core';
import { NgnBase, NgnPt, provideSelf } from '@ngneers/controls/base';
import { spinnerControlTemplate } from '@ngneers/controls-themes/templates/spinner';

/**
 * @category control
 */
@Component({
  selector: 'ngn-spinner',
  templateUrl: './spinner.html',
  imports: [NgnPt],
  providers: [provideSelf(NgnSpinner)],
  host: {
    role: 'status',
    '[style.--size]': 'size()',
    '[style.--thickness]': 'thickness() || null',
  },
})
export class NgnSpinner extends NgnBase<'spinner'> {
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
