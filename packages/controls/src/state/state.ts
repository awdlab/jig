import { booleanAttribute, Component, computed, inject, input } from '@angular/core';
import { NgnBase, NgnPt, provideSelf } from '@ngneers/controls/base';
import { I18n } from '@ngneers/controls/i18n';
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
    // The kind is conveyed to sighted users purely by icon shape + color, so
    // announce it to assistive tech via a live region. Only set when there is a
    // label (a known kind is applied and the indicator is visible), otherwise
    // the host stays a plain, roleless span.
    '[attr.role]': 'role()',
    '[attr.aria-live]': 'liveMode()',
    '[attr.aria-atomic]': "role() ? 'true' : null",
  },
})
export class NgnState extends NgnBase<'state'> {
  private readonly i18n = inject(I18n).translations;
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
   * Visually-hidden text announced to assistive tech in place of the kind's
   * default label. Use it to convey app-specific meaning (e.g. `"Saving…"`
   * instead of `"Loading"`). When unset, a localized label is derived from the
   * applied {@link kind}.
   */
  public readonly label = input<string>();

  /**
   * Politeness of the live region used to announce the state to assistive tech.
   * When omitted, it is derived from the applied {@link kind}: `error`/`warning`
   * announce as `assertive` (mapped to `role="alert"`), everything else as
   * `polite` (`role="status"`).
   */
  public readonly ariaLive = input<'polite' | 'assertive' | 'off'>();

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

  /**
   * Accessible label for the current state: the explicit {@link label} input,
   * else a localized default for the applied kind. `undefined` when the
   * indicator is hidden or no known kind is applied — the host then carries no
   * live region.
   */
  protected readonly resolvedLabel = computed<string | undefined>(() => {
    if (!this.visible()) {
      return undefined;
    }
    const explicit = this.label();
    if (explicit) {
      return explicit;
    }
    switch (this.appliedKind()) {
      case 'loading':
        return this.i18n['state_loading']();
      case 'success':
        return this.i18n['state_success']();
      case 'warning':
        return this.i18n['state_warning']();
      case 'error':
        return this.i18n['state_error']();
      case 'cancelled':
        return this.i18n['state_cancelled']();
      default:
        return undefined;
    }
  });

  /** Resolved live-region politeness — explicit input, else derived from kind. */
  protected readonly liveMode = computed<'polite' | 'assertive' | 'off' | null>(() => {
    if (!this.resolvedLabel()) {
      return null;
    }
    const explicit = this.ariaLive();
    if (explicit) {
      return explicit;
    }
    const kind = this.appliedKind();
    return kind === 'error' || kind === 'warning' ? 'assertive' : 'polite';
  });

  /** Landmark role paired with {@link liveMode} — `alert` when assertive, else `status`. */
  protected readonly role = computed<'alert' | 'status' | null>(() => {
    const live = this.liveMode();
    if (!live || live === 'off') {
      return null;
    }
    return live === 'assertive' ? 'alert' : 'status';
  });
}
