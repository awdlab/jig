import { Component } from '@angular/core';
import { injectThemeColors, injectThemeControlKinds } from '@ngneers/controls/api/ng';
import { NgnMessage } from '@ngneers/controls/message';

@Component({
  imports: [NgnMessage],
  selector: 'ngn-demo-message-base',
  template: `
    <div class="flex flex-wrap gap-2">
      @for (kind of kinds(); track $index) {
        @if (kinds().length > 1) {
          <div class="mt-4 mb-2 w-full font-bold">Kind: {{ kind }}</div>
        }
        @for (color of colors(); track $index) {
          <ngn-message [kind]="kind" [color]="color">{{ color }} message</ngn-message>
        }
      }
    </div>
  `,
})
export class Demo_Message_Base {
  protected readonly kinds = injectThemeControlKinds('message');
  protected readonly colors = injectThemeColors('message');
}
