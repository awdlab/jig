import { Component, input, signal, type Signal } from '@angular/core';
import { FormField, form, required, type FieldTree } from '@angular/forms/signals';
import { JigErrors } from '@awdlab/jig/errors';
import { JigHint } from '@awdlab/jig/hint';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigTagInput, tagCount, tagLength, type TagBounds } from '@awdlab/jig/tag-input';

/**
 * Bounds that read their signals on access. The form is built in a field
 * initializer, where the inputs are not resolved yet; both validators read
 * `bounds` when they run, by which time they are.
 */
function liveBounds(min: Signal<number | undefined>, max: Signal<number | undefined>): TagBounds {
  return {
    get min() {
      return min();
    },
    get max() {
      return max();
    },
  };
}

/**
 * A signal form over a tag input, so the `tagCount` and `tagLength` validators
 * can be driven from an end-to-end test.
 */
@Component({
  selector: 'tag-form',
  imports: [JigTagInput, JigInputField, JigHint, JigErrors, FormField],
  template: `
    <jig-input-field class="page-center" style="width: 24rem" [label]="'Labels'" inputId="tags">
      <jig-tag-input
        inputId="tags"
        delimiters=","
        [formField]="signalForm.tags"
        jigErrors
        jigErrorsShowOn="always"
        [jigErrorsHint]="hint"
      />
    </jig-input-field>
    <jig-hint #hint />
  `,
})
export class TagForm {
  public readonly countMin = input<number | undefined>(undefined);
  public readonly countMax = input<number | undefined>(undefined);
  public readonly lengthMin = input<number | undefined>(undefined);
  public readonly lengthMax = input<number | undefined>(undefined);

  protected readonly model = signal<{ tags: string[] | null }>({ tags: null });

  protected readonly signalForm: FieldTree<{ tags: string[] | null }> = form(this.model, path => {
    required(path.tags);
    tagCount(path.tags, liveBounds(this.countMin, this.countMax));
    tagLength(path.tags, liveBounds(this.lengthMin, this.lengthMax));
  });
}
