import { Component } from '@angular/core';
import tablerCode from '@iconify/icons-tabler/code';
import tablerMenu2 from '@iconify/icons-tabler/menu-2';
import { JigToggleButton } from '@awdlab/jig/toggle-button';

@Component({
  selector: 'jig-demo-toggle-button-icon',
  imports: [JigToggleButton],
  template: `<jig-toggle-button [iconOn]="iconCode" [labelOn]="'Code'" [iconOff]="iconBars" />`,
})
export class Demo_ToggleButton_Icon {
  protected readonly iconCode = tablerCode;
  protected readonly iconBars = tablerMenu2;
}
