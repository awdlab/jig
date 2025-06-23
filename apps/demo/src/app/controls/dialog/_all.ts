import { Dialog } from '@ngneers/controls/dialog';
import { Component, OnInit } from '@angular/core';
import { Dialog_Base_Component } from './base';
import { CommonModule } from '@angular/common';

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
