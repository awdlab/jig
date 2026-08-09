import { Component } from '@angular/core';
import tablerCode from '@iconify/icons-tabler/code';
import { AwdTag } from '@awdlab/jig/tag';

@Component({
  imports: [AwdTag],
  selector: 'jig-demo-tag-with-icon',
  template: `
    <div class="flex flex-wrap gap-2">
      <jig-tag [icon]="icon">Tag with icon</jig-tag>
    </div>
  `,
})
export class Demo_Tag_WithIcon {
  protected readonly icon = tablerCode;
}
