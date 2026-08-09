import { Component } from '@angular/core';
import tablerCode from '@iconify/icons-tabler/code';
import tablerMenu2 from '@iconify/icons-tabler/menu-2';
import { NgnToggleButton } from '@awdlab/jig/toggle-button';

@Component({
  selector: 'awd-demo-toggle-button-icon',
  imports: [NgnToggleButton],
  template: `<awd-toggle-button [iconOn]="iconCode" [labelOn]="'Code'" [iconOff]="iconBars" />`,
})
export class Demo_ToggleButton_Icon {
  protected readonly iconCode = tablerCode;
  protected readonly iconBars = tablerMenu2;
}
