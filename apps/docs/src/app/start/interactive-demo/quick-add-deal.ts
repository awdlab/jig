import { Component, output, signal } from '@angular/core';
import { form, FormField, min, required } from '@angular/forms/signals';
import { NgnButton } from '@awdlab/jig/button';
import { NgnCalendar } from '@awdlab/jig/calendar';
import { NgnErrors } from '@awdlab/jig/errors';
import { NgnHint } from '@awdlab/jig/hint';
import { NgnInput } from '@awdlab/jig/input';
import { NgnInputField } from '@awdlab/jig/input-field';
import { NgnNumberInput } from '@awdlab/jig/number-input';
import { NgnSelect } from '@awdlab/jig/select';
import { NgnSelectButton } from '@awdlab/jig/select-button';

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
  selector: 'awd-docs-quick-add-deal',
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
      class="mb-(--awd-size-padding-lg) text-(length:--awd-font-size-lg) font-(--awd-font-weight-semibold) text-(--awd-color-text)"
    >
      Quick Add Deal
    </h3>

    <div>
      <awd-input-field class="block" label="Account Name">
        <input
          ngnInput
          [formField]="dealForm.account"
          ngnErrors
          [ngnErrorsHint]="accountHint"
          ngnErrorsShowOn="touched"
          placeholder="Acme Inc."
        />
      </awd-input-field>
      <awd-hint #accountHint class="mt-(--awd-size-padding-sm)" />
    </div>

    <div>
      <awd-input-field class="block" label="Deal Value">
        <input
          ngnNumberInput
          [formField]="dealForm.value"
          ngnErrors
          [ngnErrorsHint]="valueHint"
          ngnErrorsShowOn="touched"
          [formatOptions]="currencyFormat"
          placeholder="50000"
        />
      </awd-input-field>
      <awd-hint #valueHint class="mt-(--awd-size-padding-sm)" />
    </div>

    <awd-input-field class="block" label="Stage">
      <awd-select [options]="stageOptions" [formField]="dealForm.stage" />
    </awd-input-field>

    <awd-input-field class="block" label="Owner">
      <awd-select [options]="ownerOptions" [formField]="dealForm.owner" />
    </awd-input-field>

    <div class="mb-(--awd-size-padding-lg)">
      <awd-input-field class="block" label="Close Date">
        <awd-calendar
          [formField]="dealForm.closeDate"
          ngnErrors
          [ngnErrorsHint]="closeDateHint"
          ngnErrorsShowOn="touched"
        />
      </awd-input-field>
      <awd-hint #closeDateHint class="mt-(--awd-size-padding-sm)" />
    </div>

    <label
      [for]="priorityBtn.inputId()"
      class="mb-(--awd-size-padding-sm) block text-(length:--awd-font-size-sm) font-(--awd-font-weight-semibold) text-(--awd-color-surface-600)"
    >
      Priority
    </label>
    <awd-select-button
      #priorityBtn
      class="mb-(--awd-size-padding-lg) block"
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
