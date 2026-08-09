import { Component, signal } from '@angular/core';
import tablerBriefcase from '@iconify/icons-tabler/briefcase';
import tablerClipboardList from '@iconify/icons-tabler/clipboard-list';
import tablerLock from '@iconify/icons-tabler/lock';
import tablerMessageCircle from '@iconify/icons-tabler/message-circle';
import tablerSettings from '@iconify/icons-tabler/settings';
import { NgnAvatar } from '@awdlab/jig/avatar';
import { NgnBadge } from '@awdlab/jig/badge';
import { NgnIcon } from '@awdlab/jig/icon';
import { NgnTooltip } from '@awdlab/jig/tooltip';

import { NgnDocsLoginDialog } from '../interactive-demo/login-dialog';
import { ProjectBoard } from '../interactive-demo/project-board';
import { SalesCrm } from '../interactive-demo/sales-crm';
import { TeamChat } from '../interactive-demo/team-chat';

type DemoId = 'sales-crm' | 'team-chat' | 'project-board';

@Component({
  selector: 'awd-docs-demo-section',
  imports: [
    NgnAvatar,
    NgnBadge,
    NgnIcon,
    NgnTooltip,
    NgnDocsLoginDialog,
    SalesCrm,
    TeamChat,
    ProjectBoard,
  ],
  template: `
    <section class="px-(--awd-size-padding-xl) py-8">
      <div class="mx-auto max-w-[1360px]">
        <div class="card overflow-hidden shadow-(--awd-shadow-lg)">
          <!-- Browser chrome -->
          <div
            class="flex items-center gap-(--awd-size-padding-md) border-b border-(--awd-color-surface-200) bg-(--awd-color-surface-50) px-(--awd-size-padding-lg) py-(--awd-size-padding-sm)"
          >
            <span aria-hidden="true" class="flex gap-(--awd-size-padding-sm)">
              <span class="size-3 rounded-full bg-[#f87171]"></span>
              <span class="size-3 rounded-full bg-[#fbbf24]"></span>
              <span class="size-3 rounded-full bg-[#34d399]"></span>
            </span>
            <span
              class="mx-auto flex items-center gap-(--awd-size-padding-sm) rounded-(--awd-size-rounded-md) bg-(--awd-color-surface-100) px-(--awd-size-padding-lg) py-1.5 font-mono text-(length:--awd-font-size-xs) text-(--awd-color-surface-500)"
            >
              <awd-icon [icon]="lockIcon" /> app.jig.awdlab.dev
            </span>
            <span aria-hidden="true" class="w-12"></span>
          </div>

          <!-- App body: left icon rail switches the demo, panel renders the active one.
               On mobile the rail collapses to a horizontal strip on top so the panel gets the
               full viewport width instead of a 279px squeeze. -->
          <div class="flex min-h-[54rem] max-md:min-h-[36rem] max-md:flex-col">
            <nav
              class="flex w-16 shrink-0 flex-col items-center gap-(--awd-size-padding-sm) border-r border-(--awd-color-surface-200) bg-(--awd-color-surface-50) py-(--awd-size-padding-lg) max-md:w-full max-md:flex-row max-md:justify-start max-md:gap-(--awd-size-padding-xs) max-md:overflow-x-auto max-md:border-r-0 max-md:border-b max-md:px-(--awd-size-padding-md) max-md:py-(--awd-size-padding-sm)"
              role="tablist"
              aria-orientation="vertical"
              aria-label="Demo app"
              (keydown)="onRailKeydown($event)"
            >
              <span
                aria-hidden="true"
                class="mb-(--awd-size-padding-md) flex size-10 items-center justify-center rounded-[38%] bg-[linear-gradient(135deg,var(--awd-color-primary-400),var(--awd-color-primary-600))] text-(length:--awd-font-size-lg) font-(--awd-font-weight-bold) text-(--awd-color-primary-50) shadow-(--awd-shadow-sm)"
              >
                n
              </span>

              @for (d of demos; track d.id) {
                <button
                  type="button"
                  role="tab"
                  [id]="'demo-tab-' + d.id"
                  [attr.aria-selected]="active() === d.id"
                  aria-controls="demo-panel"
                  [tabindex]="active() === d.id ? 0 : -1"
                  [ngnTooltip]="d.label"
                  ngnTooltipPlacement="right"
                  class="relative flex size-11 items-center justify-center rounded-(--awd-size-rounded-lg) text-(length:--awd-font-size-lg) transition-colors"
                  [class]="
                    active() === d.id
                      ? 'bg-(--awd-color-primary-100) text-(--awd-color-primary-600)'
                      : 'text-(--awd-color-surface-500) hover:bg-(--awd-color-surface-100) hover:text-(--awd-color-text)'
                  "
                  (click)="active.set(d.id)"
                >
                  @if (active() === d.id) {
                    <span
                      aria-hidden="true"
                      class="absolute top-1/2 left-[-0.625rem] h-6 w-1 -translate-y-1/2 rounded-r-full bg-(--awd-color-primary-500) max-md:hidden"
                    ></span>
                  }
                  <awd-icon [icon]="d.icon" />
                </button>
              }

              <span class="grow"></span>

              <button
                type="button"
                aria-label="Settings"
                ngnTooltip="Settings"
                ngnTooltipPlacement="right"
                tabindex="-1"
                class="flex size-11 items-center justify-center rounded-(--awd-size-rounded-lg) text-(length:--awd-font-size-lg) text-(--awd-color-surface-500) transition-colors hover:bg-(--awd-color-surface-100) hover:text-(--awd-color-text)"
              >
                <awd-icon [icon]="settingsIcon" />
              </button>
              <button
                type="button"
                aria-label="Account"
                ngnTooltip="Account"
                ngnTooltipPlacement="right"
                tabindex="-1"
                class="relative mt-(--awd-size-padding-sm) rounded-full transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--awd-color-primary-500)"
                (click)="openLogin()"
              >
                <span
                  class="inline-flex"
                  ngnBadgeDot
                  ngnBadgeCircular
                  ngnBadgePosition="bottom-end"
                  ngnBadgeColor="var(--awd-color-success-500)"
                >
                  <awd-avatar initials="YO" bgColor="#c99a2e" [size]="34" />
                </span>
              </button>
            </nav>

            <!-- 54rem min-height fits the Sales CRM at desktop width without scrolling and keeps a
                 constant section height across demos. It's a MIN so when the CRM reflows to a taller
                 single column at narrow widths the body grows instead of showing a scrollbar. Team
                 Chat needs a definite height for its splitter (its panes scroll internally). -->
            <div
              class="min-w-0 grow"
              role="tabpanel"
              id="demo-panel"
              [attr.aria-labelledby]="'demo-tab-' + active()"
            >
              @switch (active()) {
                @case ('sales-crm') {
                  <div class="min-h-[54rem] max-md:min-h-[36rem]">
                    <awd-docs-sales-crm />
                  </div>
                }
                @case ('team-chat') {
                  <div class="h-[54rem] max-md:h-[36rem]"><awd-docs-team-chat /></div>
                }
                @case ('project-board') {
                  <!-- Deferred so the board's heavier control set (tree, drawer, accordion,
                       upload, filter, slider…) stays out of the eager startpage bundle. -->
                  @defer (when active() === 'project-board') {
                    <div class="h-[54rem] max-md:h-[36rem]">
                      <awd-docs-project-board />
                    </div>
                  } @placeholder {
                    <div class="h-[54rem] max-md:h-[36rem]"></div>
                  }
                }
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Deferred so the dialog/otp/spinner/input-field controls stay out of the eager
           startpage bundle; they load on first avatar click. -->
      @defer (when loginOpen()) {
        <awd-docs-login-dialog [(open)]="loginOpen" />
      }
    </section>
  `,
})
export class NgnDocsDemoSection {
  protected readonly lockIcon = tablerLock;
  protected readonly settingsIcon = tablerSettings;

  /** Drives both the `@defer` trigger and the login dialog's open state. */
  protected readonly loginOpen = signal(false);

  protected openLogin(): void {
    this.loginOpen.set(true);
  }

  protected readonly demos = [
    { id: 'sales-crm', label: 'Sales CRM', icon: tablerBriefcase },
    { id: 'team-chat', label: 'Team Chat', icon: tablerMessageCircle },
    { id: 'project-board', label: 'Project Board', icon: tablerClipboardList },
  ] as const satisfies readonly { id: DemoId; label: string; icon: unknown }[];

  protected readonly active = signal<DemoId>('sales-crm');

  /** Vertical tablist keyboard nav: arrows move + activate, Home/End jump to ends. */
  protected onRailKeydown(event: KeyboardEvent): void {
    const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(event.key)) {
      return;
    }
    event.preventDefault();
    const ids = this.demos.map(d => d.id);
    const current = ids.indexOf(this.active());
    let next = current;
    switch (event.key) {
      case 'ArrowDown':
        next = (current + 1) % ids.length;
        break;
      case 'ArrowUp':
        next = (current - 1 + ids.length) % ids.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = ids.length - 1;
        break;
    }
    const nextId = ids[next]!;
    this.active.set(nextId);
    queueMicrotask(() => document.getElementById(`demo-tab-${nextId}`)?.focus());
  }
}
