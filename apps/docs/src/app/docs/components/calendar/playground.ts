import { Component, viewChild } from '@angular/core';
import { NgnCalendar } from '@awdlab/jig/calendar';
import { NgnInputField } from '@awdlab/jig/input-field';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-calendar-playground',
  imports: [NgnCalendar, NgnInputField, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnCalendar', component: component() }]">
      <awd-input-field>
        <awd-calendar #ref />
      </awd-input-field>
    </awd-docs-playground>
  `,
})
export class NgnDocsCalendarPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnCalendar });
}
