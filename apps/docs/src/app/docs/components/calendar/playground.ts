import { Component, viewChild } from '@angular/core';
import { AwdCalendar } from '@awdlab/jig/calendar';
import { AwdInputField } from '@awdlab/jig/input-field';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-calendar-playground',
  imports: [AwdCalendar, AwdInputField, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdCalendar', component: component() }]">
      <jig-input-field>
        <jig-calendar #ref />
      </jig-input-field>
    </jig-docs-playground>
  `,
})
export class AwdDocsCalendarPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdCalendar });
}
