import { Component } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigTabs, JigTab } from '@awdlab/jig/tabs';

@Component({
  imports: [JigTabs, JigTab, JigButton],
  selector: 'jig-demo-tabs-base',
  template: `
    <jig-tabs>
      <ng-template #headerLeft>
        <button ngnButton ngnButtonInline kind="icon">➕</button>
      </ng-template>
      <ng-template #headerRight>
        <button ngnButton ngnButtonInline kind="icon">🗑️</button>
      </ng-template>
      @for (item of tabs; track $index) {
        <jig-tab [tabId]="'tab' + item">
          <ng-template #header> Tab {{ item }} </ng-template>
          <ng-template #content> Content {{ item }} </ng-template>
        </jig-tab>
      }
    </jig-tabs>
  `,
})
export class Demo_Tabs_CustomHeader {
  protected readonly tabs = [1, 2, 3, 4, 5];
}
