import { Component } from '@angular/core';
import { injectThemeColors, injectThemeControlKinds } from '@awdlab/jig/api/ng';
import { JigMessage } from '@awdlab/jig/message';

@Component({
  imports: [JigMessage],
  selector: 'jig-demo-message-base',
  template: `
    <div class="flex flex-wrap gap-2">
      @for (kind of kinds(); track $index) {
        @if (kinds().length > 1) {
          <div class="mt-4 mb-2 w-full font-bold">Kind: {{ kind }}</div>
        }
        @for (color of colors(); track $index) {
          <jig-message [kind]="kind" [color]="color">{{ color }} message</jig-message>
        }
      }
    </div>
  `,
})
export class Demo_Message_Base {
  protected readonly kinds = injectThemeControlKinds('message');
  protected readonly colors = injectThemeColors('message');
}
