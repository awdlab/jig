import { Component } from '@angular/core';
import { JigTemplate } from '@awdlab/jig/api/ng';
import { JigButton } from '@awdlab/jig/button';
import { JigInplace } from '@awdlab/jig/inplace';

@Component({
  imports: [JigInplace, JigTemplate, JigButton],
  selector: 'jig-demo-inplace-lazy',
  template: `
    <jig-inplace #inplace [lazy]="true" [cache]="true">
      <ng-template #display>Show Details</ng-template>
      <ng-template #content [jigTemplate]="inplace.templateTypes.content" let-content>
        <div class="flex items-center gap-2">
          <span>Built on first open (lazy), kept in the DOM afterwards (cache).</span>
          <button jigButton kind="icon" (click)="content.close()">x</button>
        </div>
      </ng-template>
    </jig-inplace>
  `,
})
export class Demo_Inplace_Lazy {}
