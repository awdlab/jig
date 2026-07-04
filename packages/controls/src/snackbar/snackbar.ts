import { NgTemplateOutlet } from '@angular/common';
import { Component, inject, input, TemplateRef, output, type OnInit } from '@angular/core';
import { NgnBase, provideSelf, NgnPt } from '@ngneers/controls/base';
import { NgnButton } from '@ngneers/controls/button';
import { I18n } from '@ngneers/controls/i18n';
import { NgnIcon } from '@ngneers/controls/icon';
import { snackbarControlTemplate } from '@ngneers/controls-themes/templates/snackbar';

import { DEFAULT_SNACKBAR_OPTIONS } from './defaults';

import type { ContentTemplateType, HeaderTemplateType } from './types';
import type { IconType } from '@ngneers/controls-custom-types';

/**
 * @category control
 */
@Component({
  selector: 'ngn-snackbar',
  templateUrl: './snackbar.html',
  imports: [NgTemplateOutlet, NgnPt, NgnButton, NgnIcon],
  providers: [provideSelf(NgnSnackbar)],
  host: {
    '(mouseenter)': 'mouseEnter()',
    '(mouseleave)': 'mouseLeave()',
    '[animate.enter]': "theme.class('anim-enter')",
    '[animate.leave]': "theme.class('anim-leave')",
    role: 'alert',
    'aria-live': 'assertive',
  },
})
export class NgnSnackbar extends NgnBase<'snackbar'> implements OnInit {
  protected readonly theme = this.injectThemeTemplate(snackbarControlTemplate, 'root');
  protected readonly i18n = inject(I18n).translations;

  public readonly header = input<string>();
  public readonly content = input<string>();

  public readonly icon = input<IconType>();
  public readonly closeIcon = input<IconType>();
  public readonly closable = input<boolean | undefined>(DEFAULT_SNACKBAR_OPTIONS.closable);
  public readonly autoHide = input<number | false | undefined>(DEFAULT_SNACKBAR_OPTIONS.autoHide);

  public readonly templateContent = input<TemplateRef<ContentTemplateType> | null>();
  public readonly templateHeader = input<TemplateRef<HeaderTemplateType> | null>();

  public readonly closeSnackbar = output<void>();
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
    this.closeSnackbar.emit();
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
