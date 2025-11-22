import { Component, ChangeDetectionStrategy } from '@angular/core';
import { injectThemeColors, injectThemeControlKinds } from '@ngneers/controls/api/ng';
import { NgnMessage } from '@ngneers/controls/message';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnMessage],
  selector: 'ngn-demo-message-base',
  template: `
    <div class="flex gap-2 flex-col">
      @for (kind of kinds; track $index) {
        @if (kinds.length > 1) {
          <div class="w-full font-bold mt-4 mb-2">Kind: {{ kind ?? '*none*' }}</div>
        }
        @for (color of colors; track $index) {
          <ngn-message [kind]="kind" [color]="color">{{ color ?? 'default' }} message</ngn-message>
        }
      }
    </div>
  `,
})
export class Demo_Message_Base {
  protected readonly kinds = [null, ...injectThemeControlKinds('message')];
  protected readonly colors = [null, ...injectThemeColors()];
}
