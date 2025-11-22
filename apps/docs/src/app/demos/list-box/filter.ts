import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { NgnListBox } from '@ngneers/controls/list-box';

import { exampleData } from '../../helper/data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnListBox],
  selector: 'ngn-demo-list-box-filter',
  template: ` <input
      type="text"
      placeholder="Filter items..."
      (input)="filterText.set($event.target.value)"
    />
    <ngn-list-box
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
