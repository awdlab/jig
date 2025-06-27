import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { Popover_Base_Component } from './base';

@Component({
  imports: [CommonModule],
  template: `
    @for (c of components; track $index) {
      <ng-container *ngComponentOutlet="c" />
    }
  `,
})
export class Popover_All_Component {
  constructor() {}

  public readonly components = [Popover_Base_Component];
}
