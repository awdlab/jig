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
import { NgnActionButtonConfig } from '@ngneers/controls/api';
import { injectThemeTemplate, setComponentInput } from '@ngneers/controls/api/ng';
import { getNearestNgnInstanceSig } from '@ngneers/controls/base';
import { NgnActionButton } from '@ngneers/controls/button';
import { NgnFilter, NgnFilterDataType } from '@ngneers/controls/filter';
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
  private readonly _ngnActionButton: ComponentRef<NgnActionButton<null>>;
  private readonly _ngnFilter: ComponentRef<NgnFilter>;

  private readonly _table = getNearestNgnInstanceSig<Type<NgnTable<any, any>>>(
    this._element.nativeElement,
    NgnTable
  );
  protected readonly filter = computed(() => {
    const tableSort = this._table()?.sort();
    if (tableSort?.column === this.ngnTableFilterableColumn()) {
      return tableSort.direction;
    }
    return null;
  });

  public readonly ngnTableFilterableColumn = input.required<string>();
  public readonly ngnTableFilterableColumnType = input.required<NgnFilterDataType>();
  public readonly ngnTableFilterableColumnItems = input<string[] | null | undefined>();

  constructor() {
    this._ngnActionButton = inject(ViewContainerRef).createComponent(NgnActionButton<null>);
    this._ngnFilter = inject(ViewContainerRef).createComponent(NgnFilter);
    this._element.nativeElement.appendChild(this._ngnActionButton.location.nativeElement);
    this._element.nativeElement.appendChild(this._ngnFilter.location.nativeElement);
    setComponentInput(this._ngnActionButton, 'kind', 'icon');
    setComponentInput(this._ngnFilter, 'anchor', this._ngnActionButton.location.nativeElement);
    setComponentInput(this._ngnFilter, 'mode', 'headless');

    const cfg = computed(
      () =>
        <NgnActionButtonConfig<null>>{
          label: 'Filter',
          value: null,
          kind: 'icon',
          defaultIcon: this.filter() ? 'filter_solid' : 'filter',
          action: event => {
            event.stopPropagation();
            this._ngnFilter.instance.show();
          },
        }
    );

    effect(() => {
      setComponentInput(this._ngnActionButton, 'config', cfg());
    });
    effect(() => {
      setComponentInput(this._ngnFilter, 'dataType', this.ngnTableFilterableColumnType());
    });
    effect(() => {
      setComponentInput(this._ngnFilter, 'listOptions', this.ngnTableFilterableColumnItems());
    });
  }

  public ngOnDestroy(): void {
    this._ngnActionButton.destroy();
    this._ngnFilter.destroy();
  }
}
