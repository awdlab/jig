import { booleanAttribute, Component, input, model, inject } from '@angular/core';
import { NgnTemplate } from '@awdlab/jig/api/ng';
import { NgnPt, provideSelf } from '@awdlab/jig/base';
import { NgnButton } from '@awdlab/jig/button';
import { NgnAutofocus } from '@awdlab/jig/directives';
import { I18n } from '@awdlab/jig/i18n';
import { NgnIcon } from '@awdlab/jig/icon';
import { NgnInplace } from '@awdlab/jig/inplace';
import { NgnInput } from '@awdlab/jig/input';
import { NgnInputField } from '@awdlab/jig/input-field';
import { editInplaceControlTemplate } from '@awdlab/jig-themes/templates/edit-inplace';

import { EditInplaceTemplates } from './edit-inplace-templates';

/**
 * @category control
 */
@Component({
  selector: 'awd-edit-inplace',
  templateUrl: './edit-inplace.html',
  imports: [
    NgnPt,
    NgnInplace,
    NgnTemplate,
    NgnInput,
    NgnAutofocus,
    NgnButton,
    NgnIcon,
    NgnInputField,
  ],
  providers: [provideSelf(NgnEditInplace)],
})
export class NgnEditInplace extends EditInplaceTemplates {
  protected readonly theme = this.injectThemeTemplate(editInplaceControlTemplate, {
    root: true,
    invalid: () => this.invalidState(),
    readonly: this.readonly,
    disabled: this.disabled,
  });
  protected readonly i18n = inject(I18n).translations;

  protected readonly closeContent = this.switchToDisplay.bind(this);

  /**
   * Closes the edit view from a user confirm (Enter / confirm button). Marks the
   * control touched first, so `ngnErrorsShowOn="touched"` reveals errors after an
   * inline confirm — not just after blurring out of the control (see {@link focusOut}).
   */
  protected readonly confirmEdit = (): void => {
    this.markTouched();
    this.switchToDisplay();
  };

  /**
   * Controls the visibility of the content.
   */
  public readonly editVisible = model<boolean>(false);
  /**
   * Whether the content is loaded lazily.
   * @default true
   */
  public readonly lazy = input(true, { transform: booleanAttribute });
  /**
   * Whether the content is cached when closed.
   * @default false
   */
  public readonly cache = input(false, { transform: booleanAttribute });

  /**
   * Switches to the edit view.
   */
  public switchToEdit() {
    this.editVisible.set(true);
  }

  /**
   * Switches to the display view.
   */
  public switchToDisplay() {
    this.editVisible.set(false);
  }

  /**
   * Toggles between the display and content views.
   */
  public toggle() {
    this.editVisible.update(v => !v);
  }

  protected focusOut(event: FocusEvent) {
    if (!this.editVisible()) {
      return;
    }
    if (
      event.relatedTarget instanceof HTMLElement &&
      this.element.nativeElement.contains(event.relatedTarget as HTMLElement)
    ) {
      return;
    }
    this.markTouched();
    this.switchToDisplay();
  }
}
