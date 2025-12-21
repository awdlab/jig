import { Directive, OnDestroy, OnInit } from '@angular/core';
import { getNearestNgnInstance, NgnBase } from '@ngneers/controls/base';
import { tableControlTemplate } from '@ngneers/controls-themes/templates/table';

import { NgnTable } from './table';
import { NgnError } from '../utils';

@Directive({ selector: '[ngnTableHeaderCell]' })
export class NgnTableHeaderCell extends NgnBase<'table'> implements OnDestroy, OnInit {
  private readonly theme = this.injectThemeTemplate(tableControlTemplate);
  private _table?: NgnTable<object, never>;
  constructor() {
    super();
    this.prepareDom();
  }

  public ngOnInit(): void {
    const table = getNearestNgnInstance(this.element.nativeElement, NgnTable);
    if (!table) {
      throw new NgnError(
        'ngnTableHeaderCell',
        'ngnTableHeaderCell must be used within an NgnTable component'
      );
    }
    this._table = table;
    this._table.registerHeaderCell(this);
  }

  public ngOnDestroy(): void {
    this._table?.unregisterHeaderCell(this);
  }

  private prepareDom() {
    this.element.nativeElement.classList.toggle(this.theme.class('cell'), true);
  }
}
