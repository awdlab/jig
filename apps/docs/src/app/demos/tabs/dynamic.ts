import { Component, computed, signal } from '@angular/core';
import { AwdButton } from '@awdlab/jig/button';
import { AwdTabs, AwdTab } from '@awdlab/jig/tabs';

@Component({
  imports: [AwdTabs, AwdTab, AwdButton],
  selector: 'jig-demo-tabs-dynamic',
  template: `
    <jig-tabs>
      @for (tab of tabs(); track tab; let index = $index) {
        <jig-tab [tabId]="'tab' + index">
          <ng-template #header> {{ tab }} </ng-template>
          <ng-template #content> Content for {{ tab }} </ng-template>
        </jig-tab>
      }
    </jig-tabs>
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
