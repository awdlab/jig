import { Component, viewChild } from '@angular/core';
import { JigCalendar } from '@awdlab/jig/calendar';
import { JigInputField } from '@awdlab/jig/input-field';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-calendar-playground',
  imports: [JigCalendar, JigInputField, JigDocsPlayground],
  template: `
    <jig-docs-playground
      #playground
      [controls]="[{ componentName: 'JigCalendar', component: component() }]"
    >
      @if (playground.values().JigCalendar?.inline) {
        <jig-calendar #ref />
      } @else {
        <jig-input-field [label]="'Date'">
          <jig-calendar #ref />
        </jig-input-field>
      }
    </jig-docs-playground>
  `,
})
export class JigDocsCalendarPlayground {
  protected readonly component = viewChild('ref', { read: JigCalendar });
}
