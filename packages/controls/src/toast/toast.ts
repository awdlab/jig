import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  input,
  TemplateRef,
  output,
  type OnInit,
} from '@angular/core';
import { NgnBase, provideSelf, NgnPt } from '@ngneers/controls/base';
import { NgnButton } from '@ngneers/controls/button';
import { I18n } from '@ngneers/controls/i18n';
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
    '(focusin)': 'focusEnter($event)',
    '(focusout)': 'focusLeave($event)',
    '(keydown.escape)': 'onEscape()',
    '[animate.enter]': "theme.class('anim-enter')",
    '[animate.leave]': "theme.class('anim-leave')",
    role: 'alert',
    'aria-live': 'assertive',
  },
})
export class NgnToast extends NgnBase<'toast'> implements OnInit {
  protected readonly theme = this.injectThemeTemplate(toastControlTemplate, 'root');
  protected readonly i18n = inject(I18n).translations;
  private readonly _host = inject<ElementRef<HTMLElement>>(ElementRef);

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
  private _remaining = 0;
  private _startedAt = 0;
  private _hovered = false;
  private _focused = false;
  private _regionPaused = false;
  /** Element that had focus before the user moved into the toast; focus returns here on close. */
  private _returnFocus: HTMLElement | null = null;

  public ngOnInit(): void {
    const autoHide = this.autoHide();
    this._remaining = autoHide && autoHide > 0 ? autoHide : 0;
    this.startHideTimer();
  }

  private startHideTimer() {
    // Idempotent: a timer already running must not be restarted (would reset _remaining tracking).
    if (this._closeTimeout !== undefined) {
      return;
    }
    if (this._remaining <= 0) {
      // Distinguish "auto-hide disabled" (never started, _startedAt still 0) from
      // "a pause consumed all the remaining time" (_startedAt > 0). In the latter
      // case the toast is overdue, so close now rather than leave it stuck open
      // with no active timer — otherwise a non-closable toast can never dismiss.
      if (this._startedAt > 0) {
        this.close();
      }
      return;
    }
    this._startedAt = performance.now();
    this._closeTimeout = setTimeout(() => this.close(), this._remaining) as unknown as number;
  }

  private pauseHideTimer() {
    if (this._closeTimeout === undefined) {
      return;
    }
    clearTimeout(this._closeTimeout);
    this._closeTimeout = undefined;
    this._remaining -= performance.now() - this._startedAt;
  }

  /**
   * Pause the auto-hide timer while the toast is hovered, focused (a WCAG 2.2.1
   * requirement so keyboard and screen-reader users can read it), or while the
   * whole region holds focus, resuming once none holds.
   */
  private updatePause(): void {
    const shouldPause = this._regionPaused || this._hovered || this._focused;
    if (shouldPause) {
      this.pauseHideTimer();
    } else {
      this.startHideTimer();
    }
  }

  protected close() {
    this.restoreFocus();
    this.closeToast.emit();
    if (this._closeTimeout) {
      clearTimeout(this._closeTimeout);
    }
  }

  /** Return focus to the pre-toast element when it is dismissed while focused within. */
  private restoreFocus(): void {
    const host = this._host.nativeElement;
    if (host.contains(document.activeElement) && this._returnFocus?.isConnected) {
      this._returnFocus.focus();
    }
  }

  /** Move DOM focus to the toast root (used by the region's roving/hotkey navigation). */
  public focus(): void {
    this._host.nativeElement.focus();
  }

  /** Freeze the timer because the notification region as a whole holds focus. */
  public regionPause(): void {
    this._regionPaused = true;
    this.updatePause();
  }

  /** Release the region-level freeze; resumes unless still hovered/focused. */
  public regionResume(): void {
    this._regionPaused = false;
    this.updatePause();
  }

  protected onEscape(): void {
    if (this.closable()) {
      this.close();
    }
  }

  protected mouseEnter(): void {
    this._hovered = true;
    this.updatePause();
  }

  protected mouseLeave(): void {
    this._hovered = false;
    this.updatePause();
  }

  protected focusEnter(event: FocusEvent): void {
    const from = event.relatedTarget as HTMLElement | null;
    if (from && !this._host.nativeElement.contains(from)) {
      this._returnFocus = from;
    }
    this._focused = true;
    this.updatePause();
  }

  protected focusLeave(event: FocusEvent): void {
    // focusout bubbles; ignore focus moving between the toast's own children.
    const next = event.relatedTarget as Node | null;
    if (next && this._host.nativeElement.contains(next)) {
      return;
    }
    this._focused = false;
    this.updatePause();
  }
}
