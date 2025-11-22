import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { SplitterLayout, SplitterModule } from '@ngneers/controls/splitter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SplitterModule, NgnButton],
  selector: 'ngn-demo-splitter-state',
  template: `
    <div style="display: flex; gap: 8px;">
      <button ngnButton (click)="toggleLayout()">Toggle Layout</button>
      <button ngnButton (click)="shufflePanels()">Shuffle Panels</button>
    </div>
    <ngn-splitter
      [layout]="layout()"
      [panelOrder]="panelOrder()"
      [stateStorage]="'local'"
      [stateKey]="'splitter-state-demo'"
      (layoutChange)="layout.set($event)"
      [aria-label]="'Stateful Splitter Demo'"
    >
      <ngn-splitter-panel [name]="'first-panel'" [size]="'70px'" [aria-label]="'First Panel'">
        Panel 1
      </ngn-splitter-panel>
      <ngn-splitter-panel [name]="'second-panel'" [size]="'3fr'" [aria-label]="'Second Panel'">
        Panel 2
      </ngn-splitter-panel>
      <ngn-splitter-panel [name]="'third-panel'" [size]="'5fr'" [aria-label]="'Third Panel'">
        Panel 3
      </ngn-splitter-panel>
      <ngn-splitter-panel [name]="'fourth-panel'" [size]="'1fr'" [aria-label]="'Fourth Panel'">
        Panel 4
      </ngn-splitter-panel>
      <ngn-splitter-panel [name]="'fifth-panel'" [size]="'50px'" [aria-label]="'Fifth Panel'">
        Panel 5
      </ngn-splitter-panel>
    </ngn-splitter>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 500px;
    }
  `,
})
export class Demo_Splitter_State {
  protected readonly layout = signal<SplitterLayout>('horizontal');
  protected readonly panelOrder = signal([
    'first-panel',
    'second-panel',
    'third-panel',
    'fourth-panel',
    'fifth-panel',
  ]);

  protected toggleLayout() {
    this.layout.update(current => (current === 'horizontal' ? 'vertical' : 'horizontal'));
  }

  protected shufflePanels() {
    this.panelOrder.update(order => [...order].sort(() => Math.random() - 0.5));
  }
}
