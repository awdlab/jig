import { Component } from '@angular/core';
import { injectThemeControlKinds } from '@awdlab/jig/api/ng';
import { JigHint } from '@awdlab/jig/hint';

@Component({
  imports: [JigHint],
  selector: 'jig-demo-hint-base',
  template: `
    <div class="flex flex-col gap-2">
      @for (kind of kinds(); track $index) {
        <jig-hint [kind]="kind">{{ kind ?? 'default' }} hint text</jig-hint>
      }
    </div>
  `,
})
export class Demo_Hint_Base {
  protected readonly kinds = injectThemeControlKinds('hint');
}
