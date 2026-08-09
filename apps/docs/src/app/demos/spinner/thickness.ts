import { Component } from '@angular/core';
import { JigSpinner } from '@awdlab/jig/spinner';

@Component({
  selector: 'jig-demo-spinner-thickness',
  imports: [JigSpinner],
  template: `
    <div style="display: flex; gap: 1rem; align-items: center;">
      <jig-spinner [size]="48" thickness="2px" />
      <jig-spinner [size]="48" thickness="4px" />
      <jig-spinner [size]="48" thickness="6px" />
      <jig-spinner [size]="48" thickness="8px" />
    </div>
  `,
})
export class Demo_Spinner_Thickness {}
