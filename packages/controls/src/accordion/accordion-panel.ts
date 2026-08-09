import { NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { AwdTemplate } from '@awdlab/jig/api/ng';
import { provideSelf, AwdPt } from '@awdlab/jig/base';
import { AwdDefer } from '@awdlab/jig/defer';
import { AwdIcon } from '@awdlab/jig/icon';
import { generateElementId } from '@awdlab/jig/utils-ng';
import { accordionPanelControlTemplate } from '@awdlab/jig-themes/templates/accordion-panel';

import { AccordionTemplates } from './accordion-templates';
import { ACCORDION_CONTROL } from './types';

/**
 * @category control
 */
@Component({
  selector: 'jig-accordion-panel',
  imports: [NgTemplateOutlet, AwdPt, AwdDefer, AwdTemplate, AwdIcon],
  templateUrl: './accordion-panel.html',

  providers: [provideSelf(AwdAccordionPanel)],
})
export class AwdAccordionPanel extends AccordionTemplates {
  protected readonly theme = this.injectThemeTemplate(accordionPanelControlTemplate, 'root');

  private readonly _accordionControl = inject(ACCORDION_CONTROL);

  /**
   * The unique identifier for the accordion panel.
   * @default generateElementId()
   */
  public readonly panelId = input<string>(generateElementId());
  /**
   * Whether to lazily load the content of the panel when expanded.
   * @default false
   */
  public readonly lazy = input(null, { transform: booleanAttribute });
  /**
   * Whether to cache the content of the panel when {@link lazy} is enabled and the panel is closed.
   * @default false
   */
  public readonly cache = input(null, { transform: booleanAttribute });
  /**
   * The header text for the accordion panel.
   */
  public readonly header = input<string>();
  /**
   * Whether the accordion panel is disabled. Disabling will prevent user interaction,
   * but not automatically close the panel if it was already expanded, or is expanded programatically.
   * @default false
   */
  public readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly iconExpanded = this._accordionControl.iconExpanded;
  protected readonly iconCollapsed = this._accordionControl.iconCollapsed;
  protected readonly _contentViewChild = viewChild.required<ElementRef<HTMLElement>>('content');

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
    afterRenderEffect(() => {
      if (!this.lazyInt() || this.cacheInt()) {
        return;
      }
      if (this.expanded()) {
        this.afterTransitionExpanded.set(true);
      } else {
        requestAnimationFrame(() => {
          const allAnimationsDone = Promise.all(
            this._contentViewChild()
              .nativeElement.getAnimations()
              .map(x => x.finished)
          );
          allAnimationsDone
            .then(() => {
              this.afterTransitionExpanded.set(false);
            })
            .catch(() => {
              // ignore cancelled animation
            });
        });
      }
    });
  }

  /**
   * Toggles the expanded state of the accordion panel.
   */
  public toggle() {
    this._accordionControl.togglePanel(this.panelId());
  }
}
