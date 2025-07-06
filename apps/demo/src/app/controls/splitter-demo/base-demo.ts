import { Component, signal } from '@angular/core';
import { SplitterModule } from '@ngneers/controls/splitter';

@Component({
  imports: [SplitterModule],
  template: `
    <ngn-splitter direction="horizontal">
      <ngn-splitter-panel [size]="'70px'"> Panel 1 </ngn-splitter-panel>
      <ngn-splitter-panel [size]="'3fr'"> Panel 2 </ngn-splitter-panel>
      <ngn-splitter-panel [size]="'5fr'"> Panel 3 </ngn-splitter-panel>
    </ngn-splitter>
  `,
})
export class Splitter_Base_Component {
  protected readonly counter = signal(0);
}
