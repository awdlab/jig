import { Component } from '@angular/core';
import { NgnSplitterModule } from '@awdlab/jig/splitter';

@Component({
  imports: [NgnSplitterModule],
  selector: 'awd-demo-splitter-min-max',
  template: `
    <awd-splitter [layout]="'horizontal'" [aria-label]="'Min/Max Sizes Splitter'">
      <awd-splitter-panel
        [name]="'first-panel'"
        [size]="'70px'"
        [minSize]="'10%'"
        [maxSize]="'250px'"
        [aria-label]="'First Panel'"
      >
        Panel 1
      </awd-splitter-panel>
      <awd-splitter-panel
        [name]="'second-panel'"
        [size]="'3fr'"
        [minSize]="'150px'"
        [maxSize]="'50%'"
        [aria-label]="'Second Panel'"
      >
        Panel 2
      </awd-splitter-panel>
      <awd-splitter-panel
        [name]="'third-panel'"
        [size]="'5fr'"
        [maxSize]="'750px'"
        [aria-label]="'Third Panel'"
      >
        Panel 3
      </awd-splitter-panel>
      <awd-splitter-panel
        [name]="'fourth-panel'"
        [size]="'1fr'"
        [minSize]="'15%'"
        [aria-label]="'Fourth Panel'"
      >
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
export class Demo_Splitter_MinMax {}
