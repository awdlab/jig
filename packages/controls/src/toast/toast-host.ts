import { afterNextRender, Component, ElementRef, inject, viewChildren } from '@angular/core';
import { JigBase } from '@awdlab/jig/base';
import { I18n } from '@awdlab/jig/i18n';
import { NotificationRegionController } from '@awdlab/jig/utils-ng';
import { toastControlTemplate } from '@awdlab/jig-themes/templates/toast';

import { JigToast } from './toast';
import { JigToastManager } from './toast-manager';

/**
 * The host component that renders toasts.
 */
@Component({
  selector: 'jig-toast-host',
  templateUrl: 'toast-host.html',
  imports: [JigToast],
  host: {
    '[attr.popover]': '"manual"',
    role: 'region',
    '[attr.aria-label]': "i18n['toast_region']()",
    '(document:keydown)': 'region.handleGlobalKeydown($event)',
    '(keydown)': 'region.handleKeydown($event)',
    '(focusin)': 'region.handleFocusIn()',
    '(focusout)': 'region.handleFocusOut($event)',
  },
})
export class JigToastHost extends JigBase<'toast'> {
  protected readonly theme = this.injectThemeTemplate(toastControlTemplate, 'host');
  protected readonly i18n = inject(I18n).translations;
  private readonly _toastManager = inject(JigToastManager);
  private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef);

  private readonly _items = viewChildren(JigToast);

  protected readonly toasts = this._toastManager.toasts;

  /**
   * Drives keyboard access to the region: `F6` jumps focus to the newest toast,
   * arrow keys rove between them, and focus anywhere inside pauses every timer.
   */
  protected readonly region = new NotificationRegionController(this._el.nativeElement, () =>
    this._items()
  );

  constructor() {
    super();
    afterNextRender(() => {
      this._el.nativeElement.showPopover();
    });
  }

  protected removeToast(id: number): void {
    this._toastManager.removeToast(id);
  }
}
