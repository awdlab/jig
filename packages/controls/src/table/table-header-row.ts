import {
  ComponentRef,
  Directive,
  effect,
  ElementRef,
  inject,
  type OnDestroy,
  Renderer2,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { setComponentInput } from '@ngneers/controls/api/ng';
import { getNearestNgnInstanceSig, NgnBase } from '@ngneers/controls/base';
import { NgnCheckbox } from '@ngneers/controls/checkbox';
import { toggleClass } from '@ngneers/controls/utils';
import { tableControlTemplate } from '@ngneers/controls-themes/templates/table';

import { NgnTable } from './table';

@Directive({ selector: '[ngnTableHeadTr]', host: { '[attr.aria-rowindex]': '1' } })
export class NgnTableHeadTr extends NgnBase<'table'> implements OnDestroy {
  protected readonly theme = this.injectThemeTemplate(tableControlTemplate);
  private readonly _element = inject(ElementRef<HTMLElement>);
  private readonly _renderer = inject(Renderer2);
  private readonly _vcr = inject(ViewContainerRef);
  private readonly _table = getNearestNgnInstanceSig<Type<NgnTable<any, any>>>(
    this._element.nativeElement,
    NgnTable
  );

  private _checkboxTh: HTMLElement | null = null;
  private _checkboxRef: ComponentRef<NgnCheckbox<boolean>> | null = null;

  constructor() {
    super();
    this.prepareDom();

    // Reactively create/remove checkbox header cell
    effect(() => {
      const table = this._table();
      if (!table) return;
      const show = table.showCheckboxes();

      if (show && !this._checkboxTh) {
        this._createHeaderCheckbox(table);
      } else if (!show && this._checkboxTh) {
        this._destroyHeaderCheckbox();
      }
    });

    // Reactively update checkbox value
    effect(() => {
      const table = this._table();
      const ref = this._checkboxRef;
      if (!table || !ref) return;
      setComponentInput(ref, 'value', table.headerCheckboxValue());
    });
  }

  public ngOnDestroy(): void {
    this._destroyHeaderCheckbox();
  }

  private _createHeaderCheckbox(table: NgnTable<any, any>): void {
    const th = this._renderer.createElement('th');
    toggleClass(th, this.theme.class('cell'), true);
    toggleClass(th, this.theme.class('selection-column'), true);
    th.setAttribute('aria-label', 'Select all rows');

    this._checkboxRef = this._vcr.createComponent(NgnCheckbox);
    const cbEl = this._checkboxRef.location.nativeElement;
    cbEl.classList.add(this.theme.class('selection-checkbox'));
    this._checkboxRef.setInput('allowIndeterminate', true);
    this._checkboxRef.setInput('value', table.headerCheckboxValue());

    th.appendChild(cbEl);
    th.addEventListener('click', (e: MouseEvent) => {
      e.stopPropagation();
      table.toggleSelectAll();
    });

    const tr = this._element.nativeElement;
    tr.insertBefore(th, tr.firstChild);
    this._checkboxTh = th;
  }

  private _destroyHeaderCheckbox(): void {
    this._checkboxTh?.remove();
    this._checkboxTh = null;
    this._checkboxRef?.destroy();
    this._checkboxRef = null;
  }

  private prepareDom() {
    toggleClass(this._element.nativeElement, this.theme.class('row'), true);
  }
}
