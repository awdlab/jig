import { Component, computed, viewChild, viewChildren } from '@angular/core';
import { AwdSplitter, AwdSplitterModule, AwdSplitterPanel } from '@awdlab/jig/splitter';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-splitter-playground',
  imports: [AwdSplitterModule, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdSplitter', component: component() }]">
      <jig-splitter class="flex-1" #ref [layout]="'horizontal'" style="height: 200px;">
        <jig-splitter-panel #ref2 [size]="'1fr'">Panel 1</jig-splitter-panel>
        <jig-splitter-panel #ref2 [size]="'1fr'">Panel 2</jig-splitter-panel>
        <jig-splitter-panel #ref2 [size]="'1fr'">Panel 3</jig-splitter-panel>
      </jig-splitter>
    </jig-docs-playground>
  `,
})
export class AwdDocsSplitterPlayground {
  private readonly _componentSplitter = viewChild.required('ref', { read: AwdSplitter });
  private readonly _componentPanels = viewChildren('ref2', { read: AwdSplitterPanel });
  protected readonly component = computed(() => [
    this._componentSplitter(),
    ...this._componentPanels(),
  ]);
}
