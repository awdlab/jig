import { Component } from '@angular/core';
import { NgnHint } from '@awdlab/jig/hint';

@Component({
  imports: [NgnHint],
  selector: 'awd-demo-hint-template',
  template: `
    <awd-hint kind="info">
      <ng-template #content>
        Password must contain at least <strong>8 characters</strong>.
      </ng-template>
    </awd-hint>
  `,
})
export class Demo_Hint_Template {}
