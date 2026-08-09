import { Component, computed, viewChild, viewChildren } from '@angular/core';
import { JigSplitter, JigSplitterModule, JigSplitterPanel } from '@awdlab/jig/splitter';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-splitter-playground',
  imports: [JigSplitterModule, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigSplitter', component: component() }]">
      <jig-splitter class="flex-1" #ref [layout]="'horizontal'" style="height: 200px;">
        <jig-splitter-panel #ref2 [size]="'1fr'">Panel 1</jig-splitter-panel>
        <jig-splitter-panel #ref2 [size]="'1fr'">Panel 2</jig-splitter-panel>
        <jig-splitter-panel #ref2 [size]="'1fr'">Panel 3</jig-splitter-panel>
      </jig-splitter>
    </jig-docs-playground>
  `,
})
export class JigDocsSplitterPlayground {
  private readonly _componentSplitter = viewChild.required('ref', { read: JigSplitter });
  private readonly _componentPanels = viewChildren('ref2', { read: JigSplitterPanel });
  protected readonly component = computed(() => [
    this._componentSplitter(),
    ...this._componentPanels(),
  ]);
}
