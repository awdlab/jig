import { Component, computed, viewChild, viewChildren } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigToolbar, JigToolbarRegion } from '@awdlab/jig/toolbar';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-toolbar-playground',
  imports: [JigButton, JigToolbar, JigToolbarRegion, JigDocsPlayground],
  template: `
    <jig-docs-playground
      [controls]="[
        { componentName: 'JigToolbar', component: component() },
        { componentName: 'JigToolbarRegion', component: regions() },
      ]"
    >
      <jig-toolbar #ref class="flex-1">
        <jig-toolbar-region #region placement="start">
          <ng-template #item><button jigButton kind="text">Bold</button></ng-template>
          <ng-template #item><button jigButton kind="text">Italic</button></ng-template>
          <ng-template #item><button jigButton kind="text">Underline</button></ng-template>
        </jig-toolbar-region>
        <jig-toolbar-region #region placement="end">
          <ng-template #item><button jigButton kind="primary">Save</button></ng-template>
        </jig-toolbar-region>
      </jig-toolbar>
    </jig-docs-playground>
  `,
})
export class JigDocsToolbarPlayground {
  private readonly _componentToolbar = viewChild.required('ref', { read: JigToolbar });
  private readonly _componentRegions = viewChildren('region', { read: JigToolbarRegion });
  protected readonly component = computed(() => [this._componentToolbar()]);
  protected readonly regions = computed(() => [...this._componentRegions()]);
}
