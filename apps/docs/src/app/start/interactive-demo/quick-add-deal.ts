import { Component, output, signal } from '@angular/core';
import { form, FormField, min, required } from '@angular/forms/signals';
import { JigButton } from '@awdlab/jig/button';
import { JigCalendar } from '@awdlab/jig/calendar';
import { JigErrors } from '@awdlab/jig/errors';
import { JigHint } from '@awdlab/jig/hint';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigNumberInput } from '@awdlab/jig/number-input';
import { JigSelect } from '@awdlab/jig/select';
import { JigSelectButton } from '@awdlab/jig/select-button';

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
  selector: 'jig-docs-quick-add-deal',
  imports: [
    FormField,
    JigButton,
    JigCalendar,
    JigErrors,
    JigHint,
    JigInput,
    JigInputField,
    JigNumberInput,
    JigSelect,
    JigSelectButton,
  ],
  template: `
    <h3
      class="mb-(--jig-size-padding-lg) text-(length:--jig-font-size-lg) font-(--jig-font-weight-semibold) text-(--jig-color-text)"
    >
      Quick Add Deal
    </h3>

    <div>
      <jig-input-field class="block" label="Account Name">
        <input
          jigInput
          [formField]="dealForm.account"
          jigErrors
          [jigErrorsHint]="accountHint"
          jigErrorsShowOn="touched"
          placeholder="Acme Inc."
        />
      </jig-input-field>
      <jig-hint #accountHint class="mt-(--jig-size-padding-sm)" />
    </div>

    <div>
      <jig-input-field class="block" label="Deal Value">
        <input
          jigNumberInput
          [formField]="dealForm.value"
          jigErrors
          [jigErrorsHint]="valueHint"
          jigErrorsShowOn="touched"
          [formatOptions]="currencyFormat"
          placeholder="50000"
        />
      </jig-input-field>
      <jig-hint #valueHint class="mt-(--jig-size-padding-sm)" />
    </div>

    <jig-input-field class="block" label="Stage">
      <jig-select [options]="stageOptions" [formField]="dealForm.stage" />
    </jig-input-field>

    <jig-input-field class="block" label="Owner">
      <jig-select [options]="ownerOptions" [formField]="dealForm.owner" />
    </jig-input-field>

    <div class="mb-(--jig-size-padding-lg)">
      <jig-input-field class="block" label="Close Date">
        <jig-calendar
          [formField]="dealForm.closeDate"
          jigErrors
          [jigErrorsHint]="closeDateHint"
          jigErrorsShowOn="touched"
        />
      </jig-input-field>
      <jig-hint #closeDateHint class="mt-(--jig-size-padding-sm)" />
    </div>

    <label
      [for]="priorityBtn.inputId()"
      class="mb-(--jig-size-padding-sm) block text-(length:--jig-font-size-sm) font-(--jig-font-weight-semibold) text-(--jig-color-surface-600)"
    >
      Priority
    </label>
    <jig-select-button
      #priorityBtn
      class="mb-(--jig-size-padding-lg) block"
      [options]="priorityOptions"
      [formField]="dealForm.priority"
    />

    <button jigButton kind="primary" class="w-full justify-center" (click)="submit()">
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
