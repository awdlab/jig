import { Component } from '@angular/core';
import { injectThemeColors, injectThemeControlKinds } from '@awdlab/jig/api/ng';
import { AwdButton } from '@awdlab/jig/button';

@Component({
  selector: 'jig-demo-button-kind',
  imports: [AwdButton],
  template: `
    <div class="flex flex-col gap-2">
      @for (color of colors(); track $index) {
        <div class="flex flex-wrap items-center gap-2">
          @for (kind of kinds(); track $index) {
            <button ngnButton [kind]="kind" [color]="color">
              {{ kind === 'icon' ? '👽' : kind }}
            </button>
          }
        </div>
      }
    </div>
  `,
})
export class Demo_Button_Kind {
  protected readonly kinds = injectThemeControlKinds('button');
  protected readonly colors = injectThemeColors('button');
}
