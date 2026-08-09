import { Component, signal } from '@angular/core';
import tablerBriefcase from '@iconify/icons-tabler/briefcase';
import tablerClipboardList from '@iconify/icons-tabler/clipboard-list';
import tablerLock from '@iconify/icons-tabler/lock';
import tablerMessageCircle from '@iconify/icons-tabler/message-circle';
import tablerSettings from '@iconify/icons-tabler/settings';
import { JigAvatar } from '@awdlab/jig/avatar';
import { JigBadge } from '@awdlab/jig/badge';
import { JigIcon } from '@awdlab/jig/icon';
import { JigTooltip } from '@awdlab/jig/tooltip';

import { JigDocsLoginDialog } from '../interactive-demo/login-dialog';
import { ProjectBoard } from '../interactive-demo/project-board';
import { SalesCrm } from '../interactive-demo/sales-crm';
import { TeamChat } from '../interactive-demo/team-chat';

type DemoId = 'sales-crm' | 'team-chat' | 'project-board';

@Component({
  selector: 'jig-docs-demo-section',
  imports: [
    JigAvatar,
    JigBadge,
    JigIcon,
    JigTooltip,
    JigDocsLoginDialog,
    SalesCrm,
    TeamChat,
    ProjectBoard,
  ],
  template: `
    <section class="px-(--jig-size-padding-xl) py-8">
      <div class="mx-auto max-w-[1360px]">
        <div class="card overflow-hidden shadow-(--jig-shadow-lg)">
          <!-- Browser chrome -->
          <div
            class="flex items-center gap-(--jig-size-padding-md) border-b border-(--jig-color-surface-200) bg-(--jig-color-surface-50) px-(--jig-size-padding-lg) py-(--jig-size-padding-sm)"
          >
            <span aria-hidden="true" class="flex gap-(--jig-size-padding-sm)">
              <span class="size-3 rounded-full bg-[#f87171]"></span>
              <span class="size-3 rounded-full bg-[#fbbf24]"></span>
              <span class="size-3 rounded-full bg-[#34d399]"></span>
            </span>
            <span
              class="mx-auto flex items-center gap-(--jig-size-padding-sm) rounded-(--jig-size-rounded-md) bg-(--jig-color-surface-100) px-(--jig-size-padding-lg) py-1.5 font-mono text-(length:--jig-font-size-xs) text-(--jig-color-surface-500)"
            >
              <jig-icon [icon]="lockIcon" /> app.jig.awdlab.dev
            </span>
            <span aria-hidden="true" class="w-12"></span>
          </div>

          <!-- App body: left icon rail switches the demo, panel renders the active one.
               On mobile the rail collapses to a horizontal strip on top so the panel gets the
               full viewport width instead of a 279px squeeze. -->
          <div class="flex min-h-[54rem] max-md:min-h-[36rem] max-md:flex-col">
            <nav
              class="flex w-16 shrink-0 flex-col items-center gap-(--jig-size-padding-sm) border-r border-(--jig-color-surface-200) bg-(--jig-color-surface-50) py-(--jig-size-padding-lg) max-md:w-full max-md:flex-row max-md:justify-start max-md:gap-(--jig-size-padding-xs) max-md:overflow-x-auto max-md:border-r-0 max-md:border-b max-md:px-(--jig-size-padding-md) max-md:py-(--jig-size-padding-sm)"
              role="tablist"
              aria-orientation="vertical"
              aria-label="Demo app"
              (keydown)="onRailKeydown($event)"
            >
              <span
                aria-hidden="true"
                class="mb-(--jig-size-padding-md) flex size-10 items-center justify-center rounded-[38%] bg-[linear-gradient(135deg,var(--jig-color-primary-400),var(--jig-color-primary-600))] text-(length:--jig-font-size-lg) font-(--jig-font-weight-bold) text-(--jig-color-primary-50) shadow-(--jig-shadow-sm)"
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
                  [jigTooltip]="d.label"
                  jigTooltipPlacement="right"
                  class="relative flex size-11 items-center justify-center rounded-(--jig-size-rounded-lg) text-(length:--jig-font-size-lg) transition-colors"
                  [class]="
                    active() === d.id
                      ? 'bg-(--jig-color-primary-100) text-(--jig-color-primary-600)'
                      : 'text-(--jig-color-surface-500) hover:bg-(--jig-color-surface-100) hover:text-(--jig-color-text)'
                  "
                  (click)="active.set(d.id)"
                >
                  @if (active() === d.id) {
                    <span
                      aria-hidden="true"
                      class="absolute top-1/2 left-[-0.625rem] h-6 w-1 -translate-y-1/2 rounded-r-full bg-(--jig-color-primary-500) max-md:hidden"
                    ></span>
                  }
                  <jig-icon [icon]="d.icon" />
                </button>
              }

              <span class="grow"></span>

              <button
                type="button"
                aria-label="Settings"
                jigTooltip="Settings"
                jigTooltipPlacement="right"
                tabindex="-1"
                class="flex size-11 items-center justify-center rounded-(--jig-size-rounded-lg) text-(length:--jig-font-size-lg) text-(--jig-color-surface-500) transition-colors hover:bg-(--jig-color-surface-100) hover:text-(--jig-color-text)"
              >
                <jig-icon [icon]="settingsIcon" />
              </button>
              <button
                type="button"
                aria-label="Account"
                jigTooltip="Account"
                jigTooltipPlacement="right"
                tabindex="-1"
                class="relative mt-(--jig-size-padding-sm) rounded-full transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--jig-color-primary-500)"
                (click)="openLogin()"
              >
                <span
                  class="inline-flex"
                  jigBadgeDot
                  jigBadgeCircular
                  jigBadgePosition="bottom-end"
                  jigBadgeColor="var(--jig-color-success-500)"
                >
                  <jig-avatar initials="YO" bgColor="#c99a2e" [size]="34" />
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
                    <jig-docs-sales-crm />
                  </div>
                }
                @case ('team-chat') {
                  <div class="h-[54rem] max-md:h-[36rem]"><jig-docs-team-chat /></div>
                }
                @case ('project-board') {
                  <!-- Deferred so the board's heavier control set (tree, drawer, accordion,
                       upload, filter, slider…) stays out of the eager startpage bundle. -->
                  @defer (when active() === 'project-board') {
                    <div class="h-[54rem] max-md:h-[36rem]">
                      <jig-docs-project-board />
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
        <jig-docs-login-dialog [(open)]="loginOpen" />
      }
    </section>
  `,
})
export class JigDocsDemoSection {
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
