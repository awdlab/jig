import {
  afterNextRender,
  Directive,
  ElementRef,
  inject,
  input,
  type OnDestroy,
  Type,
} from '@angular/core';
import { getNearestAwdInstanceSig } from '@awdlab/jig/base';

import { AwdTable } from './table';
import { AwdTableTh } from './table-header-cell';

/**
 * Pins the column of its {@link AwdTableTh} to the start or end edge of the
 * table so it stays visible while the body scrolls horizontally.
 *
 * Goes on the header cell; the matching body cells follow automatically.
 *
 * @category directive
 */
@Directive({
  selector: '[ngnTableStickyColumn]',
})
export class AwdTableStickyColumn implements OnDestroy {
  private readonly _element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _headerCell = inject(AwdTableTh);
  private readonly _columnId = this._headerCell.ngnTableTh;

  /** Which edge the column sticks to: `'start'` (left) or `'end'` (right). */
  public readonly ngnTableStickyColumn = input.required<'start' | 'end'>();

  private readonly _table = getNearestAwdInstanceSig<Type<AwdTable<any, any>>>(
    this._element.nativeElement,
    AwdTable
  );

  constructor() {
    afterNextRender(() => {
      const table = this._table();
      if (table) {
        table.registerStickyColumn(this._columnId(), this.ngnTableStickyColumn());
      }
    });
  }

  public ngOnDestroy(): void {
    this._table()?.unregisterStickyColumn(this._columnId());
  }
}
