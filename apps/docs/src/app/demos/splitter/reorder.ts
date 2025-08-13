import { Component, signal } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { SplitterModule } from '@ngneers/controls/splitter';

@Component({
  imports: [SplitterModule, NgnButton],
  selector: 'ngn-splitter-reorder',
  template: `
    <button ngnButton (click)="shufflePanels()">Shuffle panel order</button>
    <ngn-splitter
      [layout]="'horizontal'"
      [panelOrder]="panelOrder()"
      [ariaLabel]="'Reorder Panels Splitter'"
    >
      <ngn-splitter-panel [name]="'first-panel'" [size]="'70px'" [ariaLabel]="'First Panel'">
        Panel 1
      </ngn-splitter-panel>
      <ngn-splitter-panel [name]="'second-panel'" [size]="'3fr'" [ariaLabel]="'Second Panel'">
        Panel 2
      </ngn-splitter-panel>
      <ngn-splitter-panel [name]="'third-panel'" [size]="'5fr'" [ariaLabel]="'Third Panel'">
        Panel 3
      </ngn-splitter-panel>
      <ngn-splitter-panel [name]="'fourth-panel'" [size]="'1fr'" [ariaLabel]="'Fourth Panel'">
        Panel 4
      </ngn-splitter-panel>
      <ngn-splitter-panel [name]="'fifth-panel'" [size]="'50px'" [ariaLabel]="'Fifth Panel'">
        Panel 5
      </ngn-splitter-panel>
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
export class Demo_Splitter_Reorder {
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
