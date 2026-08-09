import { Component } from '@angular/core';
import tablerCode from '@iconify/icons-tabler/code';
import { NgnTag } from '@awdlab/jig/tag';

@Component({
  imports: [NgnTag],
  selector: 'awd-demo-tag-with-icon',
  template: `
    <div class="flex flex-wrap gap-2">
      <awd-tag [icon]="icon">Tag with icon</awd-tag>
    </div>
  `,
})
export class Demo_Tag_WithIcon {
  protected readonly icon = tablerCode;
}
