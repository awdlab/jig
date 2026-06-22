import { booleanAttribute, Component, input, model, inject } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnPt, provideSelf } from '@ngneers/controls/base';
import { NgnButton } from '@ngneers/controls/button';
import { NgnAutofocus } from '@ngneers/controls/directives';
import { I18n } from '@ngneers/controls/i18n';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnInplace } from '@ngneers/controls/inplace';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';
import { editInplaceControlTemplate } from '@ngneers/controls-themes/templates/edit-inplace';

import { EditInplaceTemplates } from './edit-inplace-templates';

/**
 * @category control
 */
@Component({
  selector: 'ngn-edit-inplace',
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
    invalid: this.invalid(),
    readonly: this.readonly(),
    disabled: this.disabled(),
  });
  protected readonly i18n = inject(I18n).translations;

  protected readonly closeContent = this.switchToDisplay.bind(this);

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
    this.switchToDisplay();
  }
}
