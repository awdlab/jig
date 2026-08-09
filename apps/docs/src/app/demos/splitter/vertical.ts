import { Component } from '@angular/core';
import { NgnSplitterModule } from '@awdlab/jig/splitter';

@Component({
  imports: [NgnSplitterModule],
  selector: 'awd-demo-splitter-vertical',
  template: `
    <awd-splitter [layout]="'vertical'" [aria-label]="'Vertical Splitter Example'">
      <awd-splitter-panel [size]="'70px'" [aria-label]="'First Panel'">
        Panel 1
      </awd-splitter-panel>
      <awd-splitter-panel [size]="'3fr'" [aria-label]="'Second Panel'">
        Panel 2
      </awd-splitter-panel>
      <awd-splitter-panel [size]="'5fr'" [aria-label]="'Third Panel'"> Panel 3 </awd-splitter-panel>
    </awd-splitter>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 350px;
    }
  `,
})
export class Demo_Splitter_Vertical {}
