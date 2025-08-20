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
import { generateElementId } from '@ngneers/controls/utils-ng';
import { accordionControlTemplate } from '@ngneers/controls-themes/templates/accordion';

import { AccordionTemplates } from './accordion-templates';
import { ACCORDION_CONTROL } from './types';

/**
 * @category control
 */
@Component({
  selector: 'ngn-accordion-panel',
  imports: [NgTemplateOutlet, NgClass, NgnDefer, NgnTemplate],
  templateUrl: './accordion-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'theme.class("panel")',
  },
})
export class NgnAccordionPanel extends AccordionTemplates {
  protected readonly theme = injectThemeTemplate(accordionControlTemplate);

  private readonly _accordionControl = inject(ACCORDION_CONTROL);

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
   */
  public readonly lazy = input(false);
  /**
   * Whether to cache the content of the panel when {@link lazy} is enabled and the panel is closed.
   */
  public readonly cache = input(false);
  /**
   * The header text for the accordion panel.
   */
  public readonly header = input<string>();

  protected readonly open = computed(() =>
    this._accordionControl.openedPanels().includes(this.panelId())
  );

  protected readonly lazyInt = computed(() => this.lazy() ?? this._accordionControl.lazy());
  protected readonly cacheInt = computed(() => this.cache() ?? this._accordionControl.cache());

  constructor() {
    super();
    effect(() => {
      this.safePanelId.set(this.panelId());
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
}
