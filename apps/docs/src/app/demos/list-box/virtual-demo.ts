import { Component } from '@angular/core';
import { NgnListBox } from '@ngneers/controls/list-box';

@Component({
  imports: [NgnListBox],
  selector: 'ngn-demo-list-box-virtual-demo',
  template: `
    <ngn-list-box
      [items]="items"
      [virtual]="true"
      [itemHeight]="40"
      style="display: block; height: 300px;"
    />
  `,
})
export class Demo_ListBox_Virtual {
  protected readonly items = Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`).map(
    (label, index) => ({ id: index + 1, label })
  );
}
