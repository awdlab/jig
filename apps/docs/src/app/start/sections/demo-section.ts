import { Component, signal } from '@angular/core';
import tablerBriefcase from '@iconify/icons-tabler/briefcase';
import tablerClipboardList from '@iconify/icons-tabler/clipboard-list';
import tablerLock from '@iconify/icons-tabler/lock';
import tablerMessageCircle from '@iconify/icons-tabler/message-circle';
import tablerSettings from '@iconify/icons-tabler/settings';
import { NgnAvatar } from '@ngneers/controls/avatar';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnTooltip } from '@ngneers/controls/tooltip';

import { NgnDocsLoginDialog } from '../interactive-demo/login-dialog';
import { ProjectBoard } from '../interactive-demo/project-board';
import { SalesCrm } from '../interactive-demo/sales-crm';
import { TeamChat } from '../interactive-demo/team-chat';

type DemoId = 'sales-crm' | 'team-chat' | 'project-board';

@Component({
  selector: 'ngn-docs-demo-section',
  imports: [NgnAvatar, NgnIcon, NgnTooltip, NgnDocsLoginDialog, SalesCrm, TeamChat, ProjectBoard],
  template: `
    <section class="px-(--ngn-size-padding-xl) py-8">
      <div class="mx-auto max-w-[1360px]">
        <div class="card overflow-hidden shadow-(--ngn-shadow-lg)">
          <!-- Browser chrome -->
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

          <!-- App body: left icon rail switches the demo, panel renders the active one. -->
          <div class="flex min-h-[54rem]">
            <nav
              class="flex w-16 shrink-0 flex-col items-center gap-(--ngn-size-padding-sm) border-r border-(--ngn-color-surface-200) bg-(--ngn-color-surface-50) py-(--ngn-size-padding-lg)"
              role="tablist"
              aria-orientation="vertical"
              aria-label="Demo app"
              (keydown)="onRailKeydown($event)"
            >
              <span
                aria-hidden="true"
                class="mb-(--ngn-size-padding-md) flex size-10 items-center justify-center rounded-[38%] bg-[linear-gradient(135deg,var(--ngn-color-primary-400),var(--ngn-color-primary-600))] text-(length:--ngn-font-size-lg) font-(--ngn-font-weight-bold) text-(--ngn-color-primary-50) shadow-(--ngn-shadow-sm)"
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
                  class="relative flex size-11 items-center justify-center rounded-(--ngn-size-rounded-lg) text-(length:--ngn-font-size-lg) transition-colors"
                  [class]="
                    active() === d.id
                      ? 'bg-(--ngn-color-primary-100) text-(--ngn-color-primary-600)'
                      : 'text-(--ngn-color-surface-500) hover:bg-(--ngn-color-surface-100) hover:text-(--ngn-color-text)'
                  "
                  (click)="active.set(d.id)"
                >
                  @if (active() === d.id) {
                    <span
                      aria-hidden="true"
                      class="absolute top-1/2 left-[-0.625rem] h-6 w-1 -translate-y-1/2 rounded-r-full bg-(--ngn-color-primary-500)"
                    ></span>
                  }
                  <ngn-icon [icon]="d.icon" />
                </button>
              }

              <span class="grow"></span>

              <button
                type="button"
                aria-label="Settings"
                ngnTooltip="Settings"
                ngnTooltipPlacement="right"
                tabindex="-1"
                class="flex size-11 items-center justify-center rounded-(--ngn-size-rounded-lg) text-(length:--ngn-font-size-lg) text-(--ngn-color-surface-500) transition-colors hover:bg-(--ngn-color-surface-100) hover:text-(--ngn-color-text)"
              >
                <ngn-icon [icon]="settingsIcon" />
              </button>
              <button
                type="button"
                aria-label="Account"
                ngnTooltip="Account"
                ngnTooltipPlacement="right"
                tabindex="-1"
                class="relative mt-(--ngn-size-padding-sm) rounded-full transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ngn-color-primary-500)"
                (click)="openLogin()"
              >
                <ngn-avatar initials="YO" bgColor="#c99a2e" [size]="34" />
                <span
                  aria-hidden="true"
                  class="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full bg-[#22c55e] ring-2 ring-(--ngn-color-surface-50)"
                ></span>
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
                  <div class="min-h-[54rem]"><ngn-docs-sales-crm /></div>
                }
                @case ('team-chat') {
                  <div class="h-[54rem]"><ngn-docs-team-chat /></div>
                }
                @case ('project-board') {
                  <!-- Deferred so the board's heavier control set (tree, drawer, accordion,
                       upload, filter, slider…) stays out of the eager startpage bundle. -->
                  @defer (when active() === 'project-board') {
                    <div class="h-[54rem]"><ngn-docs-project-board /></div>
                  } @placeholder {
                    <div class="h-[54rem]"></div>
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
        <ngn-docs-login-dialog [(open)]="loginOpen" />
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
