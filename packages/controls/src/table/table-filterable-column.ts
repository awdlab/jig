import {
  ComponentRef,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { injectThemeTemplate, setComponentInput } from '@ngneers/controls/api/ng';
import { getNearestNgnInstanceSig } from '@ngneers/controls/base';
import { NgnIcon } from '@ngneers/controls/icon';
import { tableControlTemplate } from '@ngneers/controls-themes/templates/table';

import { NgnTable } from './table';

@Directive({
  selector: '[ngnTableFilterableColumn]',
  host: {
    '[class]': `theme.classes({'filterable-column': true, 'filtered-column': !!filter() })`,
  },
})
export class NgnTableFilterableColumn implements OnDestroy {
  protected readonly theme = injectThemeTemplate(tableControlTemplate);
  private readonly _element = inject<ElementRef<HTMLElement>>(ElementRef);

  private readonly _table = getNearestNgnInstanceSig<Type<NgnTable<any, any>>>(
    this._element.nativeElement,
    NgnTable
  );
  protected readonly filter = computed(() => {
    const tableSort = this._table()?.sort();
    if (tableSort?.column === this.ngnTableSortableColumn()) {
      return tableSort.direction;
    }
    return null;
  });

  public readonly ngnTableSortableColumn = input.required<string>();

  private readonly _ngnIcon: ComponentRef<NgnIcon>;

  constructor() {
    this._ngnIcon = inject(ViewContainerRef).createComponent(NgnIcon);
    this._element.nativeElement.appendChild(this._ngnIcon.location.nativeElement);

    effect(() => {
      const filter = this.filter();
      setComponentInput(this._ngnIcon, 'defaultIcon', filter ? 'filter_solid' : 'filter');
    });
  }

  public ngOnDestroy(): void {
    this._ngnIcon.destroy();
  }
}
