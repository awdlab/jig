import { Component, viewChild } from '@angular/core';
import { JigCalendar } from '@awdlab/jig/calendar';
import { JigInputField } from '@awdlab/jig/input-field';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-calendar-playground',
  imports: [JigCalendar, JigInputField, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigCalendar', component: component() }]">
      <jig-input-field>
        <jig-calendar #ref />
      </jig-input-field>
    </jig-docs-playground>
  `,
})
export class JigDocsCalendarPlayground {
  protected readonly component = viewChild.required('ref', { read: JigCalendar });
}
