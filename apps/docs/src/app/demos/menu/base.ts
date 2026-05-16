import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import tablerCode from '@iconify/icons-tabler/code';
import { type MenuItem, NgnMenu } from '@ngneers/controls/menu';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-menu-base',
  imports: [NgnMenu],
  template: `<ngn-menu #menu [items]="items()" />`,
})
export class Demo_Menu_Base {
  public readonly items = signal<MenuItem[]>([
    { id: '1', label: 'Item 1' },
    { id: '2', label: 'Item 2' },
    { id: '3', label: 'Item 3', icon: tablerCode },
  ]);
}
