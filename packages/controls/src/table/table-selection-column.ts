import {
  ApplicationRef,
  type ComponentRef,
  computed,
  createComponent,
  Directive,
  effect,
  ElementRef,
  EnvironmentInjector,
  inject,
  type OnDestroy,
  Type,
} from '@angular/core';
import { injectThemeTemplate, setComponentInput } from '@ngneers/controls/api/ng';
import { getNearestNgnInstanceSig } from '@ngneers/controls/base';
import { NgnCheckbox } from '@ngneers/controls/checkbox';
import { toggleClass } from '@ngneers/controls/utils';
import { tableControlTemplate } from '@ngneers/controls-themes/templates/table';

import { NgnTable } from './table';
import { NgnTableBodyTr } from './table-row';

/**
 * Directive that turns a `<th>` or `<td>` into a selection checkbox column.
 *
 * **Header usage** — renders a "select all / none" checkbox:
 * ```html
 * <th ngnTableSelectionColumn></th>
 * ```
 *
 * **Body usage** — renders a per-row checkbox (must be inside a `[ngnTableBodyTr]`):
 * ```html
 * <td ngnTableSelectionColumn></td>
 * ```
 *
 * @category directive
 */
@Directive({
  selector: '[ngnTableSelectionColumn]',
  host: {
    '(click)': 'onClick($event)',
  },
})
export class NgnTableSelectionColumn implements OnDestroy {
  protected readonly theme = injectThemeTemplate(tableControlTemplate);
  private readonly _element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _envInjector = inject(EnvironmentInjector);
  private readonly _appRef = inject(ApplicationRef);

  private readonly _table = getNearestNgnInstanceSig<Type<NgnTable<any, any>>>(
    this._element.nativeElement,
    NgnTable
  );

  /** Non-null only when used inside a body row (`<td>`). */
  private readonly _bodyTr = inject(NgnTableBodyTr, { optional: true });

  private readonly _isHeader = this._element.nativeElement.tagName === 'TH';

  /**
   * NgnCheckbox created at the application level via `createComponent` + `EnvironmentInjector`.
   * This keeps it outside Angular's view tree so @for reconciliation cannot destroy it.
   */
  private _checkboxRef!: ComponentRef<NgnCheckbox<boolean>>;

  protected readonly selected = computed(() => {
    if (this._isHeader) return false;
    const table = this._table();
    const row = this._bodyTr?.ngnTableBodyTr();
    if (!table || !row) return false;
    return table.isRowSelected(row.id);
  });

  protected readonly focused = computed(() => {
    if (this._isHeader) return false;
    const table = this._table();
    const row = this._bodyTr?.ngnTableBodyTr();
    if (!table || !row) return false;
    return table.focusedRowIndex() === row.index;
  });

  constructor() {
    this._prepareDom();
    this._createCheckbox();

    if (this._isHeader) {
      this._setupHeaderEffects();
      // Register the selection column once the table signal resolves
      effect(() => {
        const table = this._table();
        if (table) {
          table.registerSelectionColumn();
        }
      });
    } else {
      this._setupBodyEffects();
    }
  }

  public ngOnDestroy(): void {
    if (this._isHeader) {
      this._table()?.unregisterSelectionColumn();
    }
    this._appRef.detachView(this._checkboxRef.hostView);
    this._checkboxRef.destroy();
  }

  private _prepareDom(): void {
    const el = this._element.nativeElement;
    toggleClass(el, this.theme.class('cell'), true);
    toggleClass(el, this.theme.class('selection-column'), true);
    if (this._isHeader) {
      el.setAttribute('aria-label', 'Select all rows');
    }
  }

  /**
   * Creates an NgnCheckbox via `createComponent` + `EnvironmentInjector`.
   * The component is attached to `ApplicationRef` (not a ViewContainerRef),
   * so Angular's @for block reconciliation cannot destroy it.
   */
  private _createCheckbox(): void {
    this._checkboxRef = createComponent(NgnCheckbox, {
      environmentInjector: this._envInjector,
    });
    this._appRef.attachView(this._checkboxRef.hostView);

    const cbEl = this._checkboxRef.location.nativeElement;
    cbEl.classList.add(this.theme.class('selection-checkbox'));

    if (this._isHeader) {
      setComponentInput(this._checkboxRef, 'allowIndeterminate', true);
    }

    this._element.nativeElement.appendChild(cbEl);
  }

  // --- Header (select-all) ---

  private _setupHeaderEffects(): void {
    effect(() => {
      const table = this._table();
      if (!table) return;
      setComponentInput(this._checkboxRef, 'value', table.headerCheckboxValue());
    });
  }

  // --- Body (per-row) ---

  private _setupBodyEffects(): void {
    effect(() => {
      const isSelected = this.selected();
      const isFocused = this.focused();
      const row = this._bodyTr?.ngnTableBodyTr();
      const el = this._element.nativeElement;

      setComponentInput(this._checkboxRef, 'value', isSelected);
      if (row) {
        el.style.setProperty('--ngn-table-row-index', String(row.index + 2));
      }
      toggleClass(el, this.theme.class('selected-row-cell'), isSelected);
      toggleClass(el, this.theme.class('focused-row-cell'), isFocused);
    });
  }

  // --- Click handling ---

  protected onClick(event: MouseEvent): void {
    event.stopPropagation();
    const table = this._table();
    if (!table) return;

    if (this._isHeader) {
      table.toggleSelectAll();
    } else {
      const row = this._bodyTr?.ngnTableBodyTr();
      if (row) {
        table.handleCheckboxChange(row);
      }
    }
  }
}
