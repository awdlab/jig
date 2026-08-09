import { Component } from '@angular/core';
import tablerUser from '@iconify/icons-tabler/user';
import { AwdIcon } from '@awdlab/jig/icon';

@Component({
  imports: [AwdIcon],
  selector: 'jig-demo-icon-default-icon',
  template: `
    <div class="flex items-center gap-4">
      <jig-icon [icon]="icon" />
      <jig-icon defaultIcon="search" />
    </div>
  `,
})
export class Demo_Icon_DefaultIcon {
  protected readonly icon = tablerUser;
}
