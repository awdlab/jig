import {
  afterNextRender,
  Directive,
  ElementRef,
  inject,
  input,
  type OnDestroy,
  Type,
} from '@angular/core';
import { getNearestJigInstanceSig } from '@awdlab/jig/base';

import { JigTable } from './table';
import { JigTableTh } from './table-header-cell';

/**
 * Pins the column of its {@link JigTableTh} to the start or end edge of the
 * table so it stays visible while the body scrolls horizontally.
 *
 * Goes on the header cell; the matching body cells follow automatically.
 *
 * @category directive
 */
@Directive({
  selector: '[jigTableStickyColumn]',
})
export class JigTableStickyColumn implements OnDestroy {
  private readonly _element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _headerCell = inject(JigTableTh);
  private readonly _columnId = this._headerCell.jigTableTh;

  /** Which edge the column sticks to: `'start'` (left) or `'end'` (right). */
  public readonly jigTableStickyColumn = input.required<'start' | 'end'>();

  private readonly _table = getNearestJigInstanceSig<Type<JigTable<any, any>>>(
    this._element.nativeElement,
    JigTable
  );

  constructor() {
    afterNextRender(() => {
      const table = this._table();
      if (table) {
        table.registerStickyColumn(this._columnId(), this.jigTableStickyColumn());
      }
    });
  }

  public ngOnDestroy(): void {
    this._table()?.unregisterStickyColumn(this._columnId());
  }
}
