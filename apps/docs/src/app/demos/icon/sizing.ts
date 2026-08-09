import { Component } from '@angular/core';
import tablerUser from '@iconify/icons-tabler/user';
import { NgnIcon } from '@awdlab/jig/icon';

@Component({
  imports: [NgnIcon],
  selector: 'awd-demo-icon-sizing',
  template: `
    <div class="flex items-center gap-4">
      <awd-icon [icon]="icon" style="font-size: 16px" />
      <awd-icon [icon]="icon" style="font-size: 24px" />
      <awd-icon [icon]="icon" class="text-4xl" />
      <awd-icon [icon]="icon" style="font-size: 48px" />
    </div>
  `,
})
export class Demo_Icon_Sizing {
  protected readonly icon = tablerUser;
}
