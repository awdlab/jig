import { Component } from '@angular/core';
import tablerBrandGithub from '@iconify/icons-tabler/brand-github';
import tablerCode from '@iconify/icons-tabler/code';
import tablerCopy from '@iconify/icons-tabler/copy';
import tablerUser from '@iconify/icons-tabler/user';
import { JigMessage } from '@awdlab/jig/message';

@Component({
  imports: [JigMessage],
  selector: 'jig-demo-message-with-icon',
  template: `
    <div class="flex flex-col gap-2">
      <jig-message [icon]="iconCode" color="success"> Success message with icon </jig-message>
      <jig-message [icon]="iconUser" color="info"> Info message with icon </jig-message>
      <jig-message [icon]="iconCopy" color="warning"> Warning message with icon </jig-message>
      <jig-message [icon]="iconGithub" color="error"> Error message with icon </jig-message>
    </div>
  `,
})
export class Demo_Message_WithIcon {
  protected readonly iconCode = tablerCode;
  protected readonly iconUser = tablerUser;
  protected readonly iconCopy = tablerCopy;
  protected readonly iconGithub = tablerBrandGithub;
}
