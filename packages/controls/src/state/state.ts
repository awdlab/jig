import { booleanAttribute, Component, computed, input } from '@angular/core';
import { NgnBase, NgnPt, provideSelf } from '@ngneers/controls/base';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnSpinner } from '@ngneers/controls/spinner';
import { stateControlTemplate } from '@ngneers/controls-themes/templates/state';

import type { NgnIconKey } from '@ngneers/controls/icon';
import type { IconType } from '@ngneers/controls-custom-types';

/**
 * @category control
 */
@Component({
  selector: 'ngn-state',
  templateUrl: './state.html',
  imports: [NgnIcon, NgnPt, NgnSpinner],
  providers: [provideSelf(NgnState)],
  host: {
    '[style.--ngn-state-size.px]': 'size()',
  },
})
export class NgnState extends NgnBase<'state'> {
  /**
   * Whether the indicator is rendered and occupies layout space.
   * @default true
   */
  public readonly visible = input(true, { transform: booleanAttribute });

  /**
   * Whether the indicator should replace sibling button content while visible.
   * @default false
   */
  public readonly replaceContent = input(false, { transform: booleanAttribute });

  /**
   * Indicator size in px.
   * @default 16
   */
  public readonly size = input(16);

  /**
   * Optional spinner stroke thickness. Passed through to ngn-spinner for loading state.
   */
  public readonly thickness = input<string>();

  /**
   * Icon shown when the applied kind is `cancelled`.
   * @category inputs
   */
  public readonly iconCancelled = input<IconType>();

  /**
   * Icon shown when the applied kind is `success`.
   * @category inputs
   */
  public readonly iconSuccess = input<IconType>();

  /**
   * Icon shown when the applied kind is `warning`.
   * @category inputs
   */
  public readonly iconWarning = input<IconType>();

  /**
   * Icon shown when the applied kind is `error`.
   * @category inputs
   */
  public readonly iconError = input<IconType>();

  protected readonly theme = this.injectThemeTemplate(stateControlTemplate, {
    root: true,
    visible: this.visible,
    'replace-content': this.replaceContent,
  });

  protected readonly icon = computed(() => {
    switch (this.appliedKind()) {
      case 'cancelled':
        return this.iconCancelled();
      case 'success':
        return this.iconSuccess();
      case 'warning':
        return this.iconWarning();
      case 'error':
        return this.iconError();
      default:
        return undefined;
    }
  });

  protected readonly defaultIcon = computed<NgnIconKey | undefined>(() => {
    switch (this.appliedKind()) {
      case 'cancelled':
        return 'upload-cancel';
      case 'success':
        return 'hint-success';
      case 'warning':
        return 'hint-warning';
      case 'error':
        return 'hint-error';
      default:
        return undefined;
    }
  });
}
