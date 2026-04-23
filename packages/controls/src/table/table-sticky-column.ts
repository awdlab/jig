import {
  afterNextRender,
  Directive,
  ElementRef,
  inject,
  input,
  type OnDestroy,
  Type,
} from '@angular/core';
import { injectThemeTemplate } from '@ngneers/controls/api/ng';
import { getNearestNgnInstanceSig } from '@ngneers/controls/base';
import { toggleClass } from '@ngneers/controls/utils';
import { tableControlTemplate } from '@ngneers/controls-themes/templates/table';

import { NgnTable } from './table';
import { NgnTableTh } from './table-header-cell';

// ── Shared scroll + resize tracking per <table> element ─────────────────────

interface TableTrackingState {
  scrollListener: () => void;
  resizeObserver: ResizeObserver;
  recalcRafId: number;
  directives: Set<NgnTableStickyColumn>;
  tableHostEl: HTMLElement;
}
const tableTracker = new WeakMap<Element, TableTrackingState>();

function attachTableTracking(
  scrollContainer: Element,
  tableHostEl: HTMLElement,
  directive: NgnTableStickyColumn,
  theme: ReturnType<typeof injectThemeTemplate<typeof tableControlTemplate>>
): void {
  const existing = tableTracker.get(scrollContainer);
  if (existing) {
    existing.directives.add(directive);
    return;
  }

  const updateScrollClasses = () => {
    const el = scrollContainer;
    const scrolledLeft = el.scrollLeft > 1;
    const scrolledRight = el.scrollLeft < el.scrollWidth - el.clientWidth - 1;
    toggleClass(tableHostEl, theme.class('sticky-scrolled-left'), scrolledLeft);
    toggleClass(tableHostEl, theme.class('sticky-scrolled-right'), scrolledRight);
  };

  const stickyColumnClass = theme.class('sticky-column');
  const selectionColumnClass = theme.class('selection-column');

  const recalcAllOffsets = () => {
    const state = tableTracker.get(scrollContainer);
    if (!state) return;

    // Make all checkbox/selection columns sticky (they're created dynamically,
    // not via template, so the directive can't be placed on them).
    const selectionCols = Array.from(
      scrollContainer.querySelectorAll<HTMLElement>(`.${selectionColumnClass}`)
    );
    for (const col of selectionCols) {
      if (!col.classList.contains(stickyColumnClass)) {
        toggleClass(col, stickyColumnClass, true);
        toggleClass(col, theme.class('sticky-left'), true);
      }
      col.style.left = '0px';
    }

    for (const dir of state.directives) {
      dir._recalcOffset();
    }
    updateScrollClasses();
  };

  scrollContainer.addEventListener('scroll', updateScrollClasses, { passive: true });

  const directives = new Set<NgnTableStickyColumn>();
  directives.add(directive);

  // Coalesce rapid ResizeObserver callbacks (e.g. from selection class toggles)
  // into a single recalculation per animation frame.
  const state: TableTrackingState = {
    scrollListener: updateScrollClasses,
    resizeObserver: null!,
    recalcRafId: 0,
    directives,
    tableHostEl,
  };
  const debouncedRecalc = () => {
    if (state.recalcRafId) return;
    state.recalcRafId = requestAnimationFrame(() => {
      state.recalcRafId = 0;
      recalcAllOffsets();
    });
  };

  state.resizeObserver = new ResizeObserver(() => debouncedRecalc());
  state.resizeObserver.observe(scrollContainer);
  // Also observe <thead> — its subgrid cells change size when grid-template-columns updates,
  // but the table container's border-box may not change (overflow: auto).
  const thead = scrollContainer.querySelector('thead');
  if (thead) {
    state.resizeObserver.observe(thead);
  }

  // Initial update
  requestAnimationFrame(() => {
    recalcAllOffsets();
    updateScrollClasses();
  });

  tableTracker.set(scrollContainer, state);
}

function detachTableTracking(scrollContainer: Element, directive: NgnTableStickyColumn): void {
  const state = tableTracker.get(scrollContainer);
  if (!state) return;
  state.directives.delete(directive);
  if (state.directives.size === 0) {
    scrollContainer.removeEventListener('scroll', state.scrollListener);
    state.resizeObserver.disconnect();
    if (state.recalcRafId) cancelAnimationFrame(state.recalcRafId);
    toggleClass(
      state.tableHostEl,
      state.tableHostEl.className.split(' ').find(c => c.includes('sticky-scrolled-left')) ?? '',
      false
    );
    toggleClass(
      state.tableHostEl,
      state.tableHostEl.className.split(' ').find(c => c.includes('sticky-scrolled-right')) ?? '',
      false
    );
    tableTracker.delete(scrollContainer);
  }
}

// ── Directive ───────────────────────────────────────────────────────────────

/**
 * @category directive
 */
@Directive({
  selector: '[ngnTableStickyColumn]',
})
export class NgnTableStickyColumn implements OnDestroy {
  protected readonly theme = injectThemeTemplate(tableControlTemplate);
  private readonly _element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _headerCell = inject(NgnTableTh, { optional: true });

  private readonly _table = getNearestNgnInstanceSig<Type<NgnTable<any, any>>>(
    this._element.nativeElement,
    NgnTable
  );

  /**
   * Which side this column sticks to.
   */
  public readonly ngnTableStickyColumn = input.required<'left' | 'right'>();

  private _scrollContainer: Element | null = null;

  constructor() {
    const el = this._element.nativeElement;

    // Apply static sticky classes immediately
    toggleClass(el, this.theme.class('sticky-column'), true);

    afterNextRender(() => {
      const side = this.ngnTableStickyColumn();
      toggleClass(el, this.theme.class('sticky-left'), side === 'left');
      toggleClass(el, this.theme.class('sticky-right'), side === 'right');

      // Register with table for reorder awareness
      const table = this._table();
      const columnId = this._getColumnId();
      if (table && columnId) {
        table.registerStickyColumnId(columnId, side);
      }

      // Set up shared scroll + resize listener
      this._scrollContainer = el.closest('table');
      if (this._scrollContainer && table) {
        attachTableTracking(this._scrollContainer, table.element.nativeElement, this, this.theme);
      }

      // Initial offset + boundary calculation
      this._recalcOffset();
    });
  }

  public ngOnDestroy(): void {
    const table = this._table();
    const columnId = this._getColumnId();
    if (table && columnId) {
      table.unregisterStickyColumnId(columnId);
    }
    if (this._scrollContainer) {
      detachTableTracking(this._scrollContainer, this);
    }
  }

  /**
   * Recalculates sticky offset and boundary classes. Called by the shared
   * ResizeObserver when the table container changes size.
   * @internal
   */
  public _recalcOffset(): void {
    const el = this._element.nativeElement;
    const side = this.ngnTableStickyColumn();
    this._applyStickyOffset(el, side);
    this._applyBoundaryClasses(el, side);
  }

  private _getColumnId(): string | null {
    return this._headerCell?.ngnTableTh() ?? null;
  }

  /**
   * Computes and applies the sticky offset by measuring sibling sticky elements.
   * For left: offset = sum of widths of all preceding sticky-left cells + selection column.
   * For right: offset = sum of widths of all following sticky-right cells.
   */
  private _applyStickyOffset(el: HTMLElement, side: 'left' | 'right'): void {
    const stickyLeftClass = this.theme.class('sticky-left');
    const stickyRightClass = this.theme.class('sticky-right');
    const selectionColumnClass = this.theme.class('selection-column');

    // Find the row-level container.
    // For headers: all sticky cells in <thead>
    // For body: all sticky cells in the same <tr>
    const container = el.tagName === 'TH' ? el.closest('thead') : el.parentElement;
    if (!container) return;

    if (side === 'left') {
      let offset = 0;

      // Sum widths of all preceding sticky-left siblings (includes selection column
      // which was given sticky-left by the shared tracker)
      const stickyCells = Array.from(container.querySelectorAll(`.${stickyLeftClass}`));
      for (const cell of stickyCells) {
        if (cell === el) break;
        offset += cell.getBoundingClientRect().width;
      }

      el.style.left = `${offset}px`;
      el.style.right = '';
    } else {
      let offset = 0;

      // Sum widths of all following sticky-right siblings
      const stickyCells = Array.from(container.querySelectorAll(`.${stickyRightClass}`));
      for (let i = stickyCells.length - 1; i >= 0; i--) {
        if (stickyCells[i] === el) {
          break;
        }
        offset += stickyCells[i]!.getBoundingClientRect().width;
      }

      el.style.right = `${offset}px`;
      el.style.left = '';
    }
  }

  /**
   * Marks boundary cells: last sticky-left gets `sticky-left-last`,
   * first sticky-right gets `sticky-right-first`.
   */
  private _applyBoundaryClasses(el: HTMLElement, side: 'left' | 'right'): void {
    const stickyLeftClass = this.theme.class('sticky-left');
    const stickyRightClass = this.theme.class('sticky-right');

    const container = el.tagName === 'TH' ? el.closest('thead') : el.parentElement;
    if (!container) return;

    if (side === 'left') {
      const stickyCells = Array.from(container.querySelectorAll(`.${stickyLeftClass}`));
      const isLast = stickyCells[stickyCells.length - 1] === el;
      toggleClass(el, this.theme.class('sticky-left-last'), isLast);
    } else {
      const stickyCells = Array.from(container.querySelectorAll(`.${stickyRightClass}`));
      const isFirst = stickyCells[0] === el;
      toggleClass(el, this.theme.class('sticky-right-first'), isFirst);
    }
  }
}
