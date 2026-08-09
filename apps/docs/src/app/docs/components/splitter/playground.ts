import { Component, computed, viewChild, viewChildren } from '@angular/core';
import { NgnSplitter, NgnSplitterModule, NgnSplitterPanel } from '@awdlab/jig/splitter';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-splitter-playground',
  imports: [NgnSplitterModule, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnSplitter', component: component() }]">
      <awd-splitter class="flex-1" #ref [layout]="'horizontal'" style="height: 200px;">
        <awd-splitter-panel #ref2 [size]="'1fr'">Panel 1</awd-splitter-panel>
        <awd-splitter-panel #ref2 [size]="'1fr'">Panel 2</awd-splitter-panel>
        <awd-splitter-panel #ref2 [size]="'1fr'">Panel 3</awd-splitter-panel>
      </awd-splitter>
    </awd-docs-playground>
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
