import { Component } from '@angular/core';
import { injectThemeColors, injectThemeControlKinds } from '@awdlab/jig/api/ng';
import { NgnTag } from '@awdlab/jig/tag';

@Component({
  imports: [NgnTag],
  selector: 'awd-demo-tag-base',
  template: `
    <div class="flex flex-wrap gap-2">
      @for (kind of kinds(); track $index) {
        @if (kinds().length > 1) {
          <div class="mt-4 mb-2 w-full font-bold">Kind: {{ kind }}</div>
        }
        @for (color of colors(); track $index) {
          <awd-tag [kind]="kind" [color]="color">{{ color }}</awd-tag>
        }
      }
    </div>
  `,
})
export class Demo_Tag_Base {
  protected readonly kinds = injectThemeControlKinds('tag');
  protected readonly colors = injectThemeColors('tag');
}
