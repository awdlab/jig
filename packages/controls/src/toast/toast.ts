import { NgTemplateOutlet } from '@angular/common';
import { Component, input, TemplateRef, output, type OnInit } from '@angular/core';
import { NgnBase, provideSelf, NgnPt } from '@ngneers/controls/base';
import { NgnButton } from '@ngneers/controls/button';
import { NgnIcon } from '@ngneers/controls/icon';
import { toastControlTemplate } from '@ngneers/controls-themes/templates/toast';

import { DEFAULT_TOAST_OPTIONS } from './defaults';

import type { ContentTemplateType, HeaderTemplateType } from './types';
import type { IconType } from '@ngneers/controls-custom-types';

/**
 * @category control
 */
@Component({
  selector: 'ngn-toast',
  templateUrl: './toast.html',
  imports: [NgTemplateOutlet, NgnPt, NgnButton, NgnIcon],
  providers: [provideSelf(NgnToast)],
  host: {
    '(mouseenter)': 'mouseEnter()',
    '(mouseleave)': 'mouseLeave()',
    '[animate.enter]': "theme.class('anim-enter')",
    '[animate.leave]': "theme.class('anim-leave')",
    role: 'alert',
    'aria-live': 'assertive',
  },
})
export class NgnToast extends NgnBase<'toast'> implements OnInit {
  protected readonly theme = this.injectThemeTemplate(toastControlTemplate, 'root');

  public readonly header = input<string>();
  public readonly content = input<string>();

  public readonly icon = input<IconType>();
  public readonly closeIcon = input<IconType>();
  public readonly closable = input<boolean | undefined>(DEFAULT_TOAST_OPTIONS.closable);
  public readonly autoHide = input<number | false | undefined>(DEFAULT_TOAST_OPTIONS.autoHide);

  public readonly templateContent = input<TemplateRef<ContentTemplateType> | null>();
  public readonly templateHeader = input<TemplateRef<HeaderTemplateType> | null>();

  public readonly closeToast = output<void>();
  private _closeTimeout?: number;

  public ngOnInit(): void {
    this.startHideTimer();
  }

  private startHideTimer() {
    const autoHide = this.autoHide();
    if (autoHide && autoHide > 0) {
      this._closeTimeout = setTimeout(() => this.close(), autoHide) as unknown as number;
    }
  }

  protected close() {
    this.closeToast.emit();
    if (this._closeTimeout) {
      clearTimeout(this._closeTimeout);
    }
  }

  protected mouseEnter(): void {
    if (this._closeTimeout) {
      clearTimeout(this._closeTimeout);
      this._closeTimeout = undefined;
    }
  }

  protected mouseLeave(): void {
    this.startHideTimer();
  }
}
