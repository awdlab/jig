import { Component } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { NgnTabs, NgnTab } from '@awdlab/jig/tabs';

@Component({
  imports: [NgnTabs, NgnTab, NgnButton],
  selector: 'awd-demo-tabs-base',
  template: `
    <awd-tabs>
      <ng-template #headerLeft>
        <button ngnButton ngnButtonInline kind="icon">➕</button>
      </ng-template>
      <ng-template #headerRight>
        <button ngnButton ngnButtonInline kind="icon">🗑️</button>
      </ng-template>
      @for (item of tabs; track $index) {
        <awd-tab [tabId]="'tab' + item">
          <ng-template #header> Tab {{ item }} </ng-template>
          <ng-template #content> Content {{ item }} </ng-template>
        </awd-tab>
      }
    </awd-tabs>
  `,
})
export class Demo_Tabs_CustomHeader {
  protected readonly tabs = [1, 2, 3, 4, 5];
}
