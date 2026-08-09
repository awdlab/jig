import { Component, computed, signal } from '@angular/core';
import { AwdStepper, AwdStep } from '@awdlab/jig/stepper';
import { AwdButton } from '@awdlab/jig/button';

@Component({
  selector: 'jig-demo-stepper-linear',
  imports: [AwdStepper, AwdStep, AwdButton],
  template: `
    <jig-stepper [linear]="true" [active]="active()" (activeChange)="active.set($event)">
      <jig-step [label]="'Terms'" [completed]="termsAccepted()">
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
      </jig-step>
      <jig-step [label]="'Review'" [completed]="active() > 1">
        <ng-template #content>Everything looks good — review your details.</ng-template>
      </jig-step>
      <jig-step [label]="'Done'" [completed]="active() > 2">
        <ng-template #content>All set! 🎉</ng-template>
      </jig-step>
    </jig-stepper>

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
