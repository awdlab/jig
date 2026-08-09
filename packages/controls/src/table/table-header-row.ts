import { Directive, ElementRef, inject } from '@angular/core';
import { NgnBase } from '@awdlab/jig/base';
import { toggleClass } from '@awdlab/jig/utils';
import { tableControlTemplate } from '@awdlab/jig-themes/templates/table';

/**
 * The table's header `<tr>`. Marks the row for the grid's ARIA wiring and
 * carries the theme's header-row styling.
 *
 * @category directive
 */
@Directive({ selector: '[ngnTableHeadTr]', host: { role: 'row', '[attr.aria-rowindex]': '1' } })
export class NgnTableHeadTr extends NgnBase<'table'> {
  protected readonly theme = this.injectThemeTemplate(tableControlTemplate);
  private readonly _element = inject(ElementRef<HTMLElement>);

  constructor() {
    super();
    this.prepareDom();
  }

  private prepareDom() {
    toggleClass(this._element.nativeElement, this.theme.class('row'), true);
  }
}
