import { Component } from '@angular/core';
import tablerCode from '@iconify/icons-tabler/code';
import { NgnTag } from '@ngneers/controls/tag';

@Component({
  imports: [NgnTag],
  selector: 'ngn-demo-tag-with-icon',
  template: `
    <div class="flex flex-wrap gap-2">
      <ngn-tag [icon]="icon">Tag with icon</ngn-tag>
    </div>
  `,
})
export class Demo_Tag_WithIcon {
  protected readonly icon = tablerCode;
}
