import { Component } from '@angular/core';
import { NgnSplitterModule } from '@ngneers/controls/splitter';

@Component({
  imports: [NgnSplitterModule],
  selector: 'ngn-demo-splitter-min-max',
  template: `
    <ngn-splitter [layout]="'horizontal'" [aria-label]="'Min/Max Sizes Splitter'">
      <ngn-splitter-panel
        [name]="'first-panel'"
        [size]="'70px'"
        [minSize]="'10%'"
        [maxSize]="'250px'"
        [aria-label]="'First Panel'"
      >
        Panel 1
      </ngn-splitter-panel>
      <ngn-splitter-panel
        [name]="'second-panel'"
        [size]="'3fr'"
        [minSize]="'150px'"
        [maxSize]="'50%'"
        [aria-label]="'Second Panel'"
      >
        Panel 2
      </ngn-splitter-panel>
      <ngn-splitter-panel
        [name]="'third-panel'"
        [size]="'5fr'"
        [maxSize]="'750px'"
        [aria-label]="'Third Panel'"
      >
        Panel 3
      </ngn-splitter-panel>
      <ngn-splitter-panel
        [name]="'fourth-panel'"
        [size]="'1fr'"
        [minSize]="'15%'"
        [aria-label]="'Fourth Panel'"
      >
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
      height: 100px;
    }
  `,
})
export class Demo_Splitter_MinMax {}
