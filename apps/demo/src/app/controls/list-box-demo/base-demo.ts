import { Component } from '@angular/core';
import { ListBox } from '@ngneers/controls/list-box';

import { exampleData } from '../../helper/data';

@Component({
  imports: [ListBox],
  template: `<ngn-list-box [items]="items" style="display: block; height: 300px;" />`,
})
export class ListBox_Base_Component {
  public readonly items = exampleData.items.flatPreformatted;
}
