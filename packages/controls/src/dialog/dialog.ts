import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  model,
  untracked,
  viewChild,
} from '@angular/core';
import { injectThemeTemplate, NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnButton } from '@ngneers/controls/button';
import { NgnDefer } from '@ngneers/controls/defer';
import { NgnIcon } from '@ngneers/controls/icon';
import { generateElementId } from '@ngneers/controls/utils-ng';
import { dialogControlTemplate } from '@ngneers/controls-themes/templates/dialog';

import { DialogTemplates } from './dialog-templates';
import { DialogSize } from './types';

/**
 * @category control
 */
@Component({
  selector: 'ngn-dialog',
  imports: [NgTemplateOutlet, NgnTemplate, NgnDefer, NgClass, NgnButton, NgnIcon],
  templateUrl: './dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgnDialog extends DialogTemplates {
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
  public readonly title = input<string | null>(null);
  /**
   * Determines how the dialog can be closed by the user.
   * - `'any'` - The dialog can be closed by clicking outside the dialog or pressing the Escape key.
   * - `'escape'` - The dialog can only be closed by pressing the Escape key.
   * - `'none'` - The dialog cannot be closed by user interaction. It can only be closed programmatically.
   * @default 'any'
   */
  public readonly closeBy = input<'any' | 'escape' | 'none'>('any');
  /**
   * The size of the dialog. You can set any CSS size value (e.g. `300px`, `50%`, `auto`, `min-content`, etc.) for each property.
   */
  public readonly size = input<DialogSize>({});

  protected readonly closedBy = computed(() => {
    switch (this.closeBy()) {
      case 'any':
        return 'any';
      case 'escape':
        return 'closerequest';
      case 'none':
        return 'none';
    }
  });

  constructor() {
    super();
    afterRenderEffect(() => {
      if (this.open()) {
        if (untracked(this.modal)) {
          this._dialogElement().nativeElement.showModal();
        } else {
          this._dialogElement().nativeElement.show();
        }
      } else {
        this._dialogElement().nativeElement.close();
      }
    });
  }

  protected onCancel() {
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
