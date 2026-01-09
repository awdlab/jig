import { Directive, signal } from '@angular/core';
import { NgnBase } from '@ngneers/controls/base';
import { tableControlTemplate } from '@ngneers/controls-themes/templates/table';

@Directive({
  selector: '[ngnTableTd]',
  host: { '[style.--ngn-table-column-index]': 'columnIndex()' },
})
export class NgnTableTd extends NgnBase<'table'> {
  protected readonly theme = this.injectThemeTemplate(tableControlTemplate);

  protected readonly columnIndex = signal(0);

  constructor() {
    super();
    this.prepareDom();
    const parent = this.element.nativeElement.parentElement?.children;
    if (parent) {
      const index = Array.from(parent).findIndex(child => child === this.element.nativeElement);
      this.columnIndex.set(index + 1);
    }
  }

  private prepareDom() {
    this.element.nativeElement.classList.toggle(this.theme.class('cell'), true);
  }
}
