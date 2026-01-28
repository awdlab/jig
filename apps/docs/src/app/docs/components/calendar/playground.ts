import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { NgnCalendar } from '@ngneers/controls/calendar';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnCalendar, NgnDocsPlayground],
  template: `
    <ngn-docs-playground componentName="NgnCalendar" [component]="component()">
      <ngn-calendar #ref [value]="value()" (valueChange)="value.set($event)" />
    </ngn-docs-playground>
  `,
})
export class NgnDocsCalendarPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnCalendar });
  protected readonly value = signal<Date | null>(new Date());
}
