import { Component } from '@angular/core';
import { JigSplitterModule } from '@awdlab/jig/splitter';

@Component({
  imports: [JigSplitterModule],
  selector: 'jig-demo-splitter-vertical',
  template: `
    <jig-splitter [layout]="'vertical'" [aria-label]="'Vertical Splitter Example'">
      <jig-splitter-panel [size]="'70px'" [aria-label]="'First Panel'">
        Panel 1
      </jig-splitter-panel>
      <jig-splitter-panel [size]="'3fr'" [aria-label]="'Second Panel'">
        Panel 2
      </jig-splitter-panel>
      <jig-splitter-panel [size]="'5fr'" [aria-label]="'Third Panel'"> Panel 3 </jig-splitter-panel>
    </jig-splitter>
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
