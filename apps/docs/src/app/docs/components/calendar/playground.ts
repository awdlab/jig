import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { NgnCalendar } from '@ngneers/controls/calendar';
import { NgnInputField } from '@ngneers/controls/input-field';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnCalendar, NgnInputField, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnCalendar', component: component() }]">
      <ngn-input-field>
        <ngn-calendar #ref />
      </ngn-input-field>
    </ngn-docs-playground>
  `,
})
export class NgnDocsCalendarPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnCalendar });
}
