import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  output,
  signal,
  TemplateRef,
  Type,
  untracked,
  viewChild,
} from '@angular/core';
import {
  type CloseBy,
  toModalCloseBy,
  toPopoverCloseBy,
  JigTemplate,
  type Openable,
} from '@awdlab/jig/api/ng';
import { JigPt, provideSelf } from '@awdlab/jig/base';
import { JigActionButton, JigButton } from '@awdlab/jig/button';
import { JigDefer } from '@awdlab/jig/defer';
import { JigMovable, JigResizable } from '@awdlab/jig/directives';
import { I18n } from '@awdlab/jig/i18n';
import { JigIcon } from '@awdlab/jig/icon';
import { JigKeyboardShortcut } from '@awdlab/jig/kbd';
import { generateElementId } from '@awdlab/jig/utils-ng';
import { dialogControlTemplate } from '@awdlab/jig-themes/templates/dialog';

import { DialogTemplates } from './dialog-templates';
import { PromptDialogBase } from './prompt-dialog-base';

import type { DialogSize } from './types';
import type { JigActionButtonConfig } from '@awdlab/jig/api';

type TypedContent = {
  template?: TemplateRef<unknown>;
  string?: string;
  component?: Type<unknown>;
};

/**
 * @category control
 */
@Component({
  selector: 'jig-dialog',
  imports: [
    NgTemplateOutlet,
    JigTemplate,
    JigMovable,
    JigDefer,
    JigPt,
    JigButton,
    JigActionButton,
    NgComponentOutlet,
    JigIcon,
    JigResizable,
    JigKeyboardShortcut,
  ],
  templateUrl: './dialog.html',

  providers: [provideSelf(JigDialog)],
})
export class JigDialog<
  T,
  Buttons extends JigActionButtonConfig<T extends PromptDialogBase<any, infer B> ? B : unknown>[],
>
  extends DialogTemplates<T>
  implements Openable
{
  protected readonly theme = this.injectThemeTemplate(dialogControlTemplate, 'root');
  protected readonly i18n = inject(I18n).translations;
  protected readonly headerId = generateElementId();

  private readonly _dialogElement = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  protected readonly headerElement = viewChild<ElementRef<HTMLElement>>('header');
  /**
   * Shows or hides the dialog.
   *
   * You probably want to react to openChange events from outside to update your variable accordingly.
   * @default true
   */
  public readonly open = model(true);
  /**
   * When `true`, the content will be loaded lazily when the dialog is opened for the first time.
   * Only applies when using a template for the content.
   * @default false
   */
  public readonly lazy = input(false, { transform: booleanAttribute });
  /**
   * When {@link lazy} is `true`, setting this to `true` will cache the content after the first load.
   * @default false
   */
  public readonly cache = input(false, { transform: booleanAttribute });
  /**
   * When `true`, the dialog will be shown as a modal dialog making the background content non-interactable.
   * @default false
   */
  public readonly modal = input(false, { transform: booleanAttribute });
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
   * Whether the close (X) button is rendered in the header.
   * Set to `false` for chromeless dialogs — with no title and no header template
   * the header is then dropped entirely.
   * @default true
   */
  public readonly closeButton = input(true, { transform: booleanAttribute });
  /**
   * Accessible name for the dialog. Use it when the dialog has no visible title,
   * for example a chromeless dialog. Ignored when {@link title} is set.
   */
  public readonly label = input<string>();
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
   * @default false
   */
  public readonly movable = input<boolean | null | undefined | ''>(false);
  /**
   * Whether the dialog is resizable.
   * @default false
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

  /**
   * Emits when a prompt dialog resolves. Carries the value produced by the prompt content
   * and the {@link footerButtons} value that triggered it, or `null` for both when cancelled.
   */
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
  protected readonly showHeader = computed(
    () => this.hasHeaderTemplate() || !!this.title() || this.closeButton()
  );
  protected readonly showFooter = computed(
    () => this.hasFooterTemplate() || !!this.footerButtons()?.length
  );
  /**
   * Only reference the header id when something actually renders it, so the dialog
   * never points `aria-labelledby` at a missing element.
   */
  protected readonly labelledBy = computed(() =>
    this.title() || this.hasHeaderTemplate() ? this.headerId : null
  );
  protected readonly ariaLabel = computed(() =>
    this.labelledBy() ? null : (this.label() ?? null)
  );
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
   * Backdrop taps of a modal dialog. Safari has no `closedby` support, so the light dismiss has to
   * be done here, and the gesture must never reach the page behind: the browser hit-tests the
   * synthesized click after the dialog has already left the top layer.
   */
  protected onBackdropPointer(event: MouseEvent | TouchEvent): void {
    const element = this._dialogElement().nativeElement;
    if (!this.modal() || event.target !== element) {
      return;
    }
    const point = 'changedTouches' in event ? event.changedTouches[0] : event;
    const rect = element.getBoundingClientRect();
    if (
      !point ||
      (point.clientX >= rect.left &&
        point.clientX <= rect.right &&
        point.clientY >= rect.top &&
        point.clientY <= rect.bottom)
    ) {
      return;
    }
    event.preventDefault();
    if (this.closeBy() === 'any') {
      this.onCancel();
    }
  }

  /**
   * Different cancel handlers for different event types. Required for modal and popover dialogs.
   */
  protected onCancel(event?: ToggleEvent | KeyboardEvent): void {
    if (event instanceof KeyboardEvent) {
      // Modal dialogs handle Escape via the native (cancel) event
      if (this.modal()) {
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
    const wasOpen = this.open();
    requestAnimationFrame(() => {
      // Reopened while the close was deferred — discard the stale close.
      if (!wasOpen && this.open()) {
        return;
      }
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
  public hide(): void {
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
