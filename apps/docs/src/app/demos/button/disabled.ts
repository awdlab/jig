import { Component } from '@angular/core';
import { injectThemeControlKinds } from '@awdlab/jig/api/ng';
import { JigButton } from '@awdlab/jig/button';

@Component({
  selector: 'jig-demo-button-disabled',
  imports: [JigButton],
  template: `
    <div class="flex flex-col gap-2">
      @for (kind of kinds(); track $index) {
        <div class="flex flex-wrap items-center gap-2">
          <button jigButton [kind]="kind">
            {{ kind === 'icon' ? '👽' : kind }}
          </button>
          <button jigButton [kind]="kind" disabled>
            {{ kind === 'icon' ? '👽' : kind }}
          </button>
        </div>
      }
    </div>
  `,
})
export class Demo_Button_Disabled {
  protected readonly kinds = injectThemeControlKinds('button');
}
