import { Component, computed, viewChild, viewChildren } from '@angular/core';
import { JigStep, JigStepper } from '@awdlab/jig/stepper';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-stepper-playground',
  imports: [JigStepper, JigStep, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigStepper', component: component() }]">
      <jig-stepper #ref class="flex-1">
        <jig-step #ref2 [label]="'Account'">
          <ng-template #content>Create your account.</ng-template>
        </jig-step>
        <jig-step #ref2 [label]="'Profile'">
          <ng-template #content>Fill in your profile.</ng-template>
        </jig-step>
        <jig-step #ref2 [label]="'Done'">
          <ng-template #content>All set!</ng-template>
        </jig-step>
      </jig-stepper>
    </jig-docs-playground>
  `,
})
export class JigDocsStepperPlayground {
  private readonly _componentStepper = viewChild.required('ref', { read: JigStepper });
  private readonly _componentSteps = viewChildren('ref2', { read: JigStep });
  protected readonly component = computed(() => [
    this._componentStepper(),
    ...this._componentSteps(),
  ]);
}
