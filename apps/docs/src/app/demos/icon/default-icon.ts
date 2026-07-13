import { Component } from '@angular/core';
import tablerUser from '@iconify/icons-tabler/user';
import { NgnIcon } from '@ngneers/controls/icon';

@Component({
  imports: [NgnIcon],
  selector: 'ngn-demo-icon-default-icon',
  template: `
    <div class="flex items-center gap-4">
      <ngn-icon [icon]="icon" />
      <ngn-icon defaultIcon="search" />
    </div>
  `,
})
export class Demo_Icon_DefaultIcon {
  protected readonly icon = tablerUser;
}
