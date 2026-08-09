import { Component } from '@angular/core';
import { AwdSplitterModule } from '@awdlab/jig/splitter';

@Component({
  imports: [AwdSplitterModule],
  selector: 'jig-demo-splitter-base',
  template: `
    <jig-splitter [layout]="'horizontal'" [aria-label]="'Basic Example Splitter'">
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
      height: 100px;
    }
  `,
})
export class Demo_Splitter_Base {}
