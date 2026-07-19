import { Component } from '@angular/core';
import tablerBriefcase from '@iconify/icons-tabler/briefcase';
import tablerClipboardList from '@iconify/icons-tabler/clipboard-list';
import tablerLock from '@iconify/icons-tabler/lock';
import tablerMessageCircle from '@iconify/icons-tabler/message-circle';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnTab, NgnTabs } from '@ngneers/controls/tabs';

import { SalesCrm } from '../interactive-demo/sales-crm';
import { TeamChat } from '../interactive-demo/team-chat';

@Component({
  selector: 'ngn-docs-demo-section',
  imports: [NgnIcon, NgnTabs, NgnTab, SalesCrm, TeamChat],
  template: `
    <section class="px-(--ngn-size-padding-xl) py-8">
      <div class="mx-auto max-w-[1360px]">
        <div class="card overflow-hidden shadow-(--ngn-shadow-lg)">
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
          <!-- 54rem min-height fits the Sales CRM at desktop width without scrolling, and keeps a
               constant section height across tabs. It's a MIN so when the CRM reflows to a taller
               single column at narrow widths the body grows instead of showing a scrollbar. Team
               Chat needs a definite height for its splitter (its panes scroll internally). -->
          <ngn-tabs>
            <ngn-tab tabId="sales-crm">
              <ng-template #header>
                <span class="flex items-center gap-(--ngn-size-padding-sm)">
                  <ngn-icon [icon]="briefcaseIcon" /> Sales CRM
                </span>
              </ng-template>
              <ng-template #content>
                <div class="min-h-[54rem]">
                  <ngn-docs-sales-crm />
                </div>
              </ng-template>
            </ngn-tab>

            <ngn-tab tabId="team-chat">
              <ng-template #header>
                <span class="flex items-center gap-(--ngn-size-padding-sm)">
                  <ngn-icon [icon]="chatIcon" /> Team Chat
                </span>
              </ng-template>
              <ng-template #content>
                <div class="h-[54rem]">
                  <ngn-docs-team-chat />
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
                  class="flex min-h-[54rem] items-center justify-center text-(length:--ngn-font-size-md) text-(--ngn-color-surface-500)"
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
  protected readonly chatIcon = tablerMessageCircle;
  protected readonly clipboardIcon = tablerClipboardList;
  protected readonly lockIcon = tablerLock;
}
