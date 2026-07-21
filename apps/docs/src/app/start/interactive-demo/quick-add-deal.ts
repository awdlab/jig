import { Component, output, signal } from '@angular/core';
import { form, FormField, min, required } from '@angular/forms/signals';
import { NgnButton } from '@ngneers/controls/button';
import { NgnCalendar } from '@ngneers/controls/calendar';
import { NgnErrors } from '@ngneers/controls/errors';
import { NgnHint } from '@ngneers/controls/hint';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnNumberInput } from '@ngneers/controls/number-input';
import { NgnSelect } from '@ngneers/controls/select';
import { NgnSelectButton } from '@ngneers/controls/select-button';

import {
  type DealDraft,
  type DealPriority,
  OWNER_OPTIONS,
  OWNERS,
  PRIORITY_OPTIONS,
  STAGE_OPTIONS,
  type OpportunityStatus,
} from './data';

/** The form model — `value` is nullable while the field is empty. */
interface DealForm {
  account: string;
  value: number | null;
  stage: OpportunityStatus;
  owner: string;
  closeDate: Date | null;
  priority: DealPriority;
}

@Component({
  selector: 'ngn-docs-quick-add-deal',
  imports: [
    FormField,
    NgnButton,
    NgnCalendar,
    NgnErrors,
    NgnHint,
    NgnInput,
    NgnInputField,
    NgnNumberInput,
    NgnSelect,
    NgnSelectButton,
  ],
  template: `
    <h3
      class="mb-(--ngn-size-padding-lg) text-(length:--ngn-font-size-lg) font-(--ngn-font-weight-semibold) text-(--ngn-color-text)"
    >
      Quick Add Deal
    </h3>

    <div>
      <ngn-input-field class="block" label="Account Name">
        <input
          ngnInput
          [formField]="dealForm.account"
          ngnErrors
          [ngnErrorsHint]="accountHint"
          ngnErrorsShowOn="touched"
          placeholder="Acme Inc."
        />
      </ngn-input-field>
      <ngn-hint #accountHint class="mt-(--ngn-size-padding-sm)" />
    </div>

    <div>
      <ngn-input-field class="block" label="Deal Value">
        <input
          ngnNumberInput
          [formField]="dealForm.value"
          ngnErrors
          [ngnErrorsHint]="valueHint"
          ngnErrorsShowOn="touched"
          [formatOptions]="currencyFormat"
          placeholder="50000"
        />
      </ngn-input-field>
      <ngn-hint #valueHint class="mt-(--ngn-size-padding-sm)" />
    </div>

    <ngn-input-field class="block" label="Stage">
      <ngn-select [options]="stageOptions" [formField]="dealForm.stage" />
    </ngn-input-field>

    <ngn-input-field class="block" label="Owner">
      <ngn-select [options]="ownerOptions" [formField]="dealForm.owner" />
    </ngn-input-field>

    <div class="mb-(--ngn-size-padding-lg)">
      <ngn-input-field class="block" label="Close Date">
        <ngn-calendar
          [formField]="dealForm.closeDate"
          ngnErrors
          [ngnErrorsHint]="closeDateHint"
          ngnErrorsShowOn="touched"
        />
      </ngn-input-field>
      <ngn-hint #closeDateHint class="mt-(--ngn-size-padding-sm)" />
    </div>

    <label
      [for]="priorityBtn.inputId()"
      class="mb-(--ngn-size-padding-sm) block text-(length:--ngn-font-size-sm) font-(--ngn-font-weight-semibold) text-(--ngn-color-surface-600)"
    >
      Priority
    </label>
    <ngn-select-button
      #priorityBtn
      class="mb-(--ngn-size-padding-lg) block"
      [options]="priorityOptions"
      [formField]="dealForm.priority"
    />

    <button ngnButton kind="primary" class="w-full justify-center" (click)="submit()">
      Add Deal
    </button>
  `,
})
export class QuickAddDeal {
  protected readonly stageOptions = STAGE_OPTIONS;
  protected readonly ownerOptions = OWNER_OPTIONS;
  protected readonly priorityOptions = PRIORITY_OPTIONS;
  protected readonly currencyFormat: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  };

  /** Signal-forms model — the single source of truth the form writes back into. */
  private readonly model = signal<DealForm>(this.emptyDeal());

  /** Real client-side validators driven by Angular signal forms. */
  protected readonly dealForm = form(this.model, path => {
    required(path.account, { message: 'Enter an account name.' });
    required(path.value, { message: 'Enter a deal value.' });
    required(path.closeDate, { message: 'Enter a close date.' });
    min(path.value, 1, { message: 'Deal value must be greater than 0.' });
  });

  /** Emitted when a valid deal is submitted. */
  public readonly add = output<DealDraft>();

  protected submit(): void {
    if (this.dealForm().invalid()) {
      // Reveal every field's errors on a failed submit.
      this.dealForm().markAsTouched();
      return;
    }
    const draft = this.model();
    this.add.emit({ ...draft, value: draft.value ?? 0 });
    this.reset();
  }

  private reset(): void {
    this.model.set(this.emptyDeal());
    this.dealForm().reset();
  }

  private emptyDeal(): DealForm {
    return {
      account: '',
      value: null,
      stage: 'Discovery',
      owner: OWNERS[0].owner,
      closeDate: null,
      priority: 'medium',
    };
  }
}
