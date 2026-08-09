import { Component } from '@angular/core';
import tablerUser from '@iconify/icons-tabler/user';
import { NgnIcon } from '@awdlab/jig/icon';

@Component({
  imports: [NgnIcon],
  selector: 'awd-demo-icon-default-icon',
  template: `
    <div class="flex items-center gap-4">
      <awd-icon [icon]="icon" />
      <awd-icon defaultIcon="search" />
    </div>
  `,
})
export class Demo_Icon_DefaultIcon {
  protected readonly icon = tablerUser;
}
