import { Component, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { JigErrors } from '@awdlab/jig/errors';
import { JigHint } from '@awdlab/jig/hint';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigTagInput, tagCount, tagLength } from '@awdlab/jig/tag-input';

@Component({
  selector: 'jig-demo-tag-input-validation',
  imports: [FormField, JigErrors, JigHint, JigInputField, JigTagInput],
  template: `
    <jig-input-field [label]="'Labels'" [labelKind]="'on'" inputId="tag-validation">
      <jig-tag-input
        inputId="tag-validation"
        [formField]="labelForm.tags"
        [delimiters]="','"
        [minTagLength]="2"
        [maxTagLength]="12"
        [maxTags]="4"
        jigErrors
        jigErrorsShowOn="always"
        [jigErrorsHint]="hint"
      />
    </jig-input-field>
    <jig-hint #hint />
  `,
  host: { class: 'w-72' },
})
export class Demo_TagInput_Validation {
  protected readonly model = signal<{ tags: string[] | null }>({ tags: null });
  /**
   * `required` fires because an empty tag input's value is `null`, and the count
   * uses `tagCount` rather than `minLength`, which cannot type-check against a
   * nullable array. Neither needs a message override — both resolve from the
   * control's own translations.
   */
  protected readonly labelForm = form(this.model, path => {
    required(path.tags);
    tagCount(path.tags, { min: 2, max: 4 });
    tagLength(path.tags, { min: 2, max: 12 });
  });
}
