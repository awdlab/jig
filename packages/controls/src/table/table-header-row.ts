import { Directive } from '@angular/core';
import { NgnBase } from '@ngneers/controls/base';
import { tableControlTemplate } from '@ngneers/controls-themes/templates/table';

@Directive({ selector: '[ngnTableHeaderRow]', host: { '[attr.aria-rowindex]': '1' } })
export class NgnTableHeaderRow extends NgnBase<'table'> {
  private readonly theme = this.injectThemeTemplate(tableControlTemplate);
  constructor() {
    super();
    this.prepareDom();
  }

  private prepareDom() {
    this.element.nativeElement.classList.toggle(this.theme.class('row'), true);
  }
}
