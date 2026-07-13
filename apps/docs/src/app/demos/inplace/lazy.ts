import { Component } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnButton } from '@ngneers/controls/button';
import { NgnInplace } from '@ngneers/controls/inplace';

@Component({
  imports: [NgnInplace, NgnTemplate, NgnButton],
  selector: 'ngn-demo-inplace-lazy',
  template: `
    <ngn-inplace #inplace [lazy]="true" [cache]="true">
      <ng-template #display>Show Details</ng-template>
      <ng-template #content [ngnTemplate]="inplace.templateTypes.content" let-content>
        <div class="flex items-center gap-2">
          <span>Built on first open (lazy), kept in the DOM afterwards (cache).</span>
          <button ngnButton kind="icon" (click)="content.close()">x</button>
        </div>
      </ng-template>
    </ngn-inplace>
  `,
})
export class Demo_Inplace_Lazy {}
