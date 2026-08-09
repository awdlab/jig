import { Component, signal } from '@angular/core';
import { type MenuItem, AwdMenu } from '@awdlab/jig/menu';

@Component({
  selector: 'jig-demo-menu-separator',
  imports: [AwdMenu],
  template: `<jig-menu #menu [items]="items()" />`,
})
export class Demo_Menu_Separator {
  public readonly items = signal<MenuItem[]>([
    { id: '1', label: 'Item 1' },
    { id: '2', label: 'Item 2' },
    { id: '3', label: 'Item 3' },
    { separator: true },
    { id: '4', label: 'Item 4' },
  ]);
}
