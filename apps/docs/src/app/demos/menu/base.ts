import { Component, signal } from '@angular/core';
import tablerCode from '@iconify/icons-tabler/code';
import { type MenuItem, NgnMenu } from '@awdlab/jig/menu';

@Component({
  selector: 'awd-demo-menu-base',
  imports: [NgnMenu],
  template: `<awd-menu #menu [items]="items()" />`,
})
export class Demo_Menu_Base {
  public readonly items = signal<MenuItem[]>([
    { id: '1', label: 'Item 1' },
    { id: '2', label: 'Item 2' },
    { id: '3', label: 'Item 3', icon: tablerCode },
  ]);
}
