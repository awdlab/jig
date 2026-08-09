import { Component, computed, signal } from '@angular/core';
import { NgnCalendar } from '@awdlab/jig/calendar';
import { NgnErrors } from '@awdlab/jig/errors';
import { NgnHint } from '@awdlab/jig/hint';
import { NgnInputField } from '@awdlab/jig/input-field';

@Component({
  selector: 'awd-demo-calendar-validation',
  imports: [NgnCalendar, NgnErrors, NgnHint, NgnInputField],
  template: `
    <awd-input-field [label]="'Due date'" [labelKind]="'on'" class="w-64">
      <awd-calendar
        [value]="value()"
        (valueChange)="value.set($event)"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="dateHint"
      />
    </awd-input-field>
    <awd-hint #dateHint />
  `,
})
export class Demo_Calendar_Validation {
  protected readonly value = signal<Date | null>(null);
  protected readonly errors = computed(() =>
    this.value() ? null : { required: 'Choose a due date' }
  );
}
