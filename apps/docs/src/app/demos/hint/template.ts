import { Component } from '@angular/core';
import { AwdHint } from '@awdlab/jig/hint';

@Component({
  imports: [AwdHint],
  selector: 'jig-demo-hint-template',
  template: `
    <jig-hint kind="info">
      <ng-template #content>
        Password must contain at least <strong>8 characters</strong>.
      </ng-template>
    </jig-hint>
  `,
})
export class Demo_Hint_Template {}
