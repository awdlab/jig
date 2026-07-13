import { Component, signal } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnButton } from '@ngneers/controls/button';
import { NgnInplace } from '@ngneers/controls/inplace';

@Component({
  imports: [NgnInplace, NgnTemplate, NgnButton],
  selector: 'ngn-demo-inplace-toggling',
  template: `
    <div class="flex flex-col gap-3">
      <div class="flex flex-wrap gap-2">
        <button ngnButton (click)="inplace.switchToContent()">Show</button>
        <button ngnButton (click)="inplace.switchToDisplay()">Hide</button>
        <button ngnButton (click)="inplace.toggle()">Toggle</button>
      </div>

      <ngn-inplace #inplace [(contentVisible)]="visible">
        <ng-template #display>Show Details</ng-template>
        <ng-template #content [ngnTemplate]="inplace.templateTypes.content" let-content>
          <div class="flex items-center gap-2">
            <span>These are so many details!</span>
            <button ngnButton kind="icon" (click)="content.close()">x</button>
          </div>
        </ng-template>
      </ngn-inplace>

      <span class="text-sm opacity-70">contentVisible = {{ visible() }}</span>
    </div>
  `,
})
export class Demo_Inplace_Toggling {
  protected readonly visible = signal(false);
}
