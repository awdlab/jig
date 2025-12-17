import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  contentChild,
  effect,
  input,
  linkedSignal,
  OutputRefSubscription,
  Signal,
  signal,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FilterConfig, mapToItems, NgnItem } from '@ngneers/controls/api';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { provideSelf } from '@ngneers/controls/base';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnItemView } from '@ngneers/controls/item-view';
import { NgnListBox } from '@ngneers/controls/list-box';
import { NgnPopover, PopoverOptions } from '@ngneers/controls/popover';
import { deepMerge, NgnError } from '@ngneers/controls/utils';
import { IconType } from '@ngneers/controls-custom-types';
import { selectControlTemplate } from '@ngneers/controls-themes/templates/select';

import { SelectTemplates, ValueType } from './select-templates';
import { SelectFilterOptions } from './types';

/**
 * @category control
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-select',
  templateUrl: './select.html',
  imports: [
    NgClass,
    NgnInputField,
    NgnListBox,
    NgnPopover,
    NgnInput,
    NgTemplateOutlet,
    NgnTemplate,
    NgnItemView,
    NgnIcon,
  ],
  providers: [provideSelf(NgnSelect)],
  host: {
    '[class]': 'theme.class("")',
    style: 'display: block;',
  },
})
export class NgnSelect<
  T extends object = object,
  K extends keyof T = never,
  Editable extends boolean = false,
  Multiple extends boolean = false,
> extends SelectTemplates<T, K, Editable, Multiple> {
  protected readonly theme = this.injectThemeTemplate(selectControlTemplate);
  private readonly _popover = viewChild.required<NgnPopover>(NgnPopover);
  private readonly _customEditableInput = contentChild(NgnInput);
  private _customEditableSub?: OutputRefSubscription;

  /**
   * Options for the popover.
   */
  public readonly popoverOptions = input<PopoverOptions>({});
  protected readonly appliedPopoverOptions = computed(() =>
    deepMerge(
      {
        sizeConstraints: {
          width: 1,
          maxWidth: 1,
          minHeight: '250px',
          maxHeight: '700px',
        },
      },
      this.popoverOptions()
    )
  );
  /**
   * The available options to choose from. They can either be
   * * A list of {@link NgnItem} objects
   * * A list of plain objects. You'll have to provide a {@link fields} input to specify how to map the plain objects to {@link NgnItem} objects.
   */
  public readonly options = input<readonly NgnItem<T, K>[]>([]);
  /**
   * Accepts a boolean value that determines whether the filter is enabled.
   * Alternatively, you can provide `SelectFilterOptions` to customize the filter behavior.
   * @default `false`
   */
  public readonly filter = input<SelectFilterOptions<NgnItem<T, K>> | boolean>(false);
  /**
   * Manually set the filter text.
   */
  public readonly filterText = input<string | null>(null);
  /**
   * The icon to display in the filter input.
   */
  public readonly filterIcon = input<IconType>();
  /**
   * The icon to display in the dropdown.
   */
  public readonly dropdownIcon = input<IconType>();
  /**
   * Whether the select is virtualized.
   * @default `false`
   */
  public readonly virtual = input(false, { transform: booleanAttribute });
  /**
   * When {@link virtual} is enabled, this property defines the height of each item in the list.
   */
  public readonly itemHeight = input<number>();
  /**
   * Enable this to allow the user to type in a value that is not in the list.
   * When enabled, the value of the control becomes the label of a selected item or the typed value.
   *
   * Cannot be used with
   * * {@link multiple} selection
   * * {@link filter} without also setting {@link editableAutoFilter} to `false`
   *
   * @default `false`
   */
  public readonly editable = input<Editable>();
  /**
   * Whether to automatically filter the options based on the user's input in the {@link editable} input.
   * @default `true`
   */
  public readonly editableAutoFilter = input(true, { transform: booleanAttribute });
  /**
   * Enable this to allow the user to select multiple values.
   * When enabled, the value of the control becomes an array of selected items.
   *
   * This is only applicable when {@link editable} is `false`.
   * @default `false`
   */
  public readonly multiple = input<Multiple>();
  /**
   * Whether to scroll to the selected item when the dropdown is opened.
   * @default `true`
   */
  public readonly scrollToSelectedItemOnOpen = input<boolean | ScrollLogicalPosition>(true);
  /**
   * Tabindex for the select control.
   * @default `0`
   */
  public readonly tabindex = input<number>(0);

  private readonly _listbox = viewChild(NgnListBox);
  private _userChangedEditableInput = false;

  protected readonly filterTextInternal = linkedSignal(this.filterText);
  protected readonly currentHighlightedValue = signal<T[K] | null>(null);
  protected readonly valueStr = computed(() => {
    const v = this.value();
    return typeof v === 'string' ? v : null;
  });
  protected readonly valueArray = computed(() => {
    const v = this.value();
    return Array.isArray(v) ? v : v ? [v] : [];
  });

  protected readonly appliedFilter: Signal<FilterConfig<NgnItem> | boolean> = computed(
    () => this.filter() || this.editable() || false
  );

  private readonly _flatOptions = computed(() => mapToItems(this.options()));

  protected readonly selectedItems = computed(() => {
    if (this.editable()) {
      return [this._flatOptions().find(option => option.label === this.value())];
    } else {
      return this.valueArray().map(value =>
        this._flatOptions().find(option => option.value === value)
      );
    }
  });
  protected readonly selectedItemsValues = computed(() =>
    this.selectedItems().map(item => item?.value)
  );

  constructor() {
    super();
    effect(() => {
      if (this.editable() && this.multiple()) {
        throw new NgnError('select', 'Editable and multiple selection cannot be used together');
      }
      if (this.editable() && this.filter()) {
        throw new NgnError('select', 'Editable and filtering cannot be used together');
      }
    });
    effect(() => {
      this._customEditableSub?.unsubscribe();
      const editable = this.editable();
      const customEditableInput = this._customEditableInput();
      if (!editable || !customEditableInput) {
        return;
      }

      this._customEditableSub = customEditableInput.value.subscribe(value => {
        this.onEditableChange(value);
      });
      // Set ARIA attributes for accessibility
      customEditableInput.element.nativeElement.setAttribute('aria-autocomplete', 'list');
      customEditableInput.element.nativeElement.setAttribute(
        'aria-expanded',
        `${this._popover().open()}`
      );
      customEditableInput.element.nativeElement.setAttribute('aria-haspopup', 'listbox');
      customEditableInput.element.nativeElement.setAttribute(
        'aria-controls',
        `${this.inputId()}_listbox`
      );
    });
    effect(() => {
      if (!this.editable()) {
        return;
      }
      const valueSig = this._customEditableInput()?.value;
      if (valueSig) {
        valueSig.set((this.value() as string) || '');
      }
    });
    effect(() => {
      if (!this.editable()) {
        return;
      }
      const hasOptions = !!this._listbox()?.displayedItems().length;
      if (!this._userChangedEditableInput) {
        return;
      }
      this._userChangedEditableInput = false;
      if (hasOptions) {
        this.show();
      } else {
        this.hide();
      }
    });
  }

  protected onKeyDown(event: KeyboardEvent) {
    this._listbox()?.onKeyDown(event);
    // if event is not handled by the listbox, we can handle it here
    if (!event.defaultPrevented) {
      if (event.key === 'Enter') {
        this._popover().toggle();
        event.stopPropagation();
        event.preventDefault();
      }
    }
  }

  protected onPopoverClosed() {
    this.currentHighlightedValue.set(null);
    const filter = this.filter();
    if (filter === true || (typeof filter === 'object' && filter.clearFilterOnClose)) {
      if (!this.editable()) {
        this.filterTextInternal.set('');
      }
    }
  }

  protected onSelect(value: ValueType<T, K, false, Multiple> | null) {
    if (this.editable()) {
      const item = this._flatOptions().find(option => option.value === value);
      if (item) {
        this.value.set(item.label as ValueType<T, K, Editable, Multiple>);
      }
    } else {
      const v = value as ValueType<T, K, Editable, Multiple>;
      if (this.value() !== v) {
        this.value.set(v);
      }
    }
    if (!this.multiple()) {
      this.hide();
    }
  }

  /**
   * Shows the select dropdown.
   */
  public show() {
    this._popover().show();
  }

  /**
   * Hides the select dropdown.
   */
  public hide() {
    this._popover().hide();
  }

  protected onEditableChange(value: string | null) {
    if (this.editable()) {
      this.value.set(value as ValueType<T, K, Editable, Multiple>);
      this._userChangedEditableInput = true;
      if (this.editableAutoFilter()) {
        this.filterTextInternal.set(value);
      }
    }
  }
}
