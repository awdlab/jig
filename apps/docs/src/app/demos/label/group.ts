import { Component, signal } from '@angular/core';
import { JigFor } from '@awdlab/jig/directives';
import { JigSelectButton } from '@awdlab/jig/select-button';

@Component({
  selector: 'jig-demo-label-group',
  imports: [JigFor, JigSelectButton],
  template: `
    <div class="flex flex-col gap-2">
      <label [jigFor]="view">View</label>
      <jig-select-button #view [options]="options" [(value)]="value" />
    </div>
  `,
})
export class Demo_Label_Group {
  protected readonly options = [
    { value: 'list', label: 'List' },
    { value: 'grid', label: 'Grid' },
    { value: 'board', label: 'Board' },
  ];
  protected readonly value = signal('grid');
}
