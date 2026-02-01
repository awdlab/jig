import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnTag } from '@ngneers/controls/tag';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnTag],
  selector: 'ngn-demo-tag-with-icon',
  template: `
    <div class="flex flex-wrap gap-2">
      <ngn-tag [icon]="'img/icons/code.svg'">Tag with icon</ngn-tag>
    </div>
  `,
})
export class Demo_Tag_WithIcon {}
