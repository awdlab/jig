import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { TextField_Base_Component } from './base';

@Component({
  imports: [CommonModule],
  template: `
    @for (c of components; track $index) {
      <ng-container *ngComponentOutlet="c" />
    }
  `,
})
export class TextField_All_Component {
  constructor() {}

  public readonly components = [TextField_Base_Component];
}
