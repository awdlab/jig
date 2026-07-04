import { Component } from '@angular/core';
import { NgnHint } from '@ngneers/controls/hint';

@Component({
  imports: [NgnHint],
  selector: 'ngn-demo-hint-template',
  template: `
    <ngn-hint kind="info">
      <ng-template #content>
        Password must contain at least <strong>8 characters</strong>.
      </ng-template>
    </ngn-hint>
  `,
})
export class Demo_Hint_Template {}
