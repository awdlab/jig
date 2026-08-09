import {
  ComponentRef,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  type OnDestroy,
  type Signal,
  ViewContainerRef,
  viewChildren,
} from '@angular/core';
import { injectThemeTemplate } from '@awdlab/jig/api/ng';
import { AwdActionButton } from '@awdlab/jig/button';
import { AwdMenu, openMenuAt } from '@awdlab/jig/menu';
import { tableControlTemplate } from '@awdlab/jig-themes/templates/table';

import { actionItemToButtonConfig, hasChildren } from './action-item-mapping';

import type { AwdActionButtonConfig, JigActionItem } from '@awdlab/jig/api';

type BarAction = {
  item: JigActionItem;
  config: AwdActionButtonConfig<string>;
  hasChildren: boolean;
};

/**
 * Inline row-actions bar: renders each {@link JigActionItem} as an
 * `jig-action-button`. An action with `children` opens a submenu popover
 * anchored to its own button — the anchor is resolved from the rendered
 * button element itself, never from a `testId` lookup, so it keeps working
 * even when an action has no `testId`. Positioning/visibility is applied by
 * the table theme via the `row-actions` class; this component only renders
 * the buttons.
 */
@Component({
  selector: 'jig-table-row-actions-bar',
  imports: [AwdActionButton],
  template: `
    @for (action of barActions(); track action.item.id) {
      <jig-action-button
        [config]="action.config"
        [inline]="true"
        [attr.aria-haspopup]="action.hasChildren ? 'menu' : null"
        (clicked)="onClicked(action)"
      />
    }
  `,
  host: {
    '[class]': `theme.class('row-actions')`,
    role: 'presentation',
    '(click)': 'onBarClick($event)',
  },
})
export class AwdTableRowActionsBar implements OnDestroy {
  protected readonly theme = injectThemeTemplate(tableControlTemplate);
  private readonly _vcr = inject(ViewContainerRef);
  private readonly _element = inject<ElementRef<HTMLElement>>(ElementRef);
  private _menu?: ComponentRef<AwdMenu>;

  // One host `ElementRef` per rendered `jig-action-button`, in the same order
  // as `barActions()`. Reading the native `<button>` off these refs is the
  // robust anchor for the submenu popover — it doesn't depend on the action
  // having a `testId`. The accessible name itself is owned by `AwdTooltip`
  // (via `ngnTooltipAutoAriaMode="label"` on `action-button.html`), not this
  // component.
  private readonly _buttonHosts = viewChildren(AwdActionButton, { read: ElementRef });

  /**
   * The actions to render as buttons. Used for standalone consumers that bind
   * an array directly. When {@link actionsSource} is provided (the directive
   * mounts the bar imperatively), that signal takes precedence.
   */
  public readonly actions = input<JigActionItem[]>([]);

  /**
   * A reactive source of actions. Preferred over {@link actions} when set:
   * the host directive passes its own `actions` input signal here so the bar
   * reads it lazily during its own change detection. This avoids the directive
   * imperatively re-pushing the array every change-detection pass — which, when
   * a consumer binds a fresh array each pass (e.g. `actionsFor(row)`), would
   * otherwise loop into infinite change detection (NG0103).
   * @internal
   */
  public readonly actionsSource = input<Signal<JigActionItem[]> | null>(null);

  protected readonly barActions = computed<BarAction[]>(() => {
    const source = this.actionsSource();
    const items = source ? source() : this.actions();
    return items.map(item => ({
      item,
      config: actionItemToButtonConfig(item),
      hasChildren: hasChildren(item),
    }));
  });

  public ngOnDestroy(): void {
    this._menu?.destroy();
  }

  // Single source of truth for the rendered `<button>` elements, in bar order:
  // derived from the `_buttonHosts()` view query (same as the submenu anchor
  // uses), rather than a parallel `querySelectorAll` — so focus navigation and
  // anchoring can never drift apart.
  private readonly _buttons = (): HTMLButtonElement[] =>
    this._buttonHosts()
      .map(host => this._buttonElement(host))
      .filter((b): b is HTMLButtonElement => b !== null);

  /** Focuses the first enabled action button. Returns whether one was focused. */
  public focusFirst(): boolean {
    const btn = this._buttons().find(b => !b.disabled);
    btn?.focus();
    return !!btn;
  }

  /**
   * Moves focus by `delta` among the rendered action buttons. Returns whether
   * focus stayed within the bar — `false` when the move would go past the
   * first/last button, in which case focus is left unchanged.
   */
  public move(delta: 1 | -1): boolean {
    const buttons = this._buttons();
    const active = document.activeElement;
    const idx = buttons.findIndex(b => b === active);
    const next = idx + delta;
    if (next < 0 || next >= buttons.length) return false;
    buttons[next]?.focus();
    return true;
  }

  /**
   * Stops a native button click (mouse or Space/Enter key activation) from
   * bubbling to the row's own click handler — otherwise, on a table with
   * `selectionMode` set, activating an action would also select/toggle the
   * row it lives in. Mirrors {@link import('./table-selection-column').AwdTableSelectionColumn}'s
   * click guard for the same reason.
   */
  protected onBarClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  protected onClicked(action: BarAction): void {
    if (!action.hasChildren) return;
    const index = this.barActions().indexOf(action);
    const host = index >= 0 ? this._buttonHosts()[index] : undefined;
    const anchor = (host && this._buttonElement(host)) ?? this._element.nativeElement;
    this._menu = openMenuAt(
      this._vcr,
      this._menu,
      action.item.children ?? [],
      anchor,
      'bottom-end'
    );
  }

  private _buttonElement(host: ElementRef<HTMLElement>): HTMLButtonElement | null {
    return host.nativeElement.querySelector('button');
  }
}
