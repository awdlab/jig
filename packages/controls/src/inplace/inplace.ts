import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, input, model } from '@angular/core';
import { provideSelf } from '@ngneers/controls/base';
import { NgnDefer } from '@ngneers/controls/defer';
import { inplaceControlTemplate } from '@ngneers/controls-themes/templates/inplace';

import { InplaceTemplates } from './inplace-templates';

/**
 * @category control
 */
@Component({
  selector: 'ngn-inplace',
  templateUrl: './inplace.html',
  imports: [NgClass, NgTemplateOutlet, NgnDefer],
  providers: [provideSelf(NgnInplace)],
  host: {
    '[class]': 'theme.classes({"": true})',
  },
})
export class NgnInplace extends InplaceTemplates {
  protected readonly theme = this.injectThemeTemplate(inplaceControlTemplate);

  protected readonly closeContent = this.switchToDisplay.bind(this);

  /**
   * Controls the visibility of the content.
   */
  public readonly contentVisible = model<boolean>(false);
  /**
   * Whether the content is loaded lazily.
   * @default true
   */
  public readonly lazy = input<boolean>(true);
  /**
   * Whether the content is cached when closed.
   * @default false
   */
  public readonly cache = input<boolean>(false);

  /**
   * Switches to the content view.
   */
  public switchToContent() {
    this.contentVisible.set(true);
  }

  /**
   * Switches to the display view.
   */
  public switchToDisplay() {
    this.contentVisible.set(false);
  }

  /**
   * Toggles between the display and content views.
   */
  public toggle() {
    this.contentVisible.update(v => !v);
  }
}
