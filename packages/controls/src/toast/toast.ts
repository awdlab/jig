import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, ElementRef, inject, input, output, type OnInit } from '@angular/core';
import { provideSelf, AwdPt } from '@awdlab/jig/base';
import { AwdButton } from '@awdlab/jig/button';
import { I18n } from '@awdlab/jig/i18n';
import { AwdIcon } from '@awdlab/jig/icon';
import { toastControlTemplate } from '@awdlab/jig-themes/templates/toast';

import { DEFAULT_TOAST_OPTIONS } from './defaults';
import { ToastTemplates } from './toast-templates';

import type { IconType } from '@awdlab/jig-custom-types';

/**
 * @category control
 */
@Component({
  selector: 'jig-toast',
  templateUrl: './toast.html',
  imports: [NgTemplateOutlet, AwdPt, AwdButton, AwdIcon],
  providers: [provideSelf(AwdToast)],
  host: {
    '(mouseenter)': 'mouseEnter()',
    '(mouseleave)': 'mouseLeave()',
    '(focusin)': 'focusEnter($event)',
    '(focusout)': 'focusLeave($event)',
    '(keydown.escape)': 'onEscape()',
    '[animate.enter]': "theme.class('anim-enter')",
    '[animate.leave]': "theme.class('anim-leave')",
    '[attr.role]': 'role()',
    '[attr.aria-live]': 'liveMode()',
    'aria-atomic': 'true',
  },
})
export class AwdToast extends ToastTemplates implements OnInit {
  protected readonly theme = this.injectThemeTemplate(toastControlTemplate, 'root');
  protected readonly i18n = inject(I18n).translations;
  private readonly _host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** The toast header text. For richer markup use {@link templateHeader} instead. */
  public readonly header = input<string>();
  /** The toast body text. For richer markup use {@link templateContent} instead. */
  public readonly content = input<string>();

  /**
   * Politeness of the live region used to announce the toast to assistive tech.
   * When omitted, it is derived from {@link color}: `error`/`warning` announce as
   * `assertive` (mapped to `role="alert"`), everything else as `polite`
   * (`role="status"`).
   */
  public readonly ariaLive = input<'polite' | 'assertive' | 'off'>();

  /** Resolved live-region politeness — explicit {@link ariaLive} input, else derived from color. */
  protected readonly liveMode = computed<'polite' | 'assertive' | 'off'>(() => {
    const explicit = this.ariaLive();
    if (explicit) {
      return explicit;
    }
    const color = this.color();
    return color === 'error' || color === 'warning' ? 'assertive' : 'polite';
  });

  /** Landmark role paired with {@link liveMode} — `alert` when assertive, else `status`. */
  protected readonly role = computed(() => (this.liveMode() === 'assertive' ? 'alert' : 'status'));

  /** Icon to display alongside the toast content. */
  public readonly icon = input<IconType>();
  /** Icon for the close button. */
  public readonly iconClose = input<IconType>();
  /**
   * Whether the toast renders a close button and can be dismissed by the user
   * (e.g. via the close button or `Escape`).
   * @default false
   */
  public readonly closable = input<boolean | undefined>(DEFAULT_TOAST_OPTIONS.closable);
  /**
   * Time in milliseconds before the toast auto-hides, or `false` to disable
   * auto-hiding. The timer pauses while the toast is hovered or focused.
   * @default 5000
   */
  public readonly autoHide = input<number | false | undefined>(DEFAULT_TOAST_OPTIONS.autoHide);

  /** Emitted when the toast is dismissed, whether by the user or the auto-hide timer. */
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
