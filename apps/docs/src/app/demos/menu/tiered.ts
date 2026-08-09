import { Component, signal } from '@angular/core';
import { type MenuItem, AwdMenu } from '@awdlab/jig/menu';

@Component({
  selector: 'jig-demo-menu-tiered',
  imports: [AwdMenu],
  template: `<jig-menu class="block w-40" #menu [items]="items()" />`,
})
export class Demo_Menu_Tiered {
  public readonly items = signal<MenuItem[]>([
    { id: '1', label: 'Item 1' },
    { id: '2', label: 'Item 2' },
    { id: '3', label: 'Item 3' },
    {
      id: '4',
      label: 'Item 4',
      children: [
        { id: '4-1', label: 'Item 4-1' },
        { id: '4-2', label: 'Item 4-2' },
        { id: '4-3', label: 'Item 4-3' },
      ],
    },
    {
      id: '5',
      label: 'Item 5',
      children: [
        { id: '5-1', label: 'Item 5-1' },
        { id: '5-2', label: 'Item 5-2' },
        {
          id: '5-3',
          label: 'Item 5-3',
          children: [
            { id: '5-3-1', label: 'Item 5-3-1' },
            { id: '5-3-2', label: 'Item 5-3-2' },
            { id: '5-3-3', label: 'Item 5-3-3' },
          ],
        },
      ],
    },
  ]);
}
