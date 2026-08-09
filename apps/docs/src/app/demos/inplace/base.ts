import { Component } from '@angular/core';
import { AwdTemplate } from '@awdlab/jig/api/ng';
import { AwdButton } from '@awdlab/jig/button';
import { AwdInplace } from '@awdlab/jig/inplace';

@Component({
  imports: [AwdInplace, AwdTemplate, AwdButton],
  selector: 'jig-demo-inplace-base',
  template: ` <jig-inplace #inplace>
    <ng-template #display>Show Details</ng-template>
    <ng-template #content [ngnTemplate]="inplace.templateTypes.content" let-content>
      <div class="flex items-center gap-2">
        <span>These are so many details!</span>
        <button ngnButton kind="icon" (click)="content.close()">x</button>
      </div>
    </ng-template>
  </jig-inplace>`,
})
export class Demo_Inplace_Base {}
