import { NgClass, NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  model,
  output,
  signal,
  TemplateRef,
  Type,
  untracked,
  viewChild,
} from '@angular/core';
import { NgnActionButtonConfig } from '@ngneers/controls/api';
import {
  CloseBy,
  toModalCloseBy,
  toPopoverCloseBy,
  NgnTemplate,
  Openable,
} from '@ngneers/controls/api/ng';
import { provideSelf } from '@ngneers/controls/base';
import { NgnActionButton, NgnButton } from '@ngneers/controls/button';
import { NgnDefer } from '@ngneers/controls/defer';
import { NgnMovable, NgnResizable } from '@ngneers/controls/directives';
import { NgnIcon } from '@ngneers/controls/icon';
import { generateElementId } from '@ngneers/controls/utils-ng';
import { dialogControlTemplate } from '@ngneers/controls-themes/templates/dialog';

import { DialogTemplates } from './dialog-templates';
import { PromptDialogBase } from './prompt-dialog-base';
import { DialogSize } from './types';

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
    NgnResizable,
  ],
  templateUrl: './dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideSelf(NgnDialog)],
})
export class NgnDialog<T, Buttons extends NgnActionButtonConfig<unknown>[]>
  extends DialogTemplates<T>
  implements Openable
{
  protected readonly theme = this.injectThemeTemplate(dialogControlTemplate);
  protected readonly headerId = generateElementId();

  private readonly _dialogElement = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  /**
   * Shows or hides the dialog.
   *
   * You probably want to react to openChange events from outside to update your variable accordingly.
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
  public readonly closeBy = input<CloseBy>('any');
  /**
   * The size of the dialog. You can set any CSS size value (e.g. `300px`, `50%`, `auto`, `min-content`, etc.) for each property.
   */
  public readonly size = input<DialogSize>({});
  /**
   * Action buttons to be displayed in the footer of the dialog.
   */
  public readonly footerButtons = input<Buttons>();
  /**
   * Whether the dialog is movable by dragging its header.
   */
  public readonly movable = input<boolean | null | undefined | ''>(false);
  /**
   * Whether the dialog is resizable.
   */
  public readonly resizable = input<boolean | null | undefined | ''>(false);
  /**
   * The result of the dialog, which is the `value` of the button that was clicked to close the dialog or null.
   */
  public readonly buttonClicked = output<Buttons[number]['value'] | null>();
  /**
   * Emits when the dialog has fully closed.
   */
  public readonly closed = output();

  public readonly promptResult = output<{
    value: (T extends PromptDialogBase<infer D, Buttons[number]['value']> ? D : never) | null;
    button: Buttons[number]['value'] | null;
  }>();

  private readonly _latestClickedButtonValue = signal<{ button: Buttons[number]['value'] } | null>(
    null
  );

  protected readonly contentComponentInputs = computed(() => {
    const component = this.typedContent().component;
    if (!component || !(component.prototype instanceof PromptDialogBase)) {
      return {};
    }
    const latestButton = this._latestClickedButtonValue();
    if (latestButton === null) {
      return {};
    }
    return {
      ngnPromptDialogResolveFn: {
        button: latestButton.button,
        fn: (result: T extends PromptDialogBase<infer D, Buttons[number]['value']> ? D : never) => {
          this.promptResult.emit({
            value: result,
            button: latestButton.button,
          });
          this._latestClickedButtonValue.set(null);
          this.open.set(false);
        },
      },
    };
  });

  /**
   * How a modal dialog can be closed by the user.
   */
  protected readonly modalClosedBy = computed(() => toModalCloseBy(this.closeBy()));
  /**
   * How a popover dialog can be closed by the user.
   */
  protected readonly popoverClosedBy = computed(() => toPopoverCloseBy(this.closeBy()));
  protected readonly isFullyClosed = signal(true);

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
        this.cancelPrompt();
        this.setStateToClosed();
        return;
      }
      if (event.key !== 'Escape' || (event.target as HTMLElement).tagName !== 'DIALOG') {
        // TODO: limitation: when focus is inside a different element, we cannot know if it is safe to close, so we skip it
        return;
      }
      if (this.closeBy() === 'escape') {
        this.setStateToClosed();
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
      this.setStateToClosed();
    });
  }

  private setStateToClosed() {
    this.open.set(false);
    this.cancelPrompt();
    requestAnimationFrame(() => {
      const allAnimationsDone = Promise.all(
        this.element.nativeElement.getAnimations().map(x => x.finished)
      );
      allAnimationsDone
        .then(() => {
          this.isFullyClosed.set(true);
          this.closed.emit();
        })
        .catch(() => {
          // ignore cancelled animation
        });
    });
  }

  private cancelPrompt() {
    if (this.contentComponentInputs()) {
      this.promptResult.emit({
        value: null,
        button: null,
      });
      this._latestClickedButtonValue.set(null);
    }
  }

  protected closeWithButton() {
    this.open.set(false);
    this.cancelPrompt();
  }

  /**
   * Opens the dialog. Alternatively, you can also set the `open` input to `true`.
   */
  public show(): void {
    this.open.set(true);
  }
  public close(): void {
    this.open.set(false);
  }
  public toggle(): void {
    this.open.update(open => !open);
  }

  protected singleButtonTypeFix(button: unknown): Buttons[number] {
    return button as Buttons[number];
  }

  protected buttonClick(button: Buttons[number]['value']): void {
    this.buttonClicked.emit(button);
    this._latestClickedButtonValue.set({ button });
  }
}
