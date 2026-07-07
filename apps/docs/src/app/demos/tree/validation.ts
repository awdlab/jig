import { Component, computed, signal } from '@angular/core';
import { NgnErrors } from '@ngneers/controls/errors';
import { NgnHint } from '@ngneers/controls/hint';
import { NgnTree } from '@ngneers/controls/tree';

import { fileTree } from './sample-data';

@Component({
  selector: 'ngn-demo-tree-validation',
  imports: [NgnErrors, NgnHint, NgnTree],
  template: `
    <div class="flex flex-col gap-2">
      <ngn-tree
        class="block h-[260px]"
        [items]="items"
        [selectable]="true"
        [value]="value()"
        (valueChange)="value.set($event)"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="treeHint"
      />
      <ngn-hint #treeHint />
    </div>
  `,
})
export class Demo_Tree_Validation {
  protected readonly items = fileTree;
  protected readonly value = signal<string | null>(null);
  protected readonly errors = computed(() => (this.value() ? null : { required: 'Select a file' }));
}
