import { NgClass, NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  model,
  TemplateRef,
  Type,
  untracked,
  viewChild,
} from '@angular/core';
import { NgnActionButtonConfig } from '@ngneers/controls/api';
import { injectThemeTemplate, NgnMovable, NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnActionButton, NgnButton } from '@ngneers/controls/button';
import { NgnDefer } from '@ngneers/controls/defer';
import { NgnIcon } from '@ngneers/controls/icon';
import { generateElementId } from '@ngneers/controls/utils-ng';
import { dialogControlTemplate } from '@ngneers/controls-themes/templates/dialog';

import { DialogTemplates } from './dialog-templates';
import { DialogCloseBy, DialogSize } from './types';

type TypedContent = {
  template?: TemplateRef<unknown>;
  string?: string;
  component?: Type<unknown>;
};

/**
 * @category control
 */
@Component({
  selector: 'ngn-dialog',
  imports: [
    NgTemplateOutlet,
    NgnTemplate,
    NgnMovable,
    NgnDefer,
    NgClass,
    NgnButton,
    NgnActionButton,
    NgComponentOutlet,
    NgnIcon,
  ],
  templateUrl: './dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgnDialog<T> extends DialogTemplates<T> {
  protected readonly theme = injectThemeTemplate(dialogControlTemplate);
  protected readonly headerId = generateElementId();

  private readonly _dialogElement = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  /**
   * Shows or hides the dialog.
   */
  public readonly open = model(true);
  /**
   * When `true`, the content will be loaded lazily when the dialog is opened for the first time.
   * Only applies when using a template for the content.
   */
  public readonly lazy = input(false);
  /**
   * When {@link lazy} is `true`, setting this to `true` will cache the content after the first load.
   */
  public readonly cache = input(false);
  /**
   * When `true`, the dialog will be shown as a modal dialog making the background content non-interactable.
   * @default false
   */
  public readonly modal = input(false);
  /**
   * When `true`, the dialog will automatically receive focus when opened.
   * @default modal()
   */
  public readonly autofocus = input(this.modal());
  /**
   * The title of the dialog. Displayed in the default header template.
   */
  public readonly title = input<string | null | undefined>(null);
  /**
   * Determines how the dialog can be closed by the user.
   * - `'any'` - The dialog can be closed by clicking outside the dialog or pressing the Escape key.
   * - `'escape'` - The dialog can only be closed by pressing the Escape key.
   * - `'none'` - The dialog cannot be closed by user interaction. It can only be closed programmatically.
   * @default 'any'
   */
  public readonly closeBy = input<DialogCloseBy>('any');
  /**
   * The size of the dialog. You can set any CSS size value (e.g. `300px`, `50%`, `auto`, `min-content`, etc.) for each property.
   */
  public readonly size = input<DialogSize>({});
  /**
   * Action buttons to be displayed in the footer of the dialog.
   */
  public readonly footerButtons = input<NgnActionButtonConfig[]>([]);
  /**
   * Action buttons to be displayed in the footer of the dialog.
   */
  public readonly movable = input<boolean | null | undefined | ''>(false);

  /**
   * How a modal dialog can be closed by the user.
   */
  protected readonly modalClosedBy = computed(() => {
    switch (this.closeBy()) {
      case 'any':
        return 'any';
      case 'escape':
        return 'closerequest';
      case 'none':
        return 'none';
    }
  });
  /**
   * How a popover dialog can be closed by the user.
   */
  protected readonly popoverClosedBy = computed(() => {
    switch (this.closeBy()) {
      case 'any':
        return 'auto';
      case 'escape':
        return 'manual';
      case 'none':
        return 'manual';
    }
  });

  protected readonly typedContent = computed<TypedContent>(() => {
    const content = this.contentTemplate();
    if (!content) {
      return {};
    }
    if (typeof content === 'string') {
      return { string: content };
    } else if (content instanceof TemplateRef) {
      return { template: content };
    } else {
      return { component: content };
    }
  });

  constructor() {
    super();
    afterRenderEffect(() => {
      if (this.open()) {
        if (untracked(this.modal)) {
          this._dialogElement().nativeElement.showModal();
        } else {
          this._dialogElement().nativeElement.showPopover();
        }
      } else {
        this._dialogElement().nativeElement.close();
        this._dialogElement().nativeElement.hidePopover();
      }
    });
  }

  /**
   * Different cancel handlers for different event types. Required for modal and popover dialogs.
   */
  protected onCancel(event?: ToggleEvent | KeyboardEvent): void {
    if (event instanceof KeyboardEvent) {
      // Modal dialogs handle this on their own
      if (this.modal()) {
        return;
      }
      if (event.key !== 'Escape' || (event.target as HTMLElement).tagName !== 'DIALOG') {
        // TODO: limitation: when focus is inside a different element, we cannot know if it is safe to close, so we skip it
        return;
      }
      if (this.closeBy() === 'escape') {
        this.open.set(false);
      }
      return;
    }

    if (event instanceof ToggleEvent && event.newState !== 'closed') {
      // This is also just for popover dialogs
      return;
    }
    /**
     * In case the dialog is closed with the same click event that tries to open it again immediately,
     * we need to wait for the next animation frame to avoid a stuck state where the outside thinks it's opened
     * but inside `open` is set to false.
     */
    requestAnimationFrame(() => {
      this.open.set(false);
    });
  }
}
