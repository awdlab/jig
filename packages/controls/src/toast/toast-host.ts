import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
} from '@angular/core';
import { NgnBase } from '@ngneers/controls/base';
import { toastControlTemplate } from '@ngneers/controls-themes/templates/toast';

import { NgnToast } from './toast';
import { NgnToastManager } from './toast-manager';

/**
 * The host component that renders toasts.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-toast-host',
  templateUrl: 'toast-host.html',
  imports: [NgnToast],
  host: {
    '[class]': 'theme.class("host")',
    '[attr.popover]': '"manual"',
  },
})
export class NgnToastHost extends NgnBase<'toast'> {
  protected readonly theme = this.injectThemeTemplate(toastControlTemplate);
  private readonly _toastManager = inject(NgnToastManager);
  private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly toasts = this._toastManager.toasts;

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
