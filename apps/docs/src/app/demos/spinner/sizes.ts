import { Component } from '@angular/core';
import { NgnSpinner } from '@ngneers/controls/spinner';

@Component({
  selector: 'ngn-demo-spinner-sizes',
  imports: [NgnSpinner],
  template: `
    <div style="display: flex; gap: 1rem; align-items: center;">
      <ngn-spinner [size]="16" />
      <ngn-spinner [size]="24" />
      <ngn-spinner [size]="32" />
      <ngn-spinner [size]="48" />
      <ngn-spinner [size]="64" />
    </div>
  `,
})
export class Demo_Spinner_Sizes {}
