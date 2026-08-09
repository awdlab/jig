import { Component } from '@angular/core';
import tablerBulb from '@iconify/icons-tabler/bulb';
import { NgnHint } from '@awdlab/jig/hint';

@Component({
  imports: [NgnHint],
  selector: 'awd-demo-hint-with-icon',
  template: `
    <div class="flex flex-col gap-2">
      <awd-hint kind="info">Automatic info icon derived from the kind</awd-hint>
      <awd-hint kind="error">Automatic error icon derived from the kind</awd-hint>
      <awd-hint [icon]="iconBulb">Custom icon override on a neutral hint</awd-hint>
      <awd-hint kind="error" [iconOnly]="true">Icon-only error text shown in a tooltip</awd-hint>
    </div>
  `,
})
export class Demo_Hint_WithIcon {
  protected readonly iconBulb = tablerBulb;
}
