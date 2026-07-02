import { Component, signal } from '@angular/core';
import { NgnSlider } from '@ngneers/controls/slider';

import { NgnDocsSectionShell } from './section-shell';
import { style } from '../../utils/code/prism';

const EXAMPLE_CODE = `import { Component, signal } from '@angular/core';
import { NgnSlider } from '@ngneers/controls/slider';

@Component({
  selector: 'app-volume',
  imports: [NgnSlider],
  template: \`
    <ngn-slider [min]="0" [max]="100" [(value)]="volume" />
    <p>volume = {{ volume() }}</p>
  \`,
})
export class VolumeComponent {
  protected readonly volume = signal(50);
}`;

@Component({
  selector: 'ngn-docs-quick-start-section',
  imports: [NgnDocsSectionShell, NgnSlider],
  template: `
    <ngn-docs-section-shell
      layout="split-left"
      eyebrow="Quick start"
      heading="So simple to use"
      subtitle="Import a control, bind your signal, ship. No boilerplate, no ceremony."
    >
      <div primary>
        <p
          class="mb-(--ngn-size-padding-sm) text-(length:--ngn-font-size-xs) font-(--ngn-font-weight-semibold) tracking-wide text-(--ngn-color-primary-500) uppercase"
        >
          <span
            class="mr-1 inline-flex size-5 items-center justify-center rounded-full bg-(--ngn-color-primary-100) text-(--ngn-color-primary-700)"
            >1</span
          >
          Install
        </p>
        <div
          class="mb-(--ngn-size-padding-lg) rounded-lg bg-(--ngn-color-surface-800) p-(--ngn-size-padding-lg) font-mono text-(length:--ngn-font-size-sm) text-(--ngn-color-surface-50)"
        >
          <span class="text-(--ngn-color-surface-400)">$</span> pnpm add &#64;ngneers/controls
        </div>
        <p
          class="mb-(--ngn-size-padding-sm) text-(length:--ngn-font-size-xs) font-(--ngn-font-weight-semibold) tracking-wide text-(--ngn-color-primary-500) uppercase"
        >
          <span
            class="mr-1 inline-flex size-5 items-center justify-center rounded-full bg-(--ngn-color-primary-100) text-(--ngn-color-primary-700)"
            >2</span
          >
          Drop it in
        </p>
        <pre
          class="overflow-x-auto rounded-lg p-(--ngn-size-padding-lg) text-(length:--ngn-font-size-sm)"
        ><code class="prism" [innerHTML]="highlighted()"></code></pre>
      </div>
      <div secondary>
        <p
          class="mb-(--ngn-size-padding-sm) text-(length:--ngn-font-size-xs) font-(--ngn-font-weight-semibold) tracking-wide text-(--ngn-color-primary-500) uppercase"
        >
          <span
            class="mr-1 inline-flex size-5 items-center justify-center rounded-full bg-(--ngn-color-primary-100) text-(--ngn-color-primary-700)"
            >3</span
          >
          Ship it — this one is live
        </p>
        <div class="card overflow-hidden shadow-(--ngn-shadow-md)">
          <div
            class="flex items-center gap-1.5 border-b border-(--ngn-color-surface-200) bg-(--ngn-color-surface-50) px-(--ngn-size-padding-md) py-(--ngn-size-padding-sm)"
          >
            <span class="size-2.5 rounded-full bg-[#f87171]"></span>
            <span class="size-2.5 rounded-full bg-[#fbbf24]"></span>
            <span class="size-2.5 rounded-full bg-[#34d399]"></span>
            <span
              class="mx-auto rounded-(--ngn-size-rounded-sm) bg-(--ngn-color-surface-100) px-3 py-0.5 font-mono text-(length:--ngn-font-size-xs) text-(--ngn-color-surface-500)"
            >
              localhost:4200
            </span>
          </div>
          <div class="p-(--ngn-size-padding-xl)">
            <ngn-slider [min]="0" [max]="100" [(value)]="volume" />
            <p
              class="mt-(--ngn-size-padding-lg) font-mono text-(length:--ngn-font-size-lg) text-(--ngn-color-text)"
            >
              volume = <strong class="text-(--ngn-color-primary-600)">{{ volume() }}</strong>
            </p>
          </div>
        </div>
      </div>
    </ngn-docs-section-shell>
  `,
})
export class NgnDocsQuickStartSection {
  protected readonly volume = signal(50);
  protected readonly highlighted = signal('');

  constructor() {
    style(EXAMPLE_CODE).then(html => this.highlighted.set(html));
  }
}
