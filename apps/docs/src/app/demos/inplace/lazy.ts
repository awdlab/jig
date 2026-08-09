import { Component } from '@angular/core';
import { NgnTemplate } from '@awdlab/jig/api/ng';
import { NgnButton } from '@awdlab/jig/button';
import { NgnInplace } from '@awdlab/jig/inplace';

@Component({
  imports: [NgnInplace, NgnTemplate, NgnButton],
  selector: 'awd-demo-inplace-lazy',
  template: `
    <awd-inplace #inplace [lazy]="true" [cache]="true">
      <ng-template #display>Show Details</ng-template>
      <ng-template #content [ngnTemplate]="inplace.templateTypes.content" let-content>
        <div class="flex items-center gap-2">
          <span>Built on first open (lazy), kept in the DOM afterwards (cache).</span>
          <button ngnButton kind="icon" (click)="content.close()">x</button>
        </div>
      </ng-template>
    </awd-inplace>
  `,
})
export class Demo_Inplace_Lazy {}
