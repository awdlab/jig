import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnTabs, NgnTab } from '@ngneers/controls/tabs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnTabs, NgnTab, NgnButton],
  selector: 'ngn-demo-tabs-base',
  template: `
    <ngn-tabs>
      <ng-template #headerLeft>
        <button ngnButton inline kind="icon">➕</button>
      </ng-template>
      <ng-template #headerRight>
        <button ngnButton inline kind="icon">🗑️</button>
      </ng-template>
      @for (item of tabs; track $index) {
        <ngn-tab [tabId]="'tab' + item">
          <ng-template #header> Tab {{ item }} </ng-template>
          <ng-template #content> Content {{ item }} </ng-template>
        </ngn-tab>
      }
    </ngn-tabs>
  `,
})
export class Demo_Tabs_CustomHeader {
  protected readonly tabs = [1, 2, 3, 4, 5];
}
