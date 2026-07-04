import { Component } from '@angular/core';
import { injectThemeControlKinds } from '@ngneers/controls/api/ng';
import { NgnHint } from '@ngneers/controls/hint';

@Component({
  imports: [NgnHint],
  selector: 'ngn-demo-hint-base',
  template: `
    <div class="flex flex-col gap-2">
      @for (kind of kinds(); track $index) {
        <ngn-hint [kind]="kind">{{ kind ?? 'default' }} hint text</ngn-hint>
      }
    </div>
  `,
})
export class Demo_Hint_Base {
  protected readonly kinds = injectThemeControlKinds('hint');
}
