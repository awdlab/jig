import { Directive, ElementRef, inject, input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { getNearestNgnInstance, NgnBase } from '@ngneers/controls/base';
import { NgnError, toggleClass } from '@ngneers/controls/utils';
import { tableControlTemplate } from '@ngneers/controls-themes/templates/table';

import { NgnTable } from './table';

@Directive({ selector: '[ngnTableTh]' })
export class NgnTableTh extends NgnBase<'table'> implements OnDestroy, OnInit {
  protected readonly theme = this.injectThemeTemplate(tableControlTemplate);
  private _table?: NgnTable<any, any>;

  public readonly ngnTableTh = input.required<string>();

  constructor() {
    super();
    this.prepareDom();

    const element = inject(Renderer2).createElement('div');
    element.classList.add(this.theme.class('spacer'));
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.appendChild(element);
  }

  public ngOnInit(): void {
    const table = getNearestNgnInstance(this.element.nativeElement, NgnTable<any, any>);
    if (!table) {
      throw new NgnError('ngnTableTh', 'ngnTableTh must be used within an NgnTable component');
    }
    this._table = table;
    this._table.registerHeaderCell(this);
  }

  public ngOnDestroy(): void {
    this._table?.unregisterHeaderCell(this);
  }

  private prepareDom() {
    toggleClass(this.element.nativeElement, this.theme.class('cell'), true);
  }
}
