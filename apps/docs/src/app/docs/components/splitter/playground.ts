import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { NgnSplitter, NgnSplitterModule } from '@ngneers/controls/splitter';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnSplitterModule, NgnDocsPlayground],
  template: `
    <ngn-docs-playground componentName="NgnSplitter" [component]="component()">
      <ngn-splitter #ref [layout]="'horizontal'" style="height: 200px;">
        <ngn-splitter-panel [size]="'1fr'">Panel 1</ngn-splitter-panel>
        <ngn-splitter-panel [size]="'1fr'">Panel 2</ngn-splitter-panel>
        <ngn-splitter-panel [size]="'1fr'">Panel 3</ngn-splitter-panel>
      </ngn-splitter>
    </ngn-docs-playground>
  `,
})
export class NgnDocsSplitterPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnSplitter });
}
