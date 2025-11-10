import { Component, computed, signal } from '@angular/core';
import { NgnTabs, NgnTab } from '@ngneers/controls/tabs';

@Component({
  imports: [NgnTabs, NgnTab],
  selector: 'ngn-demo-tabs-dynamic',
  template: `
    <ngn-tabs>
      @for (tab of tabs(); track tab; let index = $index) {
        <ngn-tab [tabId]="'tab' + index">
          <ng-template #header> {{ tab }} </ng-template>
          <ng-template #content> Content for {{ tab }} </ng-template>
        </ngn-tab>
      }
    </ngn-tabs>
    <button (click)="count.set(count() + 1)">Add Tab</button>
    <button (click)="count.set(count() - 1)">Remove Tab</button>
  `,
})
export class Demo_Tabs_Dynamic {
  protected readonly count = signal(4);
  protected readonly tabs = computed(() =>
    Array.from({ length: this.count() }, (_, i) => `Tab ${i + 1}`)
  );
}
