import { Component } from '@angular/core';
import tablerUser from '@iconify/icons-tabler/user';
import { JigIcon } from '@awdlab/jig/icon';

@Component({
  imports: [JigIcon],
  selector: 'jig-demo-icon-sizing',
  template: `
    <div class="flex items-center gap-4">
      <jig-icon [icon]="icon" style="font-size: 16px" />
      <jig-icon [icon]="icon" style="font-size: 24px" />
      <jig-icon [icon]="icon" class="text-4xl" />
      <jig-icon [icon]="icon" style="font-size: 48px" />
    </div>
  `,
})
export class Demo_Icon_Sizing {
  protected readonly icon = tablerUser;
}
