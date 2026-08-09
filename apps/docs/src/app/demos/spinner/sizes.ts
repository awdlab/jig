import { Component } from '@angular/core';
import { AwdSpinner } from '@awdlab/jig/spinner';

@Component({
  selector: 'jig-demo-spinner-sizes',
  imports: [AwdSpinner],
  template: `
    <div style="display: flex; gap: 1rem; align-items: center;">
      <jig-spinner [size]="16" />
      <jig-spinner [size]="24" />
      <jig-spinner [size]="32" />
      <jig-spinner [size]="48" />
      <jig-spinner [size]="64" />
    </div>
  `,
})
export class Demo_Spinner_Sizes {}
