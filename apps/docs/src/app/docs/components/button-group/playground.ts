import { Component, computed, viewChild, viewChildren } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigButtonGroup } from '@awdlab/jig/button-group';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-button-group-playground',
  imports: [JigButton, JigButtonGroup, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigButtonGroup', component: component() }]">
      <jig-button-group #ref class="flex-1">
        <button #ref2 kind="primary" ngnButton>Button 1</button>
        <button #ref2 kind="primary" ngnButton>Button 2</button>
        <button #ref2 kind="primary" ngnButton>Button 3</button>
      </jig-button-group>
    </jig-docs-playground>
  `,
})
export class JigDocsButtonGroupPlayground {
  private readonly _componentButtonGroup = viewChild.required('ref', { read: JigButtonGroup });
  private readonly _componentButtons = viewChildren('ref2', { read: JigButton });
  protected readonly component = computed(() => [
    this._componentButtonGroup(),
    ...this._componentButtons(),
  ]);
}
