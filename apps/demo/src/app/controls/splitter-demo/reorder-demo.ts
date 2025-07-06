import { Component, signal } from '@angular/core';
import { Button } from '@ngneers/controls/button';
import { SplitterModule } from '@ngneers/controls/splitter';

@Component({
  imports: [SplitterModule, Button],
  selector: 'ngn-splitter-reorder',
  template: `
    <ngn-button (clicked)="shufflePanels()">Shuffle panel order</ngn-button>
    <ngn-splitter [layout]="'horizontal'" [panelOrder]="panelOrder()">
      <ngn-splitter-panel [name]="'first-panel'" [size]="'70px'"> Panel 1 </ngn-splitter-panel>
      <ngn-splitter-panel [name]="'second-panel'" [size]="'3fr'"> Panel 2 </ngn-splitter-panel>
      <ngn-splitter-panel [name]="'third-panel'" [size]="'5fr'"> Panel 3 </ngn-splitter-panel>
      <ngn-splitter-panel [name]="'fourth-panel'" [size]="'1fr'"> Panel 4 </ngn-splitter-panel>
      <ngn-splitter-panel [name]="'fifth-panel'" [size]="'50px'"> Panel 5 </ngn-splitter-panel>
    </ngn-splitter>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100px;
    }
  `,
})
export class Splitter_Reorder_Component {
  protected readonly panelOrder = signal([
    'first-panel',
    'second-panel',
    'third-panel',
    'fourth-panel',
    'fifth-panel',
  ]);

  protected shufflePanels() {
    this.panelOrder.update(order => [...order].sort(() => Math.random() - 0.5));
  }
}
