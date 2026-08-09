import { Component, signal } from '@angular/core';
import { AwdListBox } from '@awdlab/jig/list-box';

import { exampleData } from '../../helper/data';

@Component({
  imports: [AwdListBox],
  selector: 'jig-demo-list-box-filter',
  template: ` <input
      type="text"
      placeholder="Filter items..."
      (input)="filterText.set($event.target.value)"
    />
    <jig-list-box
      #listBox
      [items]="items"
      [filter]="true"
      [filterText]="filterText()"
      style="display: block; height: 300px;"
    />`,
})
export class Demo_ListBox_Filter {
  protected readonly items = exampleData.items.groupedPreformatted;

  protected readonly filterText = signal('');
}
