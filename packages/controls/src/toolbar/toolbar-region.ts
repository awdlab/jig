import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  contentChildren,
  ElementRef,
  inject,
  input,
  viewChildren,
} from '@angular/core';
import { JIG_CONTROL, JigPt, provideSelf } from '@awdlab/jig/base';
import { toolbarRegionControlTemplate } from '@awdlab/jig-themes/templates/toolbar-region';

import { ToolbarRegionTemplates } from './toolbar-region-templates';
import { TOOLBAR_CONTROL, type ToolbarPlacement, type ToolbarRegionRef } from './types';

/**
 * A group of toolbar items sharing a placement and a collapse priority.
 *
 * In `wrap` mode a region simply renders whatever it is given — projected
 * content, `#item` templates, or both. In `popover` mode only `#item`
 * templates can collapse, so the collapsible content must be declared as
 * templates.
 *
 * @category control
 */
@Component({
  selector: 'jig-toolbar-region',
  templateUrl: './toolbar-region.html',
  imports: [JigPt, NgTemplateOutlet],
  providers: [provideSelf(JigToolbarRegion)],
  host: {
    '[attr.data-placement]': 'placement()',
  },
})
export class JigToolbarRegion extends ToolbarRegionTemplates implements ToolbarRegionRef {
  protected readonly theme = this.injectThemeTemplate(toolbarRegionControlTemplate, 'root');

  /**
   * Which toolbar track the region renders in.
   *
   * Must be set as a **static attribute** (`placement="end"`), not a binding —
   * the toolbar projects regions into fixed slots, and Angular's content
   * projection is resolved statically at compile time.
   * @default start
   */
  public readonly placement = input<ToolbarPlacement>('start');
  /**
   * Collapse priority within the placement. The lowest priority gives up its
   * items first; ties are broken by reverse DOM order. Only used when the
   * toolbar's `overflow` is `'popover'`.
   * @default 0
   */
  public readonly priority = input(0);

  private readonly _itemRefs = viewChildren<ElementRef<HTMLElement>>('itemRef');
  /** The in-bar element of each item, used by the toolbar for measurement. */
  public readonly itemElements = computed(() => this._itemRefs().map(ref => ref.nativeElement));

  private readonly _templateControls = viewChildren(JIG_CONTROL);
  private readonly _projectedControls = contentChildren(JIG_CONTROL, { descendants: true });
  /**
   * Every jig control the region renders, whether from an `#item` template or
   * from projected content. The toolbar registers these as roving items.
   */
  public readonly controls = computed(() => [
    ...this._projectedControls(),
    ...this._templateControls(),
  ]);

  private readonly _toolbar = inject(TOOLBAR_CONTROL, { optional: true });

  protected isOverflowed(index: number): boolean {
    return this._toolbar?.isItemOverflowed(this, index) ?? false;
  }
}
