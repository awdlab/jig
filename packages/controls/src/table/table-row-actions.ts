import {
  booleanAttribute,
  ComponentRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  type OnDestroy,
  Renderer2,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { domEventHandler, setComponentInput } from '@ngneers/controls/api/ng';
import { getNearestNgnInstanceSig } from '@ngneers/controls/base';
import { NgnMenu, openMenuAt } from '@ngneers/controls/menu';

import { NgnTable } from './table';
import { NgnTableBodyTr } from './table-row';
import { NgnTableRowActionsBar } from './table-row-actions-bar';

import type { NgnActionItem } from '@ngneers/controls/api';

/**
 * Per-row actions for the table body `<tr>`. Exposes the same `NgnActionItem[]`
 * as a right-click context menu ({@link context}) and/or an inline hover
 * button-bar ({@link inline}). Both modes are on by default and independent.
 */
@Directive({ selector: '[ngnTableRowActions]' })
export class NgnTableRowActions implements OnDestroy {
  private readonly _element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _vcr = inject(ViewContainerRef);
  private readonly _renderer = inject(Renderer2);
  private readonly _row = inject(NgnTableBodyTr, { optional: true });
  private readonly _table = getNearestNgnInstanceSig<Type<NgnTable<any, any>>>(
    this._element.nativeElement,
    NgnTable
  );
  private _menu?: ComponentRef<NgnMenu>;
  private _bar?: ComponentRef<NgnTableRowActionsBar>;

  /** The actions available on this row. */
  public readonly actions = input.required<NgnActionItem[]>({ alias: 'ngnTableRowActions' });

  /**
   * Whether right-clicking the row opens a context menu of the actions.
   * @default true
   */
  public readonly context = input(true, {
    transform: booleanAttribute,
    alias: 'ngnTableRowActionsContext',
  });

  /**
   * Whether an inline button-bar is rendered at the row's right edge, revealed
   * on hover or keyboard focus.
   * @default true
   */
  public readonly inline = input(true, {
    transform: booleanAttribute,
    alias: 'ngnTableRowActionsInline',
  });

  constructor() {
    domEventHandler(this._element, 'contextmenu', e => this._onContextMenu(e));

    effect(() => {
      if (this.inline()) {
        this._mountBar();
      } else {
        this._unmountBar();
      }
    });

    // Register with the nearest table keyed by this row's index, so the
    // table's keyboard navigation model can reach this directive.
    effect(onCleanup => {
      const table = this._table();
      const row = this._row;
      if (!table || !row) return;
      const index = row.ngnTableBodyTr().index;
      table.registerRowActions(index, this);
      onCleanup(() => table.unregisterRowActions(index, this));
    });
  }

  public ngOnDestroy(): void {
    this._menu?.destroy();
    this._unmountBar();
  }

  /**
   * Opens the context menu anchored to the row element (keyboard trigger:
   * Enter, ContextMenu, or Shift+F10). Deliberately independent of
   * {@link context} — that input only toggles the right-click affordance,
   * not the keyboard one, so keyboard users can always reach a row's menu.
   */
  public openMenuFromKeyboard(): boolean {
    this._menu = openMenuAt(
      this._vcr,
      this._menu,
      this.actions(),
      this._element.nativeElement,
      'bottom-start'
    );
    return true;
  }

  /** Focuses the first enabled action button in the inline bar. Returns whether one was focused. */
  public focusFirstAction(): boolean {
    return this._bar?.instance.focusFirst() ?? false;
  }

  /** Moves focus by `delta` among the inline bar's action buttons. Returns whether focus stayed within the bar. */
  public moveAction(delta: 1 | -1): boolean {
    return this._bar?.instance.move(delta) ?? false;
  }

  private _onContextMenu(event: PointerEvent): void {
    // A `contextmenu` event is by definition a context-menu request (right-click
    // or the keyboard menu key), so no mouse-button check is needed — and
    // `event.button` is not reliably `2` across browsers (e.g. WebKit/Firefox),
    // which would otherwise suppress the menu there.
    if (!this.context()) return;
    if (this._menu?.instance.open()) return;
    event.preventDefault();
    event.stopPropagation();
    this._menu = openMenuAt(this._vcr, this._menu, this.actions(), {
      x: event.clientX,
      y: event.clientY,
    });
  }

  private _mountBar(): void {
    if (this._bar) return;
    this._bar = this._vcr.createComponent(NgnTableRowActionsBar);
    // Move the bar's host element inside the <tr> so it joins the row's
    // subgrid and the table's horizontal scroll container. Use Renderer2 so the
    // move stays platform-agnostic (SSR / non-DOM renderers).
    this._renderer.appendChild(this._element.nativeElement, this._bar.location.nativeElement);
    // Pass the actions SIGNAL (not its current value) once. The bar reads it
    // reactively in its own change detection, so we never re-push the array
    // here. Reading `this.actions()` inside this effect-driven method would
    // make the effect re-run on every actions change — and when a consumer
    // binds a fresh array each change-detection pass, re-pushing it would loop
    // into infinite change detection (NG0103).
    setComponentInput(this._bar, 'actionsSource', this.actions);
  }

  private _unmountBar(): void {
    this._bar?.destroy();
    this._bar = undefined;
  }
}
