import { Component, computed, signal } from '@angular/core';
import { JigCalendar } from '@awdlab/jig/calendar';
import { JigErrors } from '@awdlab/jig/errors';
import { JigHint } from '@awdlab/jig/hint';
import { JigInputField } from '@awdlab/jig/input-field';

@Component({
  selector: 'jig-demo-calendar-validation',
  imports: [JigCalendar, JigErrors, JigHint, JigInputField],
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
