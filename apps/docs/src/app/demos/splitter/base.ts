import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SplitterModule } from '@ngneers/controls/splitter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SplitterModule],
  selector: 'ngn-demo-splitter-base',
  template: `
    <ngn-splitter [layout]="'horizontal'" [aria-label]="'Basic Example Splitter'">
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
      height: 100px;
    }
  `,
})
export class Demo_Splitter_Base {}
