import { Component } from '@angular/core';
import tablerUser from '@iconify/icons-tabler/user';
import { NgnIcon } from '@ngneers/controls/icon';

@Component({
  imports: [NgnIcon],
  selector: 'ngn-demo-icon-sizing',
  template: `
    <div class="flex items-center gap-4">
      <ngn-icon [icon]="icon" style="font-size: 16px" />
      <ngn-icon [icon]="icon" style="font-size: 24px" />
      <ngn-icon [icon]="icon" class="text-4xl" />
      <ngn-icon [icon]="icon" style="font-size: 48px" />
    </div>
  `,
})
export class Demo_Icon_Sizing {
  protected readonly icon = tablerUser;
}
