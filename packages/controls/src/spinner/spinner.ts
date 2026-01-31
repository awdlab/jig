import { Component, input, ChangeDetectionStrategy, computed } from '@angular/core';
import { NgnBase, NgnPt, provideSelf } from '@ngneers/controls/base';
import { spinnerControlTemplate } from '@ngneers/controls-themes/templates/spinner';

/**
 * @category control
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  public readonly size = input<number>(64);
  public readonly thickness = input<string>();
  public readonly centered = input<boolean>();

  protected readonly viewBox = computed(() => `0 0 ${this.size()} ${this.size()}`);
}
