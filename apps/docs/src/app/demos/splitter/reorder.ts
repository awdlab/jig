import { Component, signal } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { NgnSplitterModule } from '@awdlab/jig/splitter';

@Component({
  imports: [NgnSplitterModule, NgnButton],
  selector: 'awd-demo-splitter-reorder',
  template: `
    <button ngnButton (click)="shufflePanels()">Shuffle panel order</button>
    <awd-splitter
      [layout]="'horizontal'"
      [panelOrder]="panelOrder()"
      [aria-label]="'Reorder Panels Splitter'"
    >
      <awd-splitter-panel [name]="'first-panel'" [size]="'70px'" [aria-label]="'First Panel'">
        Panel 1
      </awd-splitter-panel>
      <awd-splitter-panel [name]="'second-panel'" [size]="'3fr'" [aria-label]="'Second Panel'">
        Panel 2
      </awd-splitter-panel>
      <awd-splitter-panel [name]="'third-panel'" [size]="'5fr'" [aria-label]="'Third Panel'">
        Panel 3
      </awd-splitter-panel>
      <awd-splitter-panel [name]="'fourth-panel'" [size]="'1fr'" [aria-label]="'Fourth Panel'">
        Panel 4
      </awd-splitter-panel>
      <awd-splitter-panel [name]="'fifth-panel'" [size]="'50px'" [aria-label]="'Fifth Panel'">
        Panel 5
      </awd-splitter-panel>
    </awd-splitter>
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
