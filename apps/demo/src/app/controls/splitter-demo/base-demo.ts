import { Component } from '@angular/core';
import { SplitterModule } from '@ngneers/controls/splitter';

@Component({
  imports: [SplitterModule],
  template: `
    <ngn-splitter direction="horizontal">
      <ngn-splitter-panel [size]="70" [sizeMode]="'absolute'"> Panel 1 </ngn-splitter-panel>
      <ngn-splitter-panel [size]="30"> Panel 2 </ngn-splitter-panel>
      <ngn-splitter-panel [size]="50"> Panel 3 </ngn-splitter-panel>
    </ngn-splitter>
  `,
})
export class Splitter_Base_Component {}
