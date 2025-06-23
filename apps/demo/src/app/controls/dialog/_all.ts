import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { Dialog_Base_Component } from './base';

@Component({
  imports: [CommonModule],
  template: `
    @for (c of components; track $index) {
      <ng-container *ngComponentOutlet="c" />
    }
  `,
})
export class Dialog_All_Component {
  constructor() {}

  public readonly components = [Dialog_Base_Component];
}
