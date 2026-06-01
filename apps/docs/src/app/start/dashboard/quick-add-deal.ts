import { ChangeDetectionStrategy, Component, computed, output, signal } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnCalendar } from '@ngneers/controls/calendar';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';
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

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-docs-quick-add-deal',
  imports: [NgnButton, NgnCalendar, NgnInput, NgnInputField, NgnSelect, NgnSelectButton],
  template: `
    <h3
      class="mb-(--ngn-size-padding-lg) text-(length:--ngn-font-size-lg) font-(--ngn-font-weight-semibold) text-(--ngn-color-text)"
    >
      Quick Add Deal
    </h3>

    <ngn-input-field class="mb-(--ngn-size-padding-lg) block" label="Account Name">
      <input
        ngnInput
        placeholder="Acme Inc."
        [value]="account()"
        (valueChange)="account.set($event ?? '')"
      />
    </ngn-input-field>

    <ngn-input-field class="mb-(--ngn-size-padding-lg) block" label="Deal Value">
      <input
        ngnInput
        inputmode="numeric"
        placeholder="50000"
        [value]="value()"
        (valueChange)="value.set($event ?? '')"
      />
    </ngn-input-field>

    <ngn-input-field class="mb-(--ngn-size-padding-lg) block" label="Stage">
      <ngn-select [options]="stageOptions" [(value)]="stage" />
    </ngn-input-field>

    <ngn-input-field class="mb-(--ngn-size-padding-lg) block" label="Owner">
      <ngn-select [options]="ownerOptions" [(value)]="owner" />
    </ngn-input-field>

    <ngn-input-field class="mb-(--ngn-size-padding-lg) block" label="Close Date">
      <ngn-calendar [value]="closeDate()" (valueChange)="closeDate.set($event)" />
    </ngn-input-field>

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
      [(value)]="priority"
    />

    <button
      ngnButton
      kind="primary"
      class="w-full justify-center"
      [disabled]="!canSubmit()"
      (click)="submit()"
    >
      Add Deal
    </button>
  `,
})
export class QuickAddDeal {
  protected readonly stageOptions = STAGE_OPTIONS;
  protected readonly ownerOptions = OWNER_OPTIONS;
  protected readonly priorityOptions = PRIORITY_OPTIONS;

  protected readonly account = signal('');
  protected readonly value = signal('');
  protected readonly stage = signal<OpportunityStatus>('Discovery');
  protected readonly owner = signal<string>(OWNERS[0].owner);
  protected readonly closeDate = signal<Date | null>(null);
  protected readonly priority = signal<DealPriority>('medium');

  /** Emitted when a valid deal is submitted. */
  public readonly add = output<DealDraft>();

  protected readonly parsedValue = computed(() => Number(this.value().replace(/[^0-9.]/g, '')));
  protected readonly canSubmit = computed(
    () => this.account().trim().length > 0 && this.parsedValue() > 0
  );

  protected submit(): void {
    if (!this.canSubmit()) {
      return;
    }
    this.add.emit({
      account: this.account(),
      value: this.parsedValue(),
      stage: this.stage(),
      owner: this.owner(),
      closeDate: this.closeDate(),
      priority: this.priority(),
    });
    this.reset();
  }

  private reset(): void {
    this.account.set('');
    this.value.set('');
    this.stage.set('Discovery');
    this.owner.set(OWNERS[0].owner);
    this.closeDate.set(null);
    this.priority.set('medium');
  }
}
