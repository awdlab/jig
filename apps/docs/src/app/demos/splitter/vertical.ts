import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnSplitterModule } from '@ngneers/controls/splitter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnSplitterModule],
  selector: 'ngn-demo-splitter-vertical',
  template: `
    <ngn-splitter [layout]="'vertical'" [aria-label]="'Vertical Splitter Example'">
      <ngn-splitter-panel [size]="'70px'" [aria-label]="'First Panel'">
        Panel 1
      </ngn-splitter-panel>
      <ngn-splitter-panel [size]="'3fr'" [aria-label]="'Second Panel'">
        Panel 2
      </ngn-splitter-panel>
      <ngn-splitter-panel [size]="'5fr'" [aria-label]="'Third Panel'"> Panel 3 </ngn-splitter-panel>
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
export class Demo_Splitter_Vertical {}
