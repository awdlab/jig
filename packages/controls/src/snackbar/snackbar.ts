import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
  output,
  type OnInit,
} from '@angular/core';
import { provideSelf, AwdPt } from '@awdlab/jig/base';
import { AwdActionButton, AwdButton } from '@awdlab/jig/button';
import { I18n } from '@awdlab/jig/i18n';
import { AwdIcon } from '@awdlab/jig/icon';
import { snackbarControlTemplate } from '@awdlab/jig-themes/templates/snackbar';

import { DEFAULT_SNACKBAR_OPTIONS } from './defaults';
import { SnackbarTemplates } from './snackbar-templates';

import type { AwdActionButtonConfig } from '@awdlab/jig/api';
import type { IconType } from '@awdlab/jig-custom-types';

/**
 * @category control
 */
@Component({
  selector: 'jig-snackbar',
  templateUrl: './snackbar.html',
  imports: [NgTemplateOutlet, AwdPt, AwdButton, AwdIcon, AwdActionButton],
  providers: [provideSelf(AwdSnackbar)],
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
export class AwdSnackbar extends SnackbarTemplates implements OnInit {
  protected readonly theme = this.injectThemeTemplate(snackbarControlTemplate, 'root');
  protected readonly i18n = inject(I18n).translations;
  private readonly _host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Heading text shown at the top of the snackbar. Overridden by {@link templateHeader}. */
  public readonly header = input<string>();
  /** Body text of the snackbar. Overridden by {@link templateContent}. */
  public readonly content = input<string>();

  /** Icon shown at the start of the snackbar. */
  public readonly icon = input<IconType>();
  /** Icon used for the close button when {@link closable} is enabled. */
  public readonly iconClose = input<IconType>();
  /**
   * Whether to render a close button that lets the user dismiss the snackbar.
   * @default false
   */
  public readonly closable = input<boolean | undefined>(DEFAULT_SNACKBAR_OPTIONS.closable);
  /**
   * Time in ms before the snackbar auto-dismisses, or `false` to keep it open
   * until dismissed manually.
   * @default 5000
   */
  public readonly autoHide = input<number | false | undefined>(DEFAULT_SNACKBAR_OPTIONS.autoHide);

  /** Emitted when the snackbar is dismissed (by the timer, close button, or an action). */
  public readonly closeSnackbar = output<void>();

  /**
   * Action buttons rendered at the end of the snackbar. Clicking any action always
   * dismisses the snackbar; its `action` callback fires first. Import the config
   * type from `@awdlab/jig/api`.
   */
  // ponytail: snackbar has no [ngnKeyboardShortcut] scope, so a config `shortcut` is inert here; add a scope host if needed.
  public readonly actions = input<AwdActionButtonConfig[]>();
  /**
   * Shows a thin progress bar at the bottom of the snackbar that depletes over the
   * {@link autoHide} duration.
   * @default true
   */
  public readonly showProgress = input(DEFAULT_SNACKBAR_OPTIONS.showProgress ?? true, {
    transform: booleanAttribute,
  });
  /**
   * Pauses the auto-hide timer and progress bar while the snackbar is hovered,
   * resuming from the current position on mouse leave.
   * @default true
   */
  public readonly pauseOnHover = input(DEFAULT_SNACKBAR_OPTIONS.pauseOnHover ?? true, {
    transform: booleanAttribute,
  });

  /**
   * Politeness of the live region used to announce the snackbar to assistive tech.
   * When omitted, it is derived from {@link color}: `error`/`warning` announce as
   * `assertive` (mapped to `role="alert"`), everything else as `polite`
   * (`role="status"`).
   */
  public readonly ariaLive = input<'polite' | 'assertive' | 'off'>();

  /** Resolved live-region politeness — explicit input, else derived from color. */
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

  /**
   * A visually-hidden severity prefix (e.g. "Error:") announced before the header
   * so screen-reader users get the semantic that sighted users read from color.
   * Only emitted for the known semantic colors.
   */
  protected readonly severityLabel = computed<string | undefined>(() => {
    switch (this.color()) {
      case 'error':
        return this.i18n['snackbar_severity_error']();
      case 'warning':
        return this.i18n['snackbar_severity_warning']();
      case 'success':
        return this.i18n['snackbar_severity_success']();
      case 'info':
        return this.i18n['snackbar_severity_info']();
      default:
        return undefined;
    }
  });

  protected readonly paused = signal(false);

  /** Auto-hide duration in ms, or 0 when auto-hide is disabled. Drives the progress bar. */
  protected readonly autoHideMs = computed(() => {
    const autoHide = this.autoHide();
    return typeof autoHide === 'number' && autoHide > 0 ? autoHide : 0;
  });

  private _closeTimeout?: number;
  private _remaining = 0;
  private _startedAt = 0;
  private _hovered = false;
  private _focused = false;
  private _regionPaused = false;
  /** Element that had focus before the user moved into the snackbar; focus returns here on close. */
  private _returnFocus: HTMLElement | null = null;

  public ngOnInit(): void {
    // autoHideMs() is the single source of truth for "is auto-hide enabled".
    this._remaining = this.autoHideMs();
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
      // case the snackbar is overdue, so close now rather than leave it stuck open
      // with no active timer — otherwise a non-closable snackbar can never dismiss.
      if (this._startedAt > 0) {
        this.close();
      }
      return;
    }
    this._startedAt = performance.now();
    this.paused.set(false);
    this._closeTimeout = setTimeout(() => this.close(), this._remaining) as unknown as number;
  }

  private pauseHideTimer() {
    if (this._closeTimeout === undefined) {
      return;
    }
    clearTimeout(this._closeTimeout);
    this._closeTimeout = undefined;
    this._remaining -= performance.now() - this._startedAt;
    this.paused.set(true);
  }

  /**
   * Pause the auto-hide timer while the snackbar is hovered (opt-in via
   * {@link pauseOnHover}), focused (always — a WCAG 2.2.1 requirement so keyboard
   * and screen-reader users can read it), or while the whole region holds focus,
   * resuming once none holds.
   */
  private updatePause(): void {
    const shouldPause =
      this._regionPaused || (this.pauseOnHover() && this._hovered) || this._focused;
    if (shouldPause) {
      this.pauseHideTimer();
    } else {
      this.startHideTimer();
    }
  }

  /** Move DOM focus to the snackbar root (used by the region's roving/hotkey navigation). */
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

  // Only ever called immediately before the snackbar is removed (by the timer,
  // the close button, or an action), so it need not reset paused/_remaining —
  // the component is torn down right after. Revisit if close() ever keeps the
  // snackbar mounted.
  protected close() {
    this.restoreFocus();
    this.closeSnackbar.emit();
    if (this._closeTimeout !== undefined) {
      clearTimeout(this._closeTimeout);
    }
  }

  /** Return focus to the pre-snackbar element when it is dismissed while focused within. */
  private restoreFocus(): void {
    const host = this._host.nativeElement;
    if (host.contains(document.activeElement) && this._returnFocus?.isConnected) {
      this._returnFocus.focus();
    }
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
    // focusout bubbles; ignore focus moving between the snackbar's own children.
    const next = event.relatedTarget as Node | null;
    if (next && this._host.nativeElement.contains(next)) {
      return;
    }
    this._focused = false;
    this.updatePause();
  }
}
