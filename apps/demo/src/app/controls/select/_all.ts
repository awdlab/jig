import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { Select_Base_Component } from './base';

@Component({
  imports: [CommonModule],
  template: `
    @for (c of components; track $index) {
      <ng-container *ngComponentOutlet="c" />
    }
  `,
})
export class Select_All_Component {
  constructor() {}

  public readonly components = [Select_Base_Component];
}
