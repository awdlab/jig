import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { injectThemeTemplate, NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnDefer } from '@ngneers/controls/defer';
import { NgnIcon } from '@ngneers/controls/icon';
import { generateElementId } from '@ngneers/controls/utils-ng';
import { accordionControlTemplate } from '@ngneers/controls-themes/templates/accordion';

import { AccordionTemplates } from './accordion-templates';
import { ACCORDION_CONTROL } from './types';

/**
 * @category control
 */
@Component({
  selector: 'ngn-accordion-panel',
  imports: [NgTemplateOutlet, NgClass, NgnDefer, NgnTemplate, NgnIcon],
  templateUrl: './accordion-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'theme.class("panel")',
  },
})
export class NgnAccordionPanel extends AccordionTemplates {
  protected readonly theme = injectThemeTemplate(accordionControlTemplate);

  private readonly _accordionControl = inject(ACCORDION_CONTROL);
  private _afterTransitionCallback?: () => void;

  /**
   * The unique identifier for the accordion panel.
   * @default generateElementId()
   */
  public readonly panelId = input<string>(generateElementId());
  /**
   * Whether to lazily load the content of the panel when expanded.
   * @default false
   */
  public readonly lazy = input<boolean>();
  /**
   * Whether to cache the content of the panel when {@link lazy} is enabled and the panel is closed.
   * @default false
   */
  public readonly cache = input<boolean>();
  /**
   * The header text for the accordion panel.
   */
  public readonly header = input<string>();
  /**
   * Whether the accordion panel is disabled. Disabling will prevent user interaction,
   * but not automatically close the panel if it was already expanded, or is expanded programatically.
   * @default false
   */
  public readonly disabled = input<boolean>(false);

  protected readonly iconExpanded = this._accordionControl.iconExpanded;
  protected readonly iconCollapsed = this._accordionControl.iconCollapsed;

  protected readonly expanded = computed(() =>
    this._accordionControl.expandedPanels().includes(this.panelId())
  );

  protected readonly headerId = computed(() => `${this.panelId()}-accordionpanel-header`);
  protected readonly contentId = computed(() => `${this.panelId()}-accordionpanel-content`);

  protected readonly afterTransitionExpanded = signal<boolean>(false);

  protected readonly lazyInt = computed(() => this.lazy() ?? this._accordionControl.lazy());
  protected readonly cacheInt = computed(() => this.cache() ?? this._accordionControl.cache());

  constructor() {
    super();
    effect(() => {
      if (!this.lazyInt() || this.cacheInt()) {
        return;
      }
      if (this.expanded()) {
        this.afterTransitionExpanded.set(true);
        this._afterTransitionCallback = undefined;
      } else {
        this._afterTransitionCallback = () => {
          this.afterTransitionExpanded.set(false);
        };
      }
    });
  }

  /**
   * Toggles the expanded state of the accordion panel.
   */
  public toggle() {
    this._accordionControl.togglePanel(this.panelId());
  }
  protected handleTransitionEnd() {
    this._afterTransitionCallback?.();
    this._afterTransitionCallback = undefined;
  }
}
