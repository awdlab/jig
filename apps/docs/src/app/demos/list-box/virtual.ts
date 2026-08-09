import { Component } from '@angular/core';
import { NgnListBox } from '@awdlab/jig/list-box';

@Component({
  imports: [NgnListBox],
  selector: 'awd-demo-list-box-virtual-demo',
  template: `
    <awd-list-box
      [items]="items"
      [virtual]="true"
      [itemHeight]="40"
      style="display: block; height: 300px; width: 150px;"
    />
  `,
})
export class Demo_ListBox_Virtual {
  protected readonly items = Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`).map(
    (label, index) => ({ value: index + 1, label })
  );
}
