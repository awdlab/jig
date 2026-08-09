import { Component } from '@angular/core';
import { injectThemeControlKinds } from '@awdlab/jig/api/ng';
import { NgnHint } from '@awdlab/jig/hint';

@Component({
  imports: [NgnHint],
  selector: 'awd-demo-hint-base',
  template: `
    <div class="flex flex-col gap-2">
      @for (kind of kinds(); track $index) {
        <awd-hint [kind]="kind">{{ kind ?? 'default' }} hint text</awd-hint>
      }
    </div>
  `,
})
export class Demo_Hint_Base {
  protected readonly kinds = injectThemeControlKinds('hint');
}
