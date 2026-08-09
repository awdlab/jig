import {
  afterNextRender,
  Directive,
  ElementRef,
  inject,
  type OnDestroy,
  Type,
} from '@angular/core';
import { injectThemeTemplate } from '@awdlab/jig/api/ng';
import { getNearestJigInstanceSig } from '@awdlab/jig/base';
import { toggleClass } from '@awdlab/jig/utils';
import { tableControlTemplate } from '@awdlab/jig-themes/templates/table';

import { JigTable } from './table';
import { JigTableTh } from './table-header-cell';

/** Minimum distance in pixels before a drag is initiated. */
const REORDER_DEAD_ZONE_PX = 5;

/**
 * @category directive
 */
@Directive({
  selector: '[jigTableReorderableColumn]',
})
export class JigTableReorderableColumn implements OnDestroy {
  protected readonly theme = injectThemeTemplate(tableControlTemplate);
  private readonly _element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _headerCell = inject(JigTableTh);
  private readonly _columnId = this._headerCell.jigTableTh;

  private readonly _table = getNearestJigInstanceSig<Type<JigTable<any, any>>>(
    this._element.nativeElement,
    JigTable
  );

  private _isDragging = false;
  private _startX = 0;
  private _startY = 0;
  private _pointerId: number | null = null;
  private _boundOnPointerMove: ((e: PointerEvent) => void) | null = null;
  private _boundOnPointerUp: (() => void) | null = null;
  private _boundOnPointerCancel: (() => void) | null = null;
  private _boundOnKeyDown: ((e: KeyboardEvent) => void) | null = null;

  constructor() {
    afterNextRender(() => {
      const el = this._element.nativeElement;
      el.addEventListener('pointerdown', this.onPointerDown);
    });
  }

  public ngOnDestroy(): void {
    this._element.nativeElement.removeEventListener('pointerdown', this.onPointerDown);
    this.cleanup();
  }

  private readonly onPointerDown = (event: PointerEvent) => {
    const table = this._table();
    if (!table?.reorderable()) return;

    // Don't intercept resize handle clicks
    const target = event.target as HTMLElement;
    if (target.classList.contains(this.theme.class('resize-handle'))) return;

    event.preventDefault();

    this._startX = event.clientX;
    this._startY = event.clientY;
    this._isDragging = false;
    this._pointerId = event.pointerId;

    try {
      this._element.nativeElement.setPointerCapture(event.pointerId);
    } catch {
      // Ignore
    }

    this._boundOnPointerMove = (e: PointerEvent) => this.onPointerMove(e);
    this._boundOnPointerUp = () => this.onPointerUp();
    this._boundOnPointerCancel = () => this.onPointerCancel();
    this._boundOnKeyDown = (e: KeyboardEvent) => this.onKeyDown(e);

    this._element.nativeElement.addEventListener('pointermove', this._boundOnPointerMove);
    this._element.nativeElement.addEventListener('pointerup', this._boundOnPointerUp);
    this._element.nativeElement.addEventListener('pointercancel', this._boundOnPointerCancel);
    document.addEventListener('keydown', this._boundOnKeyDown);
  };

  private onPointerMove(event: PointerEvent): void {
    if (!this._isDragging) {
      const deltaX = event.clientX - this._startX;
      const deltaY = event.clientY - this._startY;
      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
      if (distance < REORDER_DEAD_ZONE_PX) return;

      // Start dragging
      this._isDragging = true;
      const table = this._table();
      table?.startColumnReorder(this._columnId());
      toggleClass(this._element.nativeElement, this.theme.class('drag-source'), true);
    }

    this._table()?.dragColumnReorder(event);
  }

  private onPointerUp(): void {
    if (this._isDragging) {
      this._table()?.endColumnReorder(false);
      toggleClass(this._element.nativeElement, this.theme.class('drag-source'), false);
    }
    this.cleanup();
  }

  private onPointerCancel(): void {
    if (this._isDragging) {
      this._table()?.endColumnReorder(true);
      toggleClass(this._element.nativeElement, this.theme.class('drag-source'), false);
    }
    this.cleanup();
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this._isDragging) {
      this._table()?.endColumnReorder(true);
      toggleClass(this._element.nativeElement, this.theme.class('drag-source'), false);
      this.cleanup();
    }
  }

  private cleanup(): void {
    this._isDragging = false;
    if (this._pointerId != null) {
      try {
        this._element.nativeElement.releasePointerCapture(this._pointerId);
      } catch {
        // Ignore — capture may already be released
      }
      this._pointerId = null;
    }
    if (this._boundOnPointerMove) {
      this._element.nativeElement.removeEventListener('pointermove', this._boundOnPointerMove);
      this._boundOnPointerMove = null;
    }
    if (this._boundOnPointerUp) {
      this._element.nativeElement.removeEventListener('pointerup', this._boundOnPointerUp);
      this._boundOnPointerUp = null;
    }
    if (this._boundOnPointerCancel) {
      this._element.nativeElement.removeEventListener('pointercancel', this._boundOnPointerCancel);
      this._boundOnPointerCancel = null;
    }
    if (this._boundOnKeyDown) {
      document.removeEventListener('keydown', this._boundOnKeyDown);
      this._boundOnKeyDown = null;
    }
  }
}
