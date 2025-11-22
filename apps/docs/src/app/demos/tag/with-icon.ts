import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnTag } from '@ngneers/controls/tag';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnTag],
  selector: 'ngn-demo-tag-with-icon',
  template: `
    <div class="flex gap-2 flex-wrap">
      <ngn-tag [icon]="'img/icons/code.svg'">Tag with icon</ngn-tag>
    </div>
  `,
})
export class Demo_Tag_WithIcon {}
