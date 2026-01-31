import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { NgnCalendar } from '@ngneers/controls/calendar';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnCalendar, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnCalendar', component: component() }]">
      <ngn-calendar #ref />
    </ngn-docs-playground>
  `,
})
export class NgnDocsCalendarPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnCalendar });
}
