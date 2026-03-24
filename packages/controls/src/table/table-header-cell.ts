import {
  afterNextRender,
  afterRenderEffect,
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  model,
  type OnDestroy,
  type OnInit,
  Renderer2,
  type Signal,
} from '@angular/core';
import { getNearestNgnInstance, NgnBase } from '@ngneers/controls/base';
import { NgnError, toggleClass } from '@ngneers/controls/utils';
import { tableControlTemplate } from '@ngneers/controls-themes/templates/table';

import { NgnTable } from './table';

import type { ResizableItem, ResizeLimit, ResizeSize } from '@ngneers/controls/api/resize';

@Directive({
  selector: '[ngnTableTh]',
  host: {
    '[style.--ngn-table-column-index]': '_visualColumnIndex()',
  },
})
export class NgnTableTh extends NgnBase<'table'> implements ResizableItem, OnDestroy, OnInit {
  protected readonly theme = this.injectThemeTemplate(tableControlTemplate);
  private _table?: NgnTable<any, any>;
  private _resizeHandle?: HTMLDivElement;

  public readonly ngnTableTh = input.required<string>();

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
  public readonly resizable = computed(() => this._table?.resizable() ?? false);

  /**
   * Whether the resize handle should be shown. Hidden for the last column in adjacent
   * and proportional modes since it is implicitly resized via the previous column's handle.
   * Push mode shows handles on all columns since each column grows independently.
   */
  private readonly _showHandle = computed(() => {
    if (!this._table?.resizable()) return false;
    if (this._table.resizeMode() === 'push') return true;
    // Adjacent & proportional: hide handle on last column
    const cells = this._table.getRegisteredHeaderCells();
    return cells.indexOf(this) < cells.length - 1;
  });

  /**
   * 1-based visual column index, derived from the table's column order map.
   * Falls back to registration index + 1 when no reordering is active.
   */
  public readonly _visualColumnIndex = computed(() => {
    if (!this._table) return undefined;
    const map = this._table.columnOrderMap();
    return map.get(this.ngnTableTh()) ?? this.getColumnIndex() + 1;
  });

  constructor() {
    super();
    this.prepareDom();

    const renderer = inject(Renderer2);
    const elRef = inject<ElementRef<HTMLElement>>(ElementRef);
    afterNextRender(() => {
      // Wrap existing content in a text container for ellipsis support
      const textWrapper = renderer.createElement('span');
      textWrapper.classList.add(this.theme.class('cell-text'));
      const el = elRef.nativeElement;
      while (el.firstChild) {
        textWrapper.appendChild(el.firstChild);
      }
      el.appendChild(textWrapper);

      // Move dynamically-created controls back out of the text wrapper
      // so they participate in the header cell's flex layout (order: 2, 3)
      const filterControl = textWrapper.querySelector(`.${this.theme.class('filter-control')}`);
      if (filterControl) el.appendChild(filterControl);
      const sortControl = textWrapper.querySelector(`.${this.theme.class('sort-control')}`);
      if (sortControl) el.appendChild(sortControl);

      // Spacer div for flex layout
      const spacer = renderer.createElement('div');
      spacer.classList.add(this.theme.class('spacer'));
      elRef.nativeElement.appendChild(spacer);

      // Resize handle
      this._resizeHandle = renderer.createElement('div') as HTMLDivElement;
      this._resizeHandle.classList.add(this.theme.class('resize-handle'));
      this._resizeHandle.addEventListener('pointerdown', this.onResizePointerDown);
      this._resizeHandle.addEventListener('dblclick', this.onResizeDblClick);
      elRef.nativeElement.appendChild(this._resizeHandle);
    });

    // Toggle handle visibility based on mode and column position
    afterRenderEffect(() => {
      const show = this._showHandle();
      if (this._resizeHandle) {
        this._resizeHandle.style.display = show ? '' : 'none';
      }
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
    this._resizeHandle?.removeEventListener('pointerdown', this.onResizePointerDown);
    this._resizeHandle?.removeEventListener('dblclick', this.onResizeDblClick);
  }

  private prepareDom() {
    toggleClass(this.element.nativeElement, this.theme.class('cell'), true);
    toggleClass(this.element.nativeElement, this.theme.class('resizable'), true);
  }

  private readonly onResizeDblClick = (event: MouseEvent) => {
    if (!this._table?.resizable()) return;
    event.preventDefault();
    event.stopPropagation();
    const columnIndex = this.getColumnIndex();
    if (columnIndex < 0) return;
    this._table.autoSizeColumn(columnIndex);
  };

  private readonly onResizePointerDown = (event: PointerEvent) => {
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
    if (!this._table) return -1;
    const cells = this._table.getRegisteredHeaderCells();
    return cells.indexOf(this);
  }
}
