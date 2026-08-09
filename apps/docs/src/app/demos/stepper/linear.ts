import { Component, computed, signal } from '@angular/core';
import { NgnStepper, NgnStep } from '@awdlab/jig/stepper';
import { NgnButton } from '@awdlab/jig/button';

@Component({
  selector: 'awd-demo-stepper-linear',
  imports: [NgnStepper, NgnStep, NgnButton],
  template: `
    <awd-stepper [linear]="true" [active]="active()" (activeChange)="active.set($event)">
      <awd-step [label]="'Terms'" [completed]="termsAccepted()">
        <ng-template #content>
          <p class="mb-3">
            Accept the terms to continue. Once you do, later steps unlock and become clickable in
            the header; in linear mode you still can't jump past an incomplete step.
          </p>
          <button
            ngnButton
            kind="secondary"
            (click)="termsAccepted.set(true)"
            [disabled]="termsAccepted()"
          >
            {{ termsAccepted() ? 'Terms accepted ✓' : 'Accept terms' }}
          </button>
        </ng-template>
      </awd-step>
      <awd-step [label]="'Review'" [completed]="active() > 1">
        <ng-template #content>Everything looks good — review your details.</ng-template>
      </awd-step>
      <awd-step [label]="'Done'" [completed]="active() > 2">
        <ng-template #content>All set! 🎉</ng-template>
      </awd-step>
    </awd-stepper>

    <div class="flex gap-2">
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
        [disabled]="active() === 2 || !canAdvance()"
      >
        Next
      </button>
    </div>
  `,
})
export class Demo_Stepper_Linear {
  protected readonly active = signal(0);
  protected readonly termsAccepted = signal(false);
  /** The current step's gate — only the first step requires accepting the terms. */
  protected readonly canAdvance = computed(() => this.active() !== 0 || this.termsAccepted());
}
