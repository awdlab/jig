import { Component, signal } from '@angular/core';
import { AwdTemplate } from '@awdlab/jig/api/ng';
import { AwdButton } from '@awdlab/jig/button';
import { AwdInplace } from '@awdlab/jig/inplace';

@Component({
  imports: [AwdInplace, AwdTemplate, AwdButton],
  selector: 'jig-demo-inplace-toggling',
  template: `
    <div class="flex flex-col gap-3">
      <div class="flex flex-wrap gap-2">
        <button ngnButton (click)="inplace.switchToContent()">Show</button>
        <button ngnButton (click)="inplace.switchToDisplay()">Hide</button>
        <button ngnButton (click)="inplace.toggle()">Toggle</button>
      </div>

      <jig-inplace #inplace [(contentVisible)]="visible">
        <ng-template #display>Show Details</ng-template>
        <ng-template #content [ngnTemplate]="inplace.templateTypes.content" let-content>
          <div class="flex items-center gap-2">
            <span>These are so many details!</span>
            <button ngnButton kind="icon" (click)="content.close()">x</button>
          </div>
        </ng-template>
      </jig-inplace>

      <span class="text-sm opacity-70">contentVisible = {{ visible() }}</span>
    </div>
  `,
})
export class Demo_Inplace_Toggling {
  protected readonly visible = signal(false);
}
