import { Component, computed, viewChild, viewChildren } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { NgnButtonGroup } from '@awdlab/jig/button-group';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-button-group-playground',
  imports: [NgnButton, NgnButtonGroup, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnButtonGroup', component: component() }]">
      <awd-button-group #ref class="flex-1">
        <button #ref2 kind="primary" ngnButton>Button 1</button>
        <button #ref2 kind="primary" ngnButton>Button 2</button>
        <button #ref2 kind="primary" ngnButton>Button 3</button>
      </awd-button-group>
    </awd-docs-playground>
  `,
})
export class NgnDocsButtonGroupPlayground {
  private readonly _componentButtonGroup = viewChild.required('ref', { read: NgnButtonGroup });
  private readonly _componentButtons = viewChildren('ref2', { read: NgnButton });
  protected readonly component = computed(() => [
    this._componentButtonGroup(),
    ...this._componentButtons(),
  ]);
}
