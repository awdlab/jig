import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnSpinner } from '@ngneers/controls/spinner';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-spinner-thickness',
  imports: [NgnSpinner],
  template: `
    <div style="display: flex; gap: 1rem; align-items: center;">
      <ngn-spinner [size]="48" thickness="2px" />
      <ngn-spinner [size]="48" thickness="4px" />
      <ngn-spinner [size]="48" thickness="6px" />
      <ngn-spinner [size]="48" thickness="8px" />
    </div>
  `,
})
export class Demo_Spinner_Thickness {}
