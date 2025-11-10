import { Component } from '@angular/core';
import { injectThemeControlKinds } from '@ngneers/controls/api/ng';
import { NgnTag } from '@ngneers/controls/tag';

@Component({
  imports: [NgnTag],
  selector: 'ngn-demo-tag-base',
  template: `
    <div class="flex gap-2 flex-wrap">
      @for (kind of kinds; track $index) {
        <ngn-tag [kind]="kind">{{ kind ?? '*no kind*' }}</ngn-tag>
      }
    </div>
  `,
})
export class Demo_Tag_Base {
  protected readonly kinds = [null, ...injectThemeControlKinds('tag')];
}
