import { Component, signal } from '@angular/core';
import { AwdTree } from '@awdlab/jig/tree';

import { fileTree } from './sample-data';

@Component({
  imports: [AwdTree],
  selector: 'jig-demo-tree-events',
  template: `
    <jig-tree
      [items]="items"
      [selectable]="true"
      [value]="value()"
      (valueChange)="value.set($event)"
      [(expandedValues)]="expanded"
      (itemClicked)="lastClicked.set($event)"
      style="display: block; height: 260px;"
    />
    <dl
      style="margin-top: 0.75rem; display: grid; grid-template-columns: auto 1fr; gap: 0.25rem 1rem;"
    >
      <dt>Selected value</dt>
      <dd>
        <strong>{{ value() ?? '—' }}</strong>
      </dd>
      <dt>Last itemClicked</dt>
      <dd>
        <strong>{{ lastClicked() ?? '—' }}</strong>
      </dd>
      <dt>Expanded</dt>
      <dd>
        <strong>{{ expanded().join(', ') || '—' }}</strong>
      </dd>
    </dl>
  `,
})
export class Demo_Tree_Events {
  protected readonly items = fileTree;
  protected readonly value = signal<string | null>(null);
  protected readonly lastClicked = signal<string | null>(null);
  protected readonly expanded = signal<string[]>(['src']);
}
