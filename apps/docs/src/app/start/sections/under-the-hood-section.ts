import { Component, signal } from '@angular/core';
import { type BreadcrumbItem, NgnBreadcrumb } from '@awdlab/jig/breadcrumb';
import { NgnButton } from '@awdlab/jig/button';
import { NgnDialog } from '@awdlab/jig/dialog';
import { NgnInputField } from '@awdlab/jig/input-field';
import { NgnSelect } from '@awdlab/jig/select';
import { NgnSelectButton } from '@awdlab/jig/select-button';

import { NgnDocsReveal } from './reveal';
import { NgnDocsSectionHeader } from './section-header';

@Component({
  selector: 'awd-docs-under-the-hood-section',
  imports: [
    NgnBreadcrumb,
    NgnButton,
    NgnDialog,
    NgnInputField,
    NgnSelect,
    NgnSelectButton,
    NgnDocsReveal,
    NgnDocsSectionHeader,
  ],
  host: { class: 'block px-(--awd-size-padding-xl) py-12 lg:py-16' },
  template: `
    <div [ngnDocsReveal]="0" class="mx-auto max-w-[1100px]">
      <awd-docs-section-header
        class="mb-8 lg:mb-12"
        eyebrow="Under the hood"
        heading="Let the browser do it"
        subtitle="Native where the platform is strong. Ours where it isn't — so you never wire it yourself."
      />

      <div class="grid grid-cols-1 gap-(--awd-size-padding-lg) lg:grid-cols-2">
        <div
          class="rounded-(--awd-size-rounded-lg) border border-(--awd-color-surface-200) bg-(--awd-color-surface-25) p-(--awd-size-padding-xl)"
        >
          <p
            class="mono flex items-center gap-(--awd-size-padding-sm) text-(length:--awd-font-size-sm) text-(--awd-color-success-600)"
          >
            <span class="size-1.5 rounded-full bg-(--awd-color-success-500)"></span>
            platform native
          </p>
          <h3
            class="mt-(--awd-size-padding-md) mb-(--awd-size-padding-sm) text-(length:--awd-font-size-lg) font-(--awd-font-weight-bold) text-(--awd-color-text)"
          >
            Dialogs in the top layer
          </h3>
          <p
            class="mb-(--awd-size-padding-xl) text-(length:--awd-font-size-sm) text-(--awd-color-surface-600)"
          >
            Opened with <code>showModal()</code>: focus trap, <code>::backdrop</code>, Esc to close
            and correct stacking all come from the browser. No z-index wars, no portals.
          </p>
          <button ngnButton kind="primary" (click)="dialogOpen.set(true)">Open dialog</button>
        </div>

        <div
          class="rounded-(--awd-size-rounded-lg) border border-(--awd-color-surface-200) bg-(--awd-color-surface-25) p-(--awd-size-padding-xl)"
        >
          <p
            class="mono flex items-center gap-(--awd-size-padding-sm) text-(length:--awd-font-size-sm) text-(--awd-color-success-600)"
          >
            <span class="size-1.5 rounded-full bg-(--awd-color-success-500)"></span>
            platform native
          </p>
          <h3
            class="mt-(--awd-size-padding-md) mb-(--awd-size-padding-sm) text-(length:--awd-font-size-lg) font-(--awd-font-weight-bold) text-(--awd-color-text)"
          >
            Popovers, natively
          </h3>
          <p
            class="mb-(--awd-size-padding-xl) text-(length:--awd-font-size-sm) text-(--awd-color-surface-600)"
          >
            Selects, menus and tooltips ride the Popover API — light dismiss, top-layer stacking and
            Shadow DOM support without an overlay engine.
          </p>
          <awd-input-field label="Owner" class="max-w-[16rem]">
            <awd-select [options]="owners" [(value)]="owner" />
          </awd-input-field>
        </div>

        <div
          class="rounded-(--awd-size-rounded-lg) border border-(--awd-color-surface-200) bg-(--awd-color-surface-25) p-(--awd-size-padding-xl)"
        >
          <p
            class="mono flex items-center gap-(--awd-size-padding-sm) text-(length:--awd-font-size-sm) text-(--awd-color-primary-500)"
          >
            <span class="size-1.5 rounded-full bg-(--awd-color-primary-500)"></span>
            we built it for you
          </p>
          <h3
            class="mt-(--awd-size-padding-md) mb-(--awd-size-padding-sm) text-(length:--awd-font-size-lg) font-(--awd-font-weight-bold) text-(--awd-color-text)"
          >
            Overflow that handles itself
          </h3>
          <p
            class="mb-(--awd-size-padding-lg) text-(length:--awd-font-size-sm) text-(--awd-color-surface-600)"
          >
            Chips collapse into a counter and breadcrumbs fold into a menu — measured per container,
            not per viewport. No media queries. Drag the width down and watch.
          </p>
          <awd-select-button
            aria-label="Container width"
            [options]="widths"
            [value]="widthPct()"
            (valueChange)="widthPct.set($event)"
          />
          <div
            class="mt-(--awd-size-padding-lg) flex flex-col gap-(--awd-size-padding-md) rounded-(--awd-size-rounded-md) border border-dashed border-(--awd-color-surface-300) p-(--awd-size-padding-md) transition-[width] duration-300"
            [style.width.%]="widthPct()"
          >
            <awd-input-field>
              <awd-select
                aria-label="Teams"
                [multiple]="true"
                [options]="teams"
                [(value)]="selectedTeams"
              />
            </awd-input-field>
            <awd-breadcrumb [items]="crumbs" />
          </div>
        </div>

        <div
          class="rounded-(--awd-size-rounded-lg) border border-(--awd-color-surface-200) bg-(--awd-color-surface-25) p-(--awd-size-padding-xl)"
        >
          <p
            class="mono flex items-center gap-(--awd-size-padding-sm) text-(length:--awd-font-size-sm) text-(--awd-color-primary-500)"
          >
            <span class="size-1.5 rounded-full bg-(--awd-color-primary-500)"></span>
            we built it for you
          </p>
          <h3
            class="mt-(--awd-size-padding-md) mb-(--awd-size-padding-sm) text-(length:--awd-font-size-lg) font-(--awd-font-weight-bold) text-(--awd-color-text)"
          >
            Server-rendered, flash-free
          </h3>
          <p
            class="mb-(--awd-size-padding-lg) text-(length:--awd-font-size-sm) text-(--awd-color-surface-600)"
          >
            Controls render fully styled on the server — your theme's colors and control styles are
            in the first byte, so there is no unstyled flash and no client round-trip. This page
            arrived that way.
          </p>
          <div
            class="mono rounded-(--awd-size-rounded-md) border border-(--awd-color-surface-200) bg-(--awd-color-surface-50) p-(--awd-size-padding-lg) text-(length:--awd-font-size-sm) text-(--awd-color-surface-600)"
          >
            <p class="text-(--awd-color-text)">&lt;html&gt; from the server</p>
            <p>├ theme variables + control styles</p>
            <p>├ real content, real ARIA, no JS</p>
            <p>└ hydrates into the same DOM</p>
          </div>
        </div>
      </div>
    </div>

    <awd-dialog [(open)]="dialogOpen" [modal]="true" title="Native dialog">
      <p class="max-w-[42ch] text-(--awd-color-text)">
        This is a real <code>&lt;dialog&gt;</code> in the browser's top layer. Tab stays inside, Esc
        closes it, and focus returns to the button you came from.
      </p>
    </awd-dialog>
  `,
})
export class NgnDocsUnderTheHoodSection {
  protected readonly dialogOpen = signal(false);

  protected readonly owners = [
    { value: 'ada', label: 'Ada Lovelace' },
    { value: 'grace', label: 'Grace Hopper' },
    { value: 'alan', label: 'Alan Turing' },
  ];
  protected readonly owner = signal<string | null>('ada');

  protected readonly widths = [
    { label: '45%', value: 45 },
    { label: '70%', value: 70 },
    { label: '100%', value: 100 },
  ];
  protected readonly widthPct = signal(100);

  protected readonly teams = [
    { value: 'design', label: 'Design' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'product', label: 'Product' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'support', label: 'Support' },
  ];
  protected readonly selectedTeams = signal<string[]>([
    'design',
    'engineering',
    'product',
    'marketing',
    'sales',
    'support',
  ]);

  protected readonly crumbs: BreadcrumbItem[] = [
    { label: 'Home', id: 'home', callback: () => {} },
    { label: 'Workspace', id: 'workspace', callback: () => {} },
    { label: 'Projects', id: 'projects', callback: () => {} },
    { label: 'Controls', id: 'controls', callback: () => {} },
    { label: 'Overview', id: 'overview', callback: () => {} },
  ];
}
