import { Component } from '@angular/core';
import tablerBulb from '@iconify/icons-tabler/bulb';
import { NgnHint } from '@ngneers/controls/hint';

@Component({
  imports: [NgnHint],
  selector: 'ngn-demo-hint-with-icon',
  template: `
    <div class="flex flex-col gap-2">
      <ngn-hint kind="info">Automatic info icon derived from the kind</ngn-hint>
      <ngn-hint kind="error">Automatic error icon derived from the kind</ngn-hint>
      <ngn-hint [icon]="iconBulb">Custom icon override on a neutral hint</ngn-hint>
    </div>
  `,
})
export class Demo_Hint_WithIcon {
  protected readonly iconBulb = tablerBulb;
}
