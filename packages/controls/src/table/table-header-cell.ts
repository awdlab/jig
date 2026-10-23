import {
  afterRenderEffect,
  Component,
  computed,
  input,
  model,
  type OnDestroy,
  type OnInit,
  signal,
  type Signal,
} from '@angular/core';
import { getNearestJigInstance, JigBase } from '@awdlab/jig/base';
import { JigError, toggleClass } from '@awdlab/jig/utils';
import { tableControlTemplate } from '@awdlab/jig-themes/templates/table';

import { JigTable } from './table';

import type { ResizableItem, ResizeLimit, ResizeSize } from '@awdlab/jig/api/resize';

/** Interactive children that own their clicks — the header must not sort or drag on them. */
export const TABLE_HEADER_INTERACTIVE_SELECTOR =
  'button, a, input, select, textarea, [role="button"]';

/**
 * A table header cell. Declares the column's id — the key every other column
 * feature (sort, filter, sticky, reorder, resize) is addressed by — and owns
 * the column's size and resize handle.
 *
 * The cell's content is projected into a label span; buttons, links and
 * anything marked `jigTableThAction` are projected next to it instead, so
 * they stay outside the sort button.
 *
 * @category directive
 */
@Component({
  selector: 'th[jigTableTh]',
  template: `
    <span [class]="theme.class('cell-text')"><ng-content /></span>
    <ng-content select="button, a, [jigTableThAction]" />
    <div [class]="theme.class('spacer')"></div>
    @if (_showHandle()) {
      <div
        [class]="theme.class('resize-handle')"
        (pointerdown)="onResizePointerDown($event)"
        (dblclick)="onResizeDblClick($event)"
      ></div>
    }
  `,
  host: {
    role: 'columnheader',
    '[style.--jig-table-column-index]': '_visualColumnIndex()',
    '[attr.aria-colindex]': '_ariaColIndex()',
  },
})
export class JigTableTh extends JigBase<'table'> implements ResizableItem, OnDestroy, OnInit {
  protected readonly theme = this.injectThemeTemplate(tableControlTemplate);
  private _table?: JigTable<any, any>;
  private readonly _tableSignal = signal<JigTable<any, any> | null>(null);

  /** The unique column identifier for this header cell, used for sorting, filtering, sticky, and reorder. */
  public readonly jigTableTh = input.required<string>();

  /**
   * The size of this column (e.g. '1fr', '200px', '25%').
   * @default '1fr'
   */
  public readonly size = model<ResizeSize>('1fr');

  /**
   * The minimum size constraint for this column.
   * @default '50px'
   */
  public readonly minSize: Signal<ResizeLimit> = input<ResizeLimit>('50px');

  /**
   * The maximum size constraint for this column.
   * @default '100%'
   */
  public readonly maxSize: Signal<ResizeLimit> = input<ResizeLimit>('100%');

  /**
   * Whether this column is resizable. Computed from the parent table's `resizable` input.
   */
  public readonly resizable = computed(() => this._tableSignal()?.resizable() ?? false);

  /**
   * Whether the resize handle should be shown. Hidden for the last column in adjacent
   * and proportional modes since it is implicitly resized via the previous column's handle.
   * Push mode shows handles on all columns since each column grows independently.
   */
  protected readonly _showHandle = computed(() => {
    const table = this._tableSignal();
    if (!table?.resizable()) return false;
    if (table.resizeMode() === 'push') return true;
    // Adjacent & proportional: hide handle on last column
    const cells = table.getRegisteredHeaderCells();
    return cells.indexOf(this) < cells.length - 1;
  });

  /**
   * 1-based visual column index, derived from the table's column order map.
   * Falls back to registration index + 1 when no reordering is active.
   */
  public readonly _visualColumnIndex = computed(() => {
    const table = this._tableSignal();
    if (!table) return undefined;
    const map = table.columnOrderMap();
    return map.get(this.jigTableTh()) ?? this.getColumnIndex() + 1;
  });

  /** `aria-colindex` — visual index plus the selection column the theme offsets in CSS. */
  protected readonly _ariaColIndex = computed(() => {
    const index = this._visualColumnIndex();
    if (index === undefined) return null;
    return index + (this._tableSignal()?.showCheckboxes() ? 1 : 0);
  });

  constructor() {
    super();
    this.prepareDom();

    // Sticky column classes and offsets
    afterRenderEffect(() => {
      const table = this._tableSignal();
      if (!table) return;
      const info = table.getStickyInfo(this.jigTableTh());
      const el = this.element.nativeElement;
      toggleClass(el, this.theme.class('sticky-start'), info?.side === 'start');
      toggleClass(el, this.theme.class('sticky-end'), info?.side === 'end');
      toggleClass(el, this.theme.class('sticky-start-edge'), info?.side === 'start' && info.isEdge);
      toggleClass(el, this.theme.class('sticky-end-edge'), info?.side === 'end' && info.isEdge);

      // The offsets accumulate in visual column order, so they pin to the inline
      // edges — physical left/right would stick to the wrong side under RTL.
      if (info) {
        el.style.position = 'sticky';
        if (info.side === 'start') {
          el.style.insetInlineStart = `var(--jig-sticky-start-offset-${info.index})`;
          el.style.removeProperty('inset-inline-end');
        } else {
          el.style.insetInlineEnd = `var(--jig-sticky-end-offset-${info.index})`;
          el.style.removeProperty('inset-inline-start');
        }
      } else {
        el.style.removeProperty('position');
        el.style.removeProperty('inset-inline-start');
        el.style.removeProperty('inset-inline-end');
      }
    });
  }

  public ngOnInit(): void {
    const table = getNearestJigInstance(this.element.nativeElement, JigTable<any, any>);
    if (!table) {
      throw new JigError('jigTableTh', 'jigTableTh must be used within an JigTable component');
    }
    this._table = table;
    this._tableSignal.set(table);
    this._table.registerHeaderCell(this);
  }

  public ngOnDestroy(): void {
    this._table?.unregisterHeaderCell(this);
  }

  private prepareDom() {
    toggleClass(this.element.nativeElement, this.theme.class('cell'), true);
    toggleClass(this.element.nativeElement, this.theme.class('resizable'), true);
  }

  protected readonly onResizeDblClick = (event: MouseEvent) => {
    if (!this._table?.resizable()) return;
    event.preventDefault();
    event.stopPropagation();
    const columnIndex = this.getColumnIndex();
    if (columnIndex < 0) return;
    this._table.autoSizeColumn(columnIndex);
  };

  protected readonly onResizePointerDown = (event: PointerEvent) => {
    if (!this._table?.resizable()) return;
    event.preventDefault();
    event.stopPropagation();

    const target = event.target as HTMLElement;
    try {
      target.setPointerCapture(event.pointerId);
    } catch {
      // Ignore
    }

    const columnIndex = this.getColumnIndex();
    if (columnIndex < 0) return;

    this._table.startColumnResize(columnIndex, event);

    const onPointerMove = (e: PointerEvent) => {
      this._table!.dragColumnResize(columnIndex, e);
    };
    const cleanup = (cancel: boolean) => {
      this._table!.endColumnResize(columnIndex, cancel);
      target.removeEventListener('pointermove', onPointerMove);
      target.removeEventListener('pointerup', onPointerUp);
      target.removeEventListener('pointercancel', onPointerCancel);
    };
    const onPointerUp = () => cleanup(false);
    const onPointerCancel = () => cleanup(true);

    target.addEventListener('pointermove', onPointerMove);
    target.addEventListener('pointerup', onPointerUp);
    target.addEventListener('pointercancel', onPointerCancel);
  };

  private getColumnIndex(): number {
    const cells = this._tableSignal()?.getRegisteredHeaderCells();
    return cells ? cells.indexOf(this) : -1;
  }
}
