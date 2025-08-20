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
   * Useful for accessing the {@link panelId} in a safe way, without worrying about timing.
   */
  public readonly safePanelId = signal<string | null>(null);
  /**
   * Whether to lazily load the content of the panel when opened.
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

  protected readonly iconExpanded = this._accordionControl.iconExpanded;
  protected readonly iconCollapsed = this._accordionControl.iconCollapsed;

  protected readonly open = computed(() =>
    this._accordionControl.openedPanels().includes(this.panelId())
  );

  protected readonly afterTransitionOpen = signal<boolean>(false);

  protected readonly lazyInt = computed(() => this.lazy() ?? this._accordionControl.lazy());
  protected readonly cacheInt = computed(() => this.cache() ?? this._accordionControl.cache());

  constructor() {
    super();
    effect(() => {
      this.safePanelId.set(this.panelId());
    });

    effect(() => {
      if (!this.lazyInt() || this.cacheInt()) {
        return;
      }
      if (this.open()) {
        this.afterTransitionOpen.set(true);
        this._afterTransitionCallback = undefined;
      } else {
        this._afterTransitionCallback = () => {
          this.afterTransitionOpen.set(false);
        };
      }
    });
  }

  public toggle() {
    this._accordionControl.togglePanel(this.panelId());
  }

  public handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.toggle();
    }
  }

  protected handleTransitionEnd() {
    this._afterTransitionCallback?.();
  }
}
