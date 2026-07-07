import { Component, computed, signal } from '@angular/core';
import { NgnCalendar } from '@ngneers/controls/calendar';
import { NgnErrors } from '@ngneers/controls/errors';
import { NgnHint } from '@ngneers/controls/hint';
import { NgnInputField } from '@ngneers/controls/input-field';

@Component({
  selector: 'ngn-demo-calendar-validation',
  imports: [NgnCalendar, NgnErrors, NgnHint, NgnInputField],
  template: `
    <ngn-input-field [label]="'Due date'" [labelKind]="'on'" class="w-64">
      <ngn-calendar
        [value]="value()"
        (valueChange)="value.set($event)"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="dateHint"
      />
    </ngn-input-field>
    <ngn-hint #dateHint />
  `,
})
export class Demo_Calendar_Validation {
  protected readonly value = signal<Date | null>(null);
  protected readonly errors = computed(() =>
    this.value() ? null : { required: 'Choose a due date' }
  );
}
