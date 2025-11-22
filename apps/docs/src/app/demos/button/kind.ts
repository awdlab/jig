import { Component, ChangeDetectionStrategy } from '@angular/core';
import { injectThemeControlKinds } from '@ngneers/controls/api/ng';
import { NgnButton } from '@ngneers/controls/button';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-button-kind',
  imports: [NgnButton],
  template: `
    <div class="flex gap-2 flex-wrap items-center">
      @for (kind of kinds; track $index) {
        <button ngnButton [kind]="kind">{{ kind === 'icon' ? '👽' : kind }}</button>
      }
    </div>
  `,
})
export class Demo_Button_Kind {
  protected readonly kinds = injectThemeControlKinds('button');
}
