import { Component, computed, signal } from '@angular/core';
import { AwdCalendar } from '@awdlab/jig/calendar';
import { AwdErrors } from '@awdlab/jig/errors';
import { AwdHint } from '@awdlab/jig/hint';
import { AwdInputField } from '@awdlab/jig/input-field';

@Component({
  selector: 'jig-demo-calendar-validation',
  imports: [AwdCalendar, AwdErrors, AwdHint, AwdInputField],
  template: `
    <jig-input-field [label]="'Due date'" [labelKind]="'on'" class="w-64">
      <jig-calendar
        [value]="value()"
        (valueChange)="value.set($event)"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="dateHint"
      />
    </jig-input-field>
    <jig-hint #dateHint />
  `,
})
export class Demo_Calendar_Validation {
  protected readonly value = signal<Date | null>(null);
  protected readonly errors = computed(() =>
    this.value() ? null : { required: 'Choose a due date' }
  );
}
