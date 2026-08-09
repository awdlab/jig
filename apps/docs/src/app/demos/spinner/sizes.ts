import { Component } from '@angular/core';
import { NgnSpinner } from '@awdlab/jig/spinner';

@Component({
  selector: 'awd-demo-spinner-sizes',
  imports: [NgnSpinner],
  template: `
    <div style="display: flex; gap: 1rem; align-items: center;">
      <awd-spinner [size]="16" />
      <awd-spinner [size]="24" />
      <awd-spinner [size]="32" />
      <awd-spinner [size]="48" />
      <awd-spinner [size]="64" />
    </div>
  `,
})
export class Demo_Spinner_Sizes {}
