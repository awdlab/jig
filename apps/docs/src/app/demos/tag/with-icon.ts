import { Component } from '@angular/core';
import { injectThemeControlKinds } from '@ngneers/controls/api/ng';
import { NgnTag } from '@ngneers/controls/tag';

@Component({
  imports: [NgnTag],
  selector: 'ngn-demo-tag-with-icon',
  template: `
    <div class="flex gap-2 flex-wrap">
      @for (kind of kinds; track $index) {
        <ngn-tag [kind]="kind" [icon]="'img/icons/code.svg'">{{ kind ?? '*no kind*' }}</ngn-tag>
      }
    </div>
  `,
})
export class Demo_Tag_WithIcon {
  protected readonly kinds = [null, ...injectThemeControlKinds('tag')];
}
