import { Component } from '@angular/core';
import { injectThemeControlKinds } from '@ngneers/controls/api/ng';
import { NgnButton } from '@ngneers/controls/button';

@Component({
  selector: 'ngn-demo-button-disabled',
  imports: [NgnButton],
  template: `
    <div class="flex flex-col gap-2">
      @for (kind of kinds(); track $index) {
        <div class="flex flex-wrap items-center gap-2">
          <button ngnButton [kind]="kind">
            {{ kind === 'icon' ? '👽' : kind }}
          </button>
          <button ngnButton [kind]="kind" disabled>
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
