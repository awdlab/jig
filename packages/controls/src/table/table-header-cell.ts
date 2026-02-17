import {
  afterNextRender,
  Directive,
  ElementRef,
  inject,
  input,
  type OnDestroy,
  type OnInit,
  Renderer2,
} from '@angular/core';
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

    const renderer = inject(Renderer2);
    const elRef = inject<ElementRef<HTMLElement>>(ElementRef);
    afterNextRender(() => {
      const element = renderer.createElement('div');
      element.classList.add(this.theme.class('spacer'));
      elRef.nativeElement.appendChild(element);
    });
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
