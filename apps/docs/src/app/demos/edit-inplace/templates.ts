import { Component, signal } from '@angular/core';
import { NgnTemplate } from '@awdlab/jig/api/ng';
import { NgnEditInplace } from '@awdlab/jig/edit-inplace';

@Component({
  imports: [NgnEditInplace, NgnTemplate],
  selector: 'awd-demo-inplace-templates',
  template: ` <awd-edit-inplace #inplace [value]="value()" (valueChange)="value.set($event)">
    <ng-template #display [ngnTemplate]="inplace.templateTypes.display" let-display>
      <span
        class="bg-primary-100 text-primary-800 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
      >
        {{ display.value || 'Click to set a label' }}
      </span>
    </ng-template>

    <ng-template #edit [ngnTemplate]="inplace.templateTypes.edit" let-edit>
      <div class="flex items-center gap-2">
        <input
          class="border-surface-300 rounded border px-2 py-1 text-sm"
          [value]="edit.value"
          (input)="edit.update($any($event.target).value)"
          (keydown.enter)="edit.close()"
        />
        <button class="text-primary-600 text-sm" type="button" (click)="edit.close()">Done</button>
      </div>
    </ng-template>
  </awd-edit-inplace>`,
  host: { style: 'display: block; width: 260px;' },
})
export class Demo_EditInplace_Templates {
  public readonly value = signal('Priority');
}
