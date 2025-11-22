import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnListBox } from '@ngneers/controls/list-box';

import { exampleData } from '../../helper/data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnListBox],
  selector: 'ngn-demo-list-box-multiple',
  template: `<ngn-list-box
    [items]="items"
    [selectable]="true"
    [multiple]="true"
    style="display: block; height: 300px;"
  />`,
})
export class Demo_ListBox_Multiple {
  protected readonly items = exampleData.items.flatPreformatted;
}
