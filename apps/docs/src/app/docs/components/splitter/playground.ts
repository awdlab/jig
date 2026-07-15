import { Component, computed, viewChild, viewChildren } from '@angular/core';
import { NgnSplitter, NgnSplitterModule, NgnSplitterPanel } from '@ngneers/controls/splitter';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'ngn-docs-splitter-playground',
  imports: [NgnSplitterModule, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnSplitter', component: component() }]">
      <ngn-splitter class="flex-1" #ref [layout]="'horizontal'" style="height: 200px;">
        <ngn-splitter-panel #ref2 [size]="'1fr'">Panel 1</ngn-splitter-panel>
        <ngn-splitter-panel #ref2 [size]="'1fr'">Panel 2</ngn-splitter-panel>
        <ngn-splitter-panel #ref2 [size]="'1fr'">Panel 3</ngn-splitter-panel>
      </ngn-splitter>
    </ngn-docs-playground>
  `,
})
export class NgnDocsSplitterPlayground {
  private readonly _componentSplitter = viewChild.required('ref', { read: NgnSplitter });
  private readonly _componentPanels = viewChildren('ref2', { read: NgnSplitterPanel });
  protected readonly component = computed(() => [
    this._componentSplitter(),
    ...this._componentPanels(),
  ]);
}
