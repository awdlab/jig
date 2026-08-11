import {
  booleanAttribute,
  Component,
  computed,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import { JigPt, provideSelf } from '@awdlab/jig/base';
import { JigListBox } from '@awdlab/jig/list-box';
import { JigPopover, type PopoverOptions } from '@awdlab/jig/popover';
import { deepMerge } from '@awdlab/jig/utils';
import { explicitEffect } from '@awdlab/jig/utils-ng';
import { dropdownListControlTemplate } from '@awdlab/jig-themes/templates/dropdown-list';

import { DropdownListTemplates, type ValueType } from './dropdown-list-templates';

import type { FilterConfig, JigItem, JigItemsValue } from '@awdlab/jig/api';
import type { Anchor, Openable, PopoverCloseBy } from '@awdlab/jig/api/ng';

/**
 * An anchored popover wrapping a {@link JigListBox} — the dropdown half of a
 * combobox, usable on its own (a button that opens a list) or as the list
 * surface of a richer control such as `jig-select` or `jig-tag-input`.
 *
 * Sizing is an ordinary popover concern: pass
 * `{ sizeConstraints: { width: 1, maxWidth: 1 } }` to match the anchor's width,
 * or leave it out for a content-sized list anchored to a slim trigger.
 *
 * Content marked `dropdownHeader` is projected above the list — that is how
 * `jig-select` puts its filter field inside the popover.
 *
 * @category control
 */
@Component({
  selector: 'jig-dropdown-list',
  templateUrl: './dropdown-list.html',
  imports: [JigPt, JigPopover, JigListBox],
  providers: [provideSelf(JigDropdownList)],
})
export class JigDropdownList<Items extends readonly JigItem[], Multiple extends boolean = false>
  extends DropdownListTemplates<Items, Multiple>
  implements Openable
{
  protected readonly theme = this.injectThemeTemplate(dropdownListControlTemplate, 'root');

  private readonly _popover = viewChild<JigPopover>(JigPopover);
  private readonly _listBox = viewChild<JigListBox<Items, Multiple>>(JigListBox);

  /**
   * The element the list is anchored to.
   */
  public readonly anchor = input.required<Anchor>();
  /**
   * Options for the popover holding the list, including its `sizeConstraints` —
   * this is how the list's width is controlled. Merged over the defaults, which
   * deliberately set no width so the list is content-sized.
   * @default { cache: true, sizeConstraints: { maxHeight: '700px' } }
   */
  public readonly popoverOptions = input<PopoverOptions>({});
  /**
   * How the list closes depending on user interaction.
   * @default any
   */
  public readonly closeBy = input<PopoverCloseBy>('any');
  /**
   * Whether clicking an item closes the list. Set `false` for a list the user
   * picks from repeatedly, such as tag suggestions.
   * @default true
   */
  public readonly closeOnSelect = input(true, { transform: booleanAttribute });

  /**
   * The items to display. See {@link JigListBox.items}.
   */
  public readonly items = input.required<Items>();
  /**
   * Whether multiple items can be selected. When enabled the value becomes an
   * array of item values.
   */
  public readonly multiple = input<Multiple>();
  /**
   * Whether a checkbox indicates selection state.
   * @default multiple()
   */
  public readonly checkbox = input<boolean>();
  /**
   * Whether items can be selected by the user.
   * @default true
   */
  public readonly selectable = input(true, { transform: booleanAttribute });
  /**
   * Whether hovering an item selects it.
   * @default false
   */
  public readonly selectOnHover = input(false, { transform: booleanAttribute });
  /**
   * Whether a divider is drawn above each group, separating it from what precedes it.
   * @default false
   */
  public readonly separator = input(false, { transform: booleanAttribute });
  /**
   * Accepts a boolean that enables filtering, or a `FilterConfig` to customize it.
   * Drive the text with {@link filterText}.
   * @default false
   */
  public readonly filter = input<FilterConfig<Items[number]> | boolean>(false);
  /**
   * The text the list is filtered by. See {@link filter}.
   */
  public readonly filterText = input<string | null>(null);
  /**
   * Whether the list is virtualized.
   * @default false
   */
  public readonly virtual = input(false, { transform: booleanAttribute });
  /**
   * Row height when {@link virtual} is enabled.
   */
  public readonly itemHeight = input<number>();
  /**
   * Whether to scroll to the selected item when the list opens. Pass a
   * `ScrollLogicalPosition` to control where it lands in the viewport.
   * @default true
   */
  public readonly scrollToSelectedItemOnOpen = input<boolean | ScrollLogicalPosition>(true);

  /**
   * Two-way open state of the list.
   */
  public readonly open = model(false);
  /**
   * Emitted when an item is clicked, carrying that item's value.
   */
  public readonly itemClicked = output<JigItemsValue<Items>>();
  /**
   * Emitted once the list has fully closed, after its exit animation.
   */
  public readonly closed = output<void>();
  /**
   * Emitted when the close starts.
   */
  public readonly closing = output<void>();

  /** The popover options actually applied: the caller's merged over the defaults. */
  public readonly appliedPopoverOptions = computed<PopoverOptions>(() =>
    deepMerge<PopoverOptions, PopoverOptions>(
      { cache: true, sizeConstraints: { maxHeight: '700px' } },
      this.popoverOptions()
    )
  );

  /** Items currently rendered, after filtering. Empty while the list is closed. */
  public readonly displayedItems = computed(() => this._listBox()?.displayedItems() ?? []);

  /**
   * The option id the highlight currently sits on, or `null`. A host that owns
   * focus itself — a combobox input driving this list — points its own
   * `aria-activedescendant` at this.
   */
  public readonly highlightedOptionId = computed(
    () => this._listBox()?.highlightedOptionId() ?? null
  );

  /**
   * The item value the highlight currently sits on, or `null`. A host committing
   * the highlighted entry on Enter reads this, not {@link highlightedOptionId}.
   */
  public readonly highlightedValue = computed(
    () => this._listBox()?.currentHighlightedValue() ?? null
  );

  constructor() {
    super();
    explicitEffect([this.open], ([open]) => {
      if (open && !this._popover()?.open()) {
        this.show();
      }
      if (!open && this._popover()?.open()) {
        this.hide();
      }
    });
  }

  /** Clears the keyboard highlight. */
  public clearHighlight(): void {
    this._listBox()?.currentHighlightedValue.set(null);
  }

  /**
   * Opens the list. Does nothing while disabled or readonly.
   */
  public show(): void {
    if (this.disabled() || this.readonly()) {
      return;
    }
    this._popover()?.show();
  }

  /**
   * Closes the list.
   */
  public hide(): void {
    this._popover()?.hide();
  }

  /**
   * Opens or closes the list, whichever it is not.
   */
  public toggle(): void {
    if (this._popover()?.open()) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Forwards a key event to the list box so navigation keys move the highlight.
   * A host that owns focus (a combobox input) calls this; keys are ignored while
   * the list is closed.
   */
  public onKeyDown(event: KeyboardEvent): void {
    if (this._popover()?.open()) {
      this._listBox()?.onKeyDown(event);
    }
  }

  protected onSelect(value: ValueType<Items, Multiple> | null): void {
    this.value.set(value);
  }

  protected onItemClicked(value: JigItemsValue<Items>): void {
    this.itemClicked.emit(value);
    if (this.closeOnSelect()) {
      this.hide();
    }
  }

  protected onPopoverOpenChange(open: boolean): void {
    this.open.set(open);
  }
}
