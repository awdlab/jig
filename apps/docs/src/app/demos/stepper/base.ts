import { Component, signal } from '@angular/core';
import { AwdStepper, AwdStep } from '@awdlab/jig/stepper';
import { AwdButton } from '@awdlab/jig/button';

@Component({
  selector: 'jig-demo-stepper-base',
  imports: [AwdStepper, AwdStep, AwdButton],
  template: `
    <jig-stepper [active]="active()" (activeChange)="active.set($event)">
      <jig-step [label]="'Account'" [completed]="active() > 0">
        <ng-template #content>Create your account.</ng-template>
      </jig-step>
      <jig-step [label]="'Profile'" [completed]="active() > 1">
        <ng-template #content>Fill in your profile.</ng-template>
      </jig-step>
      <jig-step [label]="'Done'" [completed]="active() > 2">
        <ng-template #content>All set!</ng-template>
      </jig-step>
    </jig-stepper>
    <div class="mt-4 flex justify-between gap-2">
      <button
        ngnButton
        kind="secondary"
        (click)="active.set(active() - 1)"
        [disabled]="active() === 0"
      >
        Back
      </button>
      <button
        ngnButton
        kind="primary"
        (click)="active.set(active() + 1)"
        [disabled]="active() === 2"
      >
        Next
      </button>
    </div>
  `,
})
export class Demo_Stepper_Base {
  protected readonly active = signal(0);
}
