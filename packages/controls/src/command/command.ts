import {
  afterRenderEffect,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { AwdPt, provideSelf } from '@awdlab/jig/base';
import { AwdDialog } from '@awdlab/jig/dialog';
import { AwdIcon } from '@awdlab/jig/icon';
import { I18n } from '@awdlab/jig/i18n';
import { AwdInput } from '@awdlab/jig/input';
import { AwdInputField } from '@awdlab/jig/input-field';
import { AwdKbd, AwdKeyboardShortcut, type AwdShortcutBinding } from '@awdlab/jig/kbd';
import { AwdListBox } from '@awdlab/jig/list-box';
import { AwdTemplate } from '@awdlab/jig/api/ng';
import { maybeCallback } from '@awdlab/jig/utils';
import { generateElementId } from '@awdlab/jig/utils-ng';
import { commandControlTemplate } from '@awdlab/jig-themes/templates/command';

import { type CommandItem, CommandTemplates } from './command-templates';

import type { FilterConfig, JigActionItem } from '@awdlab/jig/api';
import type { CloseBy } from '@awdlab/jig/api/ng';
import type { DialogSize } from '@awdlab/jig/dialog';
import type { IconType } from '@awdlab/jig-custom-types';

/** Keys handed to the list box; the search field keeps everything else. */
const FORWARDED_KEYS = ['ArrowDown', 'ArrowUp', 'Home', 'End', 'PageDown', 'PageUp', 'Enter'];

function toCommandItem(item: JigActionItem): CommandItem {
  return {
    label: item.label,
    value: item.id,
    icon: item.icon,
    disabled: item.disabled,
    testId: item.testId,
    data: item,
    ...(item.children?.length ? { items: item.children.map(toCommandItem) } : {}),
  };
}

function collectById(items: readonly JigActionItem[], into: Map<string, JigActionItem>) {
  for (const item of items) {
    into.set(item.id, item);
    if (item.children?.length) {
      collectById(item.children, into);
    }
  }
  return into;
}

/**
 * @category control
 */
@Component({
  selector: 'jig-command',
  templateUrl: './command.html',
  imports: [
    AwdPt,
    AwdDialog,
    AwdListBox,
    AwdInput,
    AwdInputField,
    AwdIcon,
    AwdTemplate,
    AwdKbd,
    AwdKeyboardShortcut,
  ],
  providers: [provideSelf(AwdCommand)],
})
export class AwdCommand extends CommandTemplates {
  protected readonly theme = this.injectThemeTemplate(commandControlTemplate, 'root');
  protected readonly i18n = inject(I18n).translations;
  private readonly _router = inject(Router, { optional: true });
  private readonly _listBox = viewChild<AwdListBox<CommandItem[], false>>(AwdListBox);
  private readonly _searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  protected readonly listBoxId = generateElementId();
  protected readonly maybeCallback = maybeCallback;

  /**
   * The current search text. Bind two-way to source {@link items} from the query
   * yourself — set {@link filter} to `false` so the already-matched items are not
   * filtered a second time. Cleared whenever the palette opens.
   */
  public readonly filterText = model('');

  /**
   * The commands to offer. A top-level entry with `children` renders as a labelled
   * group; leaf entries are the runnable commands.
   */
  public readonly items = input.required<readonly JigActionItem[]>();
  /**
   * Shows or hides the palette. Bind two-way, or use {@link show} / {@link hide} / {@link toggle}.
   * @default false
   */
  public readonly open = model(false);
  /**
   * Placeholder for the search field.
   * @default the `command_placeholder` translation
   */
  public readonly placeholder = input<string>();
  /**
   * Accessible name for the palette dialog.
   * @default the `command_label` translation
   */
  public readonly label = input<string>();
  /**
   * A `FilterConfig` customizing how the search matches (e.g. other fields or a
   * different matching strategy). Matches item labels case-insensitively per word
   * by default; the search field itself is always shown.
   * @default true
   */
  public readonly filter = input<FilterConfig<CommandItem> | boolean>(true);
  /**
   * The icon shown in the search field.
   */
  public readonly iconSearch = input<IconType>();
  /**
   * Size of the palette dialog.
   * @default { width: '560px', maxWidth: '90vw', maxHeight: '60vh' }
   */
  public readonly size = input<DialogSize>({
    width: '560px',
    maxWidth: '90vw',
    maxHeight: '60vh',
  });
  /**
   * Determines how the palette can be dismissed. See {@link AwdDialog.closeBy}.
   * @default 'any'
   */
  public readonly closeBy = input<CloseBy>('any');

  /**
   * Emitted when a command is picked, carrying the original item. The item's
   * `callback` has already run and its `route` has already been navigated.
   */
  public readonly commandSelected = output<JigActionItem>();

  protected readonly placeholderText = computed(
    () => this.placeholder() ?? this.i18n['command_placeholder']()
  );
  protected readonly labelText = computed(() => this.label() ?? this.i18n['command_label']());
  protected readonly mappedItems = computed(() => this.items().map(toCommandItem));
  protected readonly activeDescendantId = computed(
    () => this._listBox()?.highlightedOptionId() ?? null
  );

  private readonly _itemsById = computed(() => collectById(this.items(), new Map()));

  /** Bindings for every command that configured a shortcut, live page-wide whether the palette is open or not. */
  protected readonly shortcutBindings = computed<AwdShortcutBinding[]>(() =>
    [...this._itemsById().values()].flatMap(item =>
      item.shortcut && !item.children?.length
        ? [
            {
              shortcut: item.shortcut,
              callback: () => this.onItemClicked(item.id),
              disabled: item.disabled,
              global: true,
            },
          ]
        : []
    )
  );

  constructor() {
    super();
    // reset on open, not on close — the closing palette keeps its filtered view through the fade-out
    effect(() => {
      if (this.open()) {
        this.filterText.set('');
        this._listBox()?.currentHighlightedValue.set(null);
        this._listBox()?.value.set(null);
      }
    });
    // the first match carries the highlight, so Enter runs it and a filtered-out highlight never lingers
    effect(() => {
      const listBox = this._listBox();
      if (!listBox || !this.open()) {
        return;
      }
      const first = listBox.displayedItems().find(item => !item.items && !item.disabled);
      listBox.currentHighlightedValue.set(first?.value ?? null);
    });
    // the read phase runs after the dialog's own render effect has shown it, so the
    // field is focusable by the time we reach for it — on every opening
    afterRenderEffect({
      read: () => {
        if (this.open()) {
          this._searchInput()?.nativeElement.focus();
        }
      },
    });
  }

  /**
   * Opens the palette. Alternatively set the `open` input to `true`.
   */
  public show(): void {
    this.open.set(true);
  }
  public hide(): void {
    this.open.set(false);
  }
  public toggle(): void {
    this.open.update(open => !open);
  }

  protected onKeyDown(event: KeyboardEvent) {
    // the search field owns Space as text; the list box itself leaves Home/End to the caret
    if (FORWARDED_KEYS.includes(event.key)) {
      this._listBox()?.onKeyDown(event);
    }
  }

  protected onItemClicked(value: string) {
    const item = this._itemsById().get(value);
    if (!item) {
      return;
    }
    item.callback?.();
    if (item.route) {
      void this._router?.navigate(Array.isArray(item.route) ? item.route : [item.route]);
    }
    this.commandSelected.emit(item);
    this.open.set(false);
  }
}
