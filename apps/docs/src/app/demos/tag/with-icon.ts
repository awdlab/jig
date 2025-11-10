import { Component } from '@angular/core';
import { NgnTag } from '@ngneers/controls/tag';

@Component({
  imports: [NgnTag],
  selector: 'ngn-demo-tag-with-icon',
  template: `
    <div class="flex gap-2 flex-wrap">
      <ngn-tag [icon]="'img/icons/code.svg'">Tag with icon</ngn-tag>
    </div>
  `,
})
export class Demo_Tag_WithIcon {}
