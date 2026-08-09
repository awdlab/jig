import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  contentChild,
  effect,
  input,
  signal,
  TemplateRef,
} from '@angular/core';
import { AwdBase, provideSelf, AwdPt } from '@awdlab/jig/base';
import { AwdIcon } from '@awdlab/jig/icon';
import { AwdTooltip } from '@awdlab/jig/tooltip';
import { generateElementId } from '@awdlab/jig/utils-ng';
import { hintControlTemplate } from '@awdlab/jig-themes/templates/hint';

import type { AwdIconKey } from '@awdlab/jig/icon';
import type { IconType } from '@awdlab/jig-custom-types';

/**
 * Validation state rendered by a hint when connected to helpers such as ngnErrors.
 * @category types
 */
export interface AwdHintValidationState {
  /** Whether the validation message should be shown. */
  visible: boolean;
  /** Whether validation is currently pending. */
  pending: boolean;
  /** Resolved validation message, if one is available. */
  message: string | null;
}

/**
 * A small sub-text control for controls — helper text that explains a value,
 * or a validation / warning message. The semantic intent is carried by
 * {@link kind} (`default | info | success | warning | error`).
 *
 * @category control
 */
@Component({
  selector: 'jig-hint',
  templateUrl: './hint.html',
  imports: [AwdPt, AwdIcon, AwdTooltip, NgTemplateOutlet],
  providers: [provideSelf(AwdHint)],
  host: {
    '[id]': 'controlId()',
    // Collapse the element when acting as a validation hint with nothing to show,
    // so an unfilled error slot doesn't reserve space (see isHidden).
    '[style.display]': "isHidden() ? 'none' : null",
  },
})
export class AwdHint extends AwdBase<'hint'> {
  protected readonly theme = this.injectThemeTemplate(hintControlTemplate, 'root');

  /**
   * A stable id placed on the host element so a related control can reference
   * this hint via `aria-describedby`. Defaults to a generated id.
   */
  public readonly controlId = input<string>(generateElementId());

  /**
   * Set an icon to display before the text. When omitted, a default icon is
   * derived from the current {@link kind} (e.g. `error` shows an alert icon).
   * The neutral `default` kind shows no icon unless one is set explicitly.
   * @default undefined
   */
  public readonly icon = input<IconType>();
  /**
   * Whether to only render the icon and show the content as tooltip.
   * @default false
   */
  public readonly iconOnly = input(false, { transform: booleanAttribute });

  /**
   * The hint text. Can also be a `TemplateRef` for custom rendering, or set via
   * an `<ng-template #content>` content child. Projected content (`<ng-content>`)
   * is used as a fallback when neither is provided.
   * @default null
   */
  public readonly content = input<TemplateRef<unknown> | string | null>(null);

  /**
   * Validation state supplied by helpers such as ngnErrors.
   * @default null
   */
  public readonly validationState = input<AwdHintValidationState | null>(null);

  private readonly _bridgedValidationState = signal<AwdHintValidationState | null>(null);

  private readonly _activeValidationState = computed(
    () => this._bridgedValidationState() ?? this.validationState()
  );

  private readonly _userContentTemplate = contentChild<TemplateRef<unknown>>('content');

  protected readonly hasIconOnlyTooltipContent = computed(() => {
    const validation = this._activeValidationState();
    if (validation?.visible && validation.message) {
      return true;
    }
    return Boolean(this.content() || this._userContentTemplate());
  });

  /**
   * Whether to collapse the host. Only auto-hides when the hint is wired as a
   * validation hint (has a validation state) that is currently not visible and
   * carries no static content of its own — i.e. an empty error slot. Plain hints
   * (no validation state) never auto-hide.
   */
  protected readonly isHidden = computed(() => {
    const validation = this._activeValidationState();
    if (!validation || validation.visible) {
      return false;
    }
    return !this.content() && !this._userContentTemplate();
  });

  /**
   * Bridge validation state from a companion directive such as ngnErrors.
   * @category methods
   */
  public setValidationState(state: AwdHintValidationState | null): void {
    this._bridgedValidationState.set(state);
  }

  constructor() {
    super();
    effect(() => {
      const state = this._activeValidationState();
      let kind: 'info' | 'error' | undefined;
      if (state?.visible && !this.iconOnly()) {
        kind = state.pending ? 'info' : 'error';
      }
      this.setKindOverride(kind);
    });
  }

  /**
   * The resolved template to render, if any. A content-child `<ng-template #content>`
   * takes precedence over a `TemplateRef` passed via the {@link content} input.
   */
  protected readonly contentTemplate = computed(() => {
    if (this._activeValidationState()?.visible) {
      return null;
    }
    const projected = this._userContentTemplate();
    if (projected) {
      return projected;
    }
    const value = this.content();
    return value instanceof TemplateRef ? value : null;
  });

  /**
   * The resolved string content, if the {@link content} input is a plain string.
   */
  protected readonly contentString = computed(() => {
    const validation = this._activeValidationState();
    if (validation?.visible) {
      return validation.message;
    }
    const value = this.content();
    return typeof value === 'string' ? value : null;
  });

  /**
   * The icon registry key of the default icon for the current kind, or
   * `undefined` for the neutral `default` kind.
   */
  protected readonly defaultIconKey = computed<AwdIconKey | undefined>(() => {
    const validation = this._activeValidationState();
    if (validation?.visible) {
      return validation.pending ? 'hint-info' : 'hint-error';
    }
    if (validation && this.iconOnly() && !this.hasIconOnlyTooltipContent()) {
      return undefined;
    }
    switch (this.appliedKind()) {
      case 'info':
        return 'hint-info';
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
}
