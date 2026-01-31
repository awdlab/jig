import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnListBox } from '@ngneers/controls/list-box';

import { exampleData } from '../../helper/data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnListBox],
  selector: 'ngn-demo-list-box-base',
  template: `<ngn-list-box [items]="items" style="height: 300px;" />`,
})
export class Demo_ListBox_Base {
  protected readonly items = exampleData.items.flatPreformatted;
}
