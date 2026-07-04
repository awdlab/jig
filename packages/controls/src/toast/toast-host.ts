import { afterNextRender, Component, ElementRef, inject, viewChildren } from '@angular/core';
import { NgnBase } from '@ngneers/controls/base';
import { I18n } from '@ngneers/controls/i18n';
import { NotificationRegionController } from '@ngneers/controls/utils-ng';
import { toastControlTemplate } from '@ngneers/controls-themes/templates/toast';

import { NgnToast } from './toast';
import { NgnToastManager } from './toast-manager';

/**
 * The host component that renders toasts.
 */
@Component({
  selector: 'ngn-toast-host',
  templateUrl: 'toast-host.html',
  imports: [NgnToast],
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
export class NgnToastHost extends NgnBase<'toast'> {
  protected readonly theme = this.injectThemeTemplate(toastControlTemplate, 'host');
  protected readonly i18n = inject(I18n).translations;
  private readonly _toastManager = inject(NgnToastManager);
  private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef);

  private readonly _items = viewChildren(NgnToast);

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
