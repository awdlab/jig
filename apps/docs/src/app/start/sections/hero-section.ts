import { HttpClient } from '@angular/common/http';
import { Component, afterNextRender, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import tablerBrandGithub from '@iconify/icons-tabler/brand-github';
import { NgnButton } from '@ngneers/controls/button';
import { NgnIcon } from '@ngneers/controls/icon';

import { CONTROL_COUNT } from './controls-count';

interface Stats {
  version: string | null;
  stars: number | null;
}

@Component({
  selector: 'ngn-docs-hero-section',
  imports: [NgnButton, NgnIcon, RouterLink],
  template: `
    <section
      class="relative overflow-hidden bg-[linear-gradient(to_bottom,var(--ngn-color-primary-50),var(--ngn-color-background))] px-(--ngn-size-padding-xl) py-28 text-center lg:py-36"
    >
      <!-- Aurora backdrop — decorative only. -->
      <div aria-hidden="true" class="absolute inset-0">
        <div
          class="ngn-aurora-blob top-[-20%] left-[8%] h-[36rem] w-[36rem] bg-[radial-gradient(circle,color-mix(in_srgb,var(--ngn-color-primary-400)_30%,transparent),transparent_70%)]"
          style="--ngn-aurora-duration: 20s"
        ></div>
        <div
          class="ngn-aurora-blob top-[-10%] right-[5%] h-[32rem] w-[32rem] bg-[radial-gradient(circle,color-mix(in_srgb,#f736e3_16%,transparent),transparent_70%)]"
          style="--ngn-aurora-duration: 24s; --ngn-aurora-delay: -8s"
        ></div>
        <div
          class="ngn-aurora-blob bottom-[-30%] left-[35%] h-[30rem] w-[30rem] bg-[radial-gradient(circle,color-mix(in_srgb,var(--ngn-color-primary-300)_26%,transparent),transparent_70%)]"
          style="--ngn-aurora-duration: 16s; --ngn-aurora-delay: -4s"
        ></div>
      </div>

      <div class="relative">
        <p
          class="mb-(--ngn-size-padding-md) text-(length:--ngn-font-size-sm) font-(--ngn-font-weight-semibold) text-(--ngn-color-primary-600)"
        >
          &#64;ngneers/controls
        </p>
        <div
          class="mb-(--ngn-size-padding-lg) flex flex-wrap justify-center gap-(--ngn-size-padding-sm)"
        >
          <a
            href="https://www.npmjs.com/package/@ngneers/controls"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center rounded-full border border-(--ngn-color-surface-200) bg-(--ngn-color-surface-25) px-(--ngn-size-padding-md) py-(--ngn-size-padding-xs) text-(length:--ngn-font-size-sm) font-(--ngn-font-weight-semibold)"
          >
            <span class="ngn-rainbow-text">npm v{{ version() ?? '…' }}</span>
          </a>
          <!-- <a
            href="https://github.com/NGneers/controls"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center rounded-full border border-(--ngn-color-surface-200) bg-(--ngn-color-surface-25) px-(--ngn-size-padding-md) py-(--ngn-size-padding-xs) text-(length:--ngn-font-size-sm) font-(--ngn-font-weight-semibold)"
          >
            <span class="ngn-rainbow-text">&#9733; {{ stars() ?? '…' }}</span>
          </a> -->
        </div>
        <h1
          class="mx-auto mb-(--ngn-size-padding-lg) max-w-[820px] text-[3rem] leading-[1.1] font-(--ngn-font-weight-bold) tracking-tight text-(--ngn-color-primary-700) lg:text-[4rem]"
        >
          Build beautiful
          <span class="ngn-angular-text">Angular</span>
          apps, faster
        </h1>
        <p
          class="mx-auto mb-8 max-w-[640px] text-(length:--ngn-font-size-md) leading-relaxed text-(--ngn-color-surface-600)"
        >
          A signals-native, zoneless, accessible component library — themed by design tokens and
          built on native browser primitives.
        </p>
        <div class="mb-10 flex flex-wrap justify-center gap-(--ngn-size-padding-lg)">
          <a
            ngnButton
            kind="primary"
            routerLink="/guides/introduction"
            class="transition-shadow hover:shadow-[0_0_24px_color-mix(in_srgb,var(--ngn-color-primary-500)_45%,transparent)]"
          >
            Get Started
          </a>
          <a ngnButton kind="secondary" routerLink="/components">View Components</a>
          <a
            ngnButton
            kind="secondary"
            href="https://github.com/NGneers/controls"
            target="_blank"
            rel="noopener"
          >
            <ngn-icon [icon]="githubIcon" /> GitHub
          </a>
        </div>

        <div
          class="flex flex-wrap justify-center gap-(--ngn-size-padding-xl) text-(length:--ngn-font-size-sm) text-(--ngn-color-surface-500)"
        >
          <span>{{ controlCount }}+ production-ready controls</span
          ><span>Zero-zone performance</span><span>Accessible by default</span>
        </div>
      </div>
    </section>
  `,
})
export class NgnDocsHeroSection {
  private readonly _http = inject(HttpClient);

  protected readonly controlCount = CONTROL_COUNT;
  protected readonly githubIcon = tablerBrandGithub;
  protected readonly version = signal<string | null>(null);
  protected readonly stars = signal<number | null>(null);

  constructor() {
    // Browser-only: /api/stats has no live server during prerender.
    afterNextRender(() => {
      this._http.get<Stats>('/api/stats').subscribe({
        next: stats => {
          this.version.set(stats.version);
          this.stars.set(stats.stars);
        },
        error: () => {
          // Leave signals null — badges keep the "…" placeholder.
        },
      });
    });
  }
}
