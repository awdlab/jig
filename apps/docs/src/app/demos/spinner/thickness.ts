import { Component } from '@angular/core';
import { NgnSpinner } from '@awdlab/jig/spinner';

@Component({
  selector: 'awd-demo-spinner-thickness',
  imports: [NgnSpinner],
  template: `
    <div style="display: flex; gap: 1rem; align-items: center;">
      <awd-spinner [size]="48" thickness="2px" />
      <awd-spinner [size]="48" thickness="4px" />
      <awd-spinner [size]="48" thickness="6px" />
      <awd-spinner [size]="48" thickness="8px" />
    </div>
  `,
})
export class Demo_Spinner_Thickness {}
