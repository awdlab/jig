import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, contentChild, input, TemplateRef } from '@angular/core';
import { NgnBase, provideSelf, NgnPt } from '@ngneers/controls/base';
import { NgnIcon } from '@ngneers/controls/icon';
import { generateElementId } from '@ngneers/controls/utils-ng';
import { hintControlTemplate } from '@ngneers/controls-themes/templates/hint';

import type { NgnIconKey } from '@ngneers/controls/icon';
import type { IconType } from '@ngneers/controls-custom-types';

/**
 * A small sub-text control for controls — helper text that explains a value,
 * or a validation / warning message. The semantic intent is carried by
 * {@link kind} (`default | info | success | warning | error`).
 *
 * @category control
 */
@Component({
  selector: 'ngn-hint',
  templateUrl: './hint.html',
  imports: [NgnPt, NgnIcon, NgTemplateOutlet],
  providers: [provideSelf(NgnHint)],
  host: {
    '[id]': 'controlId()',
  },
})
export class NgnHint extends NgnBase<'hint'> {
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
   */
  public readonly icon = input<IconType>();

  /**
   * The hint text. Can also be a `TemplateRef` for custom rendering, or set via
   * an `<ng-template #content>` content child. Projected content (`<ng-content>`)
   * is used as a fallback when neither is provided.
   */
  public readonly content = input<TemplateRef<unknown> | string | null>(null);

  private readonly _userContentTemplate = contentChild<TemplateRef<unknown>>('content');

  /**
   * The resolved template to render, if any. A content-child `<ng-template #content>`
   * takes precedence over a `TemplateRef` passed via the {@link content} input.
   */
  protected readonly contentTemplate = computed(() => {
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
    const value = this.content();
    return typeof value === 'string' ? value : null;
  });

  /**
   * The icon registry key of the default icon for the current kind, or
   * `undefined` for the neutral `default` kind.
   */
  protected readonly defaultIconKey = computed<NgnIconKey | undefined>(() => {
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
