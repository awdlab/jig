import { Component } from '@angular/core';
import { SplitterModule } from '@ngneers/controls/splitter';

@Component({
  imports: [SplitterModule],
  selector: 'ngn-splitter-minmax',
  template: `
    <ngn-splitter [layout]="'horizontal'" [ariaLabel]="'Min/Max Sizes Splitter'">
      <ngn-splitter-panel
        [name]="'first-panel'"
        [size]="'70px'"
        [minSize]="'10%'"
        [maxSize]="'250px'"
        [ariaLabel]="'First Panel'"
      >
        Panel 1
      </ngn-splitter-panel>
      <ngn-splitter-panel
        [name]="'second-panel'"
        [size]="'3fr'"
        [minSize]="'150px'"
        [maxSize]="'50%'"
        [ariaLabel]="'Second Panel'"
      >
        Panel 2
      </ngn-splitter-panel>
      <ngn-splitter-panel
        [name]="'third-panel'"
        [size]="'5fr'"
        [maxSize]="'750px'"
        [ariaLabel]="'Third Panel'"
      >
        Panel 3
      </ngn-splitter-panel>
      <ngn-splitter-panel
        [name]="'fourth-panel'"
        [size]="'1fr'"
        [minSize]="'15%'"
        [ariaLabel]="'Fourth Panel'"
      >
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
export class Splitter_MinMax_Component {}
