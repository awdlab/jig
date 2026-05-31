import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  contentChild,
  effect,
  ElementRef,
  input,
  linkedSignal,
  type OutputRefSubscription,
  type Signal,
  signal,
  viewChild,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { type FilterConfig, mapToItems, type NgnItem } from '@ngneers/controls/api';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnPt, provideSelf } from '@ngneers/controls/base';
import { I18n } from '@ngneers/controls/i18n';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnItemView } from '@ngneers/controls/item-view';
import { NgnListBox } from '@ngneers/controls/list-box';
import { NgnPopover, type PopoverOptions } from '@ngneers/controls/popover';
import { deepMerge, maybeCallback, NgnError } from '@ngneers/controls/utils';
import { selectControlTemplate } from '@ngneers/controls-themes/templates/select';

import { SelectTemplates, type ValueType } from './select-templates';

import type { SelectFilterOptions } from './types';
import type { IconType } from '@ngneers/controls-custom-types';

/**
 * @category control
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-select',
  templateUrl: './select.html',
  imports: [
    NgnPt,
    NgnListBox,
    NgnPopover,
    NgnInput,
    NgnInputField,
    NgTemplateOutlet,
    NgnTemplate,
    NgnItemView,
    NgnIcon,
  ],
  providers: [provideSelf(NgnSelect)],
  host: {
    style: 'display: block;',
  },
})
export class NgnSelect<
  V,
  Editable extends boolean = false,
  Multiple extends boolean = false,
> extends SelectTemplates<V, Editable, Multiple> {
  protected readonly theme = this.injectThemeTemplate(selectControlTemplate, 'root');
  protected readonly i18n = inject(I18n).translations;
  private readonly _popover = viewChild.required<NgnPopover>(NgnPopover);
  private readonly _field = viewChild.required<ElementRef<HTMLElement>>('field');
  private readonly _customEditableInput = contentChild(NgnInput);
  private _customEditableSub?: OutputRefSubscription;

  /**
   * Options for the popover.
   */
  public readonly popoverOptions = input<PopoverOptions>({});
  protected readonly appliedPopoverOptions = computed<PopoverOptions>(() =>
    deepMerge<PopoverOptions, PopoverOptions>(
      {
        sizeConstraints: {
          width: 1,
          maxWidth: 1,
          minHeight: '250px',
          maxHeight: '700px',
        },
        cache: true,
      },
      this.popoverOptions()
    )
  );
  /**
   * The available options to choose from. They can either be
   * * A list of {@link NgnItem} objects
   * * A list of plain objects. You'll have to provide a {@link fields} input to specify how to map the plain objects to {@link NgnItem} objects.
   */
  public readonly options = input<readonly NgnItem<unknown, V>[]>([]);
  /**
   * Accepts a boolean value that determines whether the filter is enabled.
   * Alternatively, you can provide `SelectFilterOptions` to customize the filter behavior.
   * @default `false`
   */
  public readonly filter = input<SelectFilterOptions<NgnItem<unknown, V>> | boolean>(false);
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
  /**
   * Whether to use a checkbox to indicate selection state.
   *
   * This option is true per default when {@link multiple} is `true`.
   * @default multiple()
   */
  public readonly checkbox = input<boolean>();

  protected readonly maybeCallback = maybeCallback;

  private readonly _listbox = viewChild(NgnListBox);
  private _userChangedEditableInput = false;
  protected get anchorElement(): HTMLElement {
    return (
      (this.element.nativeElement.closest('ngn-input-field') as HTMLElement | null) ??
      this.element.nativeElement
    );
  }

  protected readonly filterTextInternal = linkedSignal(this.filterText);
  protected readonly currentHighlightedValue = signal<V | null>(null);
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
    if (this._popover().open()) {
      this._listbox()?.onKeyDown(event);
    }
    // if event is not handled by the listbox, we can handle it here
    if (!event.defaultPrevented) {
      if (event.key === 'Enter') {
        if (this.readonly() || this.disabled()) {
          return;
        }
        this._popover().toggle();
        event.stopPropagation();
        event.preventDefault();
      }
      if (this._popover().open() && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
        if (this.readonly() || this.disabled()) {
          return;
        }
        const currentIndex = this.options().findIndex(option => option.value === this.value());
        let newIndex = event.key === 'ArrowDown' ? currentIndex + 1 : currentIndex - 1;
        if (newIndex < 0) {
          newIndex = 0;
        }
        if (newIndex >= this.options().length) {
          newIndex = this.options().length - 1;
        }
        const newValue = this.options()[newIndex]?.value;
        if (newValue !== undefined) {
          this.onSelect(newValue as ValueType<V, false, Multiple>);
        }
      }
    }
  }

  protected onPopoverClosed() {
    this._listbox()?.currentHighlightedValue.set(null);
    this.potentiallyBlurred();
    this.currentHighlightedValue.set(null);
    const filter = this.filter();
    if (filter === true || (typeof filter === 'object' && filter.clearFilterOnClose)) {
      if (!this.editable()) {
        this.filterTextInternal.set('');
      }
    }
  }

  protected onSelect(value: ValueType<V, false, Multiple> | null) {
    if (this.editable()) {
      const item = this._flatOptions().find(option => option.value === value);
      if (item) {
        this.value.set(maybeCallback(item.label) as ValueType<V, Editable, Multiple>);
      }
    } else {
      const v = value as ValueType<V, Editable, Multiple>;
      if (this.value() !== v) {
        this.value.set(v);
      }
    }
  }

  protected onItemClicked() {
    if (!this.multiple()) {
      this.hide();
    }
  }

  /**
   * Shows the select dropdown.
   */
  public show() {
    if (this.disabled() || this.readonly()) {
      return;
    }
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
      this.value.set(maybeCallback(value) as ValueType<V, Editable, Multiple>);
      this._userChangedEditableInput = true;
      if (this.editableAutoFilter()) {
        this.filterTextInternal.set(value);
      }
    }
  }

  protected potentiallyBlurred() {
    setTimeout(() => {
      if (this.element.nativeElement.contains(document.activeElement) || this._popover().open()) {
        return;
      }
      this.touched.set(true);
    });
  }
}
