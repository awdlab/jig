import { Component, computed, signal } from '@angular/core';
import { AwdErrors } from '@awdlab/jig/errors';
import { AwdHint } from '@awdlab/jig/hint';
import { AwdTree } from '@awdlab/jig/tree';

import { fileTree } from './sample-data';

@Component({
  selector: 'jig-demo-tree-validation',
  imports: [AwdErrors, AwdHint, AwdTree],
  template: `
    <div class="flex flex-col gap-2">
      <jig-tree
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
      <jig-hint #treeHint />
    </div>
  `,
})
export class Demo_Tree_Validation {
  protected readonly items = fileTree;
  protected readonly value = signal<string | null>(null);
  protected readonly errors = computed(() => (this.value() ? null : { required: 'Select a file' }));
}
