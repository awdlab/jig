import { Component, signal } from '@angular/core';
import { NgnTabs, NgnTab } from '@ngneers/controls/tabs';

@Component({
  imports: [NgnTabs, NgnTab],
  selector: 'ngn-demo-tabs-navigation',
  template: `
    <!-- Contentless tabs act as a navigation bar. Drive selection off the URL
         via [activeTab] and react to clicks via (activeTabChange). In a real app
         you'd bind (activeTabChange) to router.navigate() and place a
         <router-outlet /> below instead of the panel here. -->
    <ngn-tabs [activeTab]="active()" (activeTabChange)="active.set($event)">
      <ngn-tab tabId="overview">
        <ng-template #header> Overview </ng-template>
      </ngn-tab>
      <ngn-tab tabId="settings">
        <ng-template #header> Settings </ng-template>
      </ngn-tab>
      <ngn-tab tabId="billing">
        <ng-template #header> Billing </ng-template>
      </ngn-tab>
    </ngn-tabs>

    <p>
      Active route: <code>/{{ active() }}</code>
    </p>
  `,
})
export class Demo_Tabs_Navigation {
  protected readonly active = signal('overview');
}
