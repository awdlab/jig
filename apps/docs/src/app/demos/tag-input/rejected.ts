import { Component } from '@angular/core';
import { JigInputField } from '@awdlab/jig/input-field';
import { injectSnackbarCreator } from '@awdlab/jig/snackbar';
import { JigTagInput } from '@awdlab/jig/tag-input';

import type { TagRejection } from '@awdlab/jig/tag-input';

@Component({
  selector: 'jig-demo-tag-input-rejected',
  imports: [JigInputField, JigTagInput],
  template: `
    <jig-input-field [label]="'Labels'" [labelKind]="'on'" inputId="tag-rejected">
      <jig-tag-input
        inputId="tag-rejected"
        [delimiters]="','"
        [minTagLength]="3"
        [maxTags]="3"
        [value]="['design']"
        (rejected)="onRejected($event)"
      />
    </jig-input-field>
  `,
  host: { class: 'w-72' },
})
export class Demo_TagInput_Rejected {
  private readonly _snackbarCreator = injectSnackbarCreator();

  protected onRejected(rejection: TagRejection): void {
    this._snackbarCreator.show({
      header: 'Tag not added',
      content: `"${rejection.text}" was refused (${rejection.reason}).`,
    });
  }
}
