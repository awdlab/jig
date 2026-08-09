import { Component } from '@angular/core';
import tablerBulb from '@iconify/icons-tabler/bulb';
import { JigHint } from '@awdlab/jig/hint';

@Component({
  imports: [JigHint],
  selector: 'jig-demo-hint-with-icon',
  template: `
    <div class="flex flex-col gap-2">
      <jig-hint kind="info">Automatic info icon derived from the kind</jig-hint>
      <jig-hint kind="error">Automatic error icon derived from the kind</jig-hint>
      <jig-hint [icon]="iconBulb">Custom icon override on a neutral hint</jig-hint>
      <jig-hint kind="error" [iconOnly]="true">Icon-only error text shown in a tooltip</jig-hint>
    </div>
  `,
})
export class Demo_Hint_WithIcon {
  protected readonly iconBulb = tablerBulb;
}
