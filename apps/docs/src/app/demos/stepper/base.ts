import { Component, signal } from '@angular/core';
import { NgnStepper, NgnStep } from '@ngneers/controls/stepper';
import { NgnButton } from '@ngneers/controls/button';

@Component({
  selector: 'ngn-demo-stepper-base',
  imports: [NgnStepper, NgnStep, NgnButton],
  template: `
    <ngn-stepper [active]="active()" (activeChange)="active.set($event)">
      <ngn-step [label]="'Account'" [completed]="active() > 0">
        <ng-template #content>Create your account.</ng-template>
      </ngn-step>
      <ngn-step [label]="'Profile'" [completed]="active() > 1">
        <ng-template #content>Fill in your profile.</ng-template>
      </ngn-step>
      <ngn-step [label]="'Done'" [completed]="active() > 2">
        <ng-template #content>All set!</ng-template>
      </ngn-step>
    </ngn-stepper>
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
