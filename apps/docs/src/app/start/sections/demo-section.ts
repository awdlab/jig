import { Component } from '@angular/core';
import tablerBriefcase from '@iconify/icons-tabler/briefcase';
import tablerChartBar from '@iconify/icons-tabler/chart-bar';
import tablerClipboardList from '@iconify/icons-tabler/clipboard-list';
import tablerLock from '@iconify/icons-tabler/lock';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnTab, NgnTabs } from '@ngneers/controls/tabs';

import { SalesCrm } from '../dashboard/sales-crm';

@Component({
  selector: 'ngn-docs-demo-section',
  imports: [NgnIcon, NgnTabs, NgnTab, SalesCrm],
  template: `
    <section class="px-(--ngn-size-padding-xl) py-8">
      <div class="mx-auto max-w-[1100px]">
        <div class="card overflow-hidden shadow-(--ngn-shadow-lg)">
          <!-- Browser chrome: frames the demo as a real running app, so the live
               controls inside read as an application — not as page settings. -->
          <div
            class="flex items-center gap-(--ngn-size-padding-md) border-b border-(--ngn-color-surface-200) bg-(--ngn-color-surface-50) px-(--ngn-size-padding-lg) py-(--ngn-size-padding-sm)"
          >
            <span aria-hidden="true" class="flex gap-(--ngn-size-padding-sm)">
              <span class="size-3 rounded-full bg-[#f87171]"></span>
              <span class="size-3 rounded-full bg-[#fbbf24]"></span>
              <span class="size-3 rounded-full bg-[#34d399]"></span>
            </span>
            <span
              class="mx-auto flex items-center gap-(--ngn-size-padding-sm) rounded-(--ngn-size-rounded-md) bg-(--ngn-color-surface-100) px-(--ngn-size-padding-lg) py-1.5 font-mono text-(length:--ngn-font-size-xs) text-(--ngn-color-surface-500)"
            >
              <ngn-icon [icon]="lockIcon" /> app.ngneers.dev
            </span>
            <span aria-hidden="true" class="w-12"></span>
          </div>
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
  protected readonly lockIcon = tablerLock;
}
