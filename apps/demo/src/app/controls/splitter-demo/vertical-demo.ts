import { Component } from '@angular/core';
import { SplitterModule } from '@ngneers/controls/splitter';

@Component({
  imports: [SplitterModule],
  selector: 'ngn-splitter-vertical',
  template: `
    <ngn-splitter [layout]="'vertical'" [ariaLabel]="'Vertical Splitter Example'">
      <ngn-splitter-panel [size]="'70px'" [ariaLabel]="'First Panel'"> Panel 1 </ngn-splitter-panel>
      <ngn-splitter-panel [size]="'3fr'" [ariaLabel]="'Second Panel'"> Panel 2 </ngn-splitter-panel>
      <ngn-splitter-panel [size]="'5fr'" [ariaLabel]="'Third Panel'"> Panel 3 </ngn-splitter-panel>
    </ngn-splitter>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 350px;
    }
  `,
})
export class Splitter_Vertical_Component {}
