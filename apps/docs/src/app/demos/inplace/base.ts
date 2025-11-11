import { Component } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnButton } from '@ngneers/controls/button';
import { NgnInplace } from '@ngneers/controls/inplace';

@Component({
  imports: [NgnInplace, NgnTemplate, NgnButton],
  selector: 'ngn-demo-inplace-base',
  template: ` <ngn-inplace #inplace>
    <ng-template #display>Show Details</ng-template>
    <ng-template #content [ngnTemplate]="inplace.templateTypes.content" let-content>
      <div class="flex gap-2 items-center">
        <span>These are so many details!</span>
        <button ngnButton [kind]="'icon'" (click)="content.close()">x</button>
      </div>
    </ng-template>
  </ngn-inplace>`,
})
export class Demo_Inplace_Base {}
