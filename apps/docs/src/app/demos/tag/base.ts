import { Component, ChangeDetectionStrategy } from '@angular/core';
import { injectThemeColors, injectThemeControlKinds } from '@ngneers/controls/api/ng';
import { NgnTag } from '@ngneers/controls/tag';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnTag],
  selector: 'ngn-demo-tag-base',
  template: `
    <div class="flex gap-2 flex-wrap">
      @for (kind of kinds; track $index) {
        @if (kinds.length > 1) {
          <div class="w-full font-bold mt-4 mb-2">Kind: {{ kind }}</div>
        }
        @for (color of colors; track $index) {
          <ngn-tag [kind]="kind" [color]="color">{{ color }}</ngn-tag>
        }
      }
    </div>
  `,
})
export class Demo_Tag_Base {
  protected readonly kinds = injectThemeControlKinds('tag');
  protected readonly colors = injectThemeColors('tag');
}
