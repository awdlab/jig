import { Component, ChangeDetectionStrategy } from '@angular/core';
import { injectThemeColors, injectThemeControlKinds } from '@ngneers/controls/api/ng';
import { NgnButton } from '@ngneers/controls/button';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-button-kind',
  imports: [NgnButton],
  template: `
    @for (color of colors; track $index) {
      <span> {{ color ?? 'default' }}: </span>
      <div class="flex gap-2 flex-wrap items-center">
        @for (kind of kinds; track $index) {
          <button ngnButton [kind]="kind" [color]="color">
            {{ kind === 'icon' ? '👽' : kind }}
          </button>
        }
      </div>
    }
  `,
})
export class Demo_Button_Kind {
  protected readonly kinds = injectThemeControlKinds('button');
  protected readonly colors = [null, ...injectThemeColors()];
}
