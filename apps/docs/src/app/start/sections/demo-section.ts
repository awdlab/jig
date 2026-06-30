import { Component } from '@angular/core';
import tablerBriefcase from '@iconify/icons-tabler/briefcase';
import tablerChartBar from '@iconify/icons-tabler/chart-bar';
import tablerClipboardList from '@iconify/icons-tabler/clipboard-list';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnTab, NgnTabs } from '@ngneers/controls/tabs';

import { SalesCrm } from '../dashboard/sales-crm';

@Component({
  selector: 'ngn-docs-demo-section',
  imports: [NgnIcon, NgnTabs, NgnTab, SalesCrm],
  template: `
    <section class="px-(--ngn-size-padding-xl) py-8">
      <div class="mx-auto max-w-[1100px]">
        <div class="card overflow-hidden shadow-(--ngn-shadow-md)">
          <ngn-tabs>
            <ngn-tab tabId="sales-crm">
              <ng-template #header>
                <span class="flex items-center gap-(--ngn-size-padding-sm)">
                  <ngn-icon [icon]="briefcaseIcon" /> Sales CRM
                </span>
              </ng-template>
              <ng-template #content>
                <ngn-docs-sales-crm />
              </ng-template>
            </ngn-tab>

            <ngn-tab tabId="analytics">
              <ng-template #header>
                <span class="flex items-center gap-(--ngn-size-padding-sm)">
                  <ngn-icon [icon]="chartIcon" /> Analytics Dashboard
                </span>
              </ng-template>
              <ng-template #content>
                <div
                  class="p-12 text-center text-(length:--ngn-font-size-md) text-(--ngn-color-surface-500)"
                >
                  Analytics Dashboard — coming soon.
                </div>
              </ng-template>
            </ngn-tab>

            <ngn-tab tabId="project-board">
              <ng-template #header>
                <span class="flex items-center gap-(--ngn-size-padding-sm)">
                  <ngn-icon [icon]="clipboardIcon" /> Project Board
                </span>
              </ng-template>
              <ng-template #content>
                <div
                  class="p-12 text-center text-(length:--ngn-font-size-md) text-(--ngn-color-surface-500)"
                >
                  Project Board — coming soon.
                </div>
              </ng-template>
            </ngn-tab>
          </ngn-tabs>
        </div>
      </div>
    </section>
  `,
})
export class NgnDocsDemoSection {
  protected readonly briefcaseIcon = tablerBriefcase;
  protected readonly chartIcon = tablerChartBar;
  protected readonly clipboardIcon = tablerClipboardList;
}
