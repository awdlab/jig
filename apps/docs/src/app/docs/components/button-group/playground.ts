import { Component, computed, viewChild, viewChildren } from '@angular/core';
import { AwdButton } from '@awdlab/jig/button';
import { AwdButtonGroup } from '@awdlab/jig/button-group';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-button-group-playground',
  imports: [AwdButton, AwdButtonGroup, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdButtonGroup', component: component() }]">
      <jig-button-group #ref class="flex-1">
        <button #ref2 kind="primary" ngnButton>Button 1</button>
        <button #ref2 kind="primary" ngnButton>Button 2</button>
        <button #ref2 kind="primary" ngnButton>Button 3</button>
      </jig-button-group>
    </jig-docs-playground>
  `,
})
export class AwdDocsButtonGroupPlayground {
  private readonly _componentButtonGroup = viewChild.required('ref', { read: AwdButtonGroup });
  private readonly _componentButtons = viewChildren('ref2', { read: AwdButton });
  protected readonly component = computed(() => [
    this._componentButtonGroup(),
    ...this._componentButtons(),
  ]);
}
