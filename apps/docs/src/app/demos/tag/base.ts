import { Component } from '@angular/core';
import { injectThemeColors, injectThemeControlKinds } from '@awdlab/jig/api/ng';
import { AwdTag } from '@awdlab/jig/tag';

@Component({
  imports: [AwdTag],
  selector: 'jig-demo-tag-base',
  template: `
    <div class="flex flex-wrap gap-2">
      @for (kind of kinds(); track $index) {
        @if (kinds().length > 1) {
          <div class="mt-4 mb-2 w-full font-bold">Kind: {{ kind }}</div>
        }
        @for (color of colors(); track $index) {
          <jig-tag [kind]="kind" [color]="color">{{ color }}</jig-tag>
        }
      }
    </div>
  `,
})
export class Demo_Tag_Base {
  protected readonly kinds = injectThemeControlKinds('tag');
  protected readonly colors = injectThemeColors('tag');
}
