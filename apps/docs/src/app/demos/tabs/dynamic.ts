import { Component, computed, signal } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { NgnTabs, NgnTab } from '@awdlab/jig/tabs';

@Component({
  imports: [NgnTabs, NgnTab, NgnButton],
  selector: 'awd-demo-tabs-dynamic',
  template: `
    <awd-tabs>
      @for (tab of tabs(); track tab; let index = $index) {
        <awd-tab [tabId]="'tab' + index">
          <ng-template #header> {{ tab }} </ng-template>
          <ng-template #content> Content for {{ tab }} </ng-template>
        </awd-tab>
      }
    </awd-tabs>
    <button ngnButton (click)="count.set(count() + 1)">Add Tab</button>
    <button ngnButton (click)="count.set(count() - 1)">Remove Tab</button>
  `,
})
export class Demo_Tabs_Dynamic {
  protected readonly count = signal(4);
  protected readonly tabs = computed(() =>
    Array.from({ length: this.count() }, (_, i) => `Tab ${i + 1}`)
  );
}
