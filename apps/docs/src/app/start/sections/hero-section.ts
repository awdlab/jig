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
      class="bg-[linear-gradient(to_bottom,var(--ngn-color-primary-50),var(--ngn-color-background))] px-(--ngn-size-padding-xl) py-20 text-center"
    >
      <p
        class="mb-(--ngn-size-padding-md) text-(length:--ngn-font-size-sm) font-(--ngn-font-weight-semibold) text-(--ngn-color-primary-600)"
      >
        &#64;ngneers/controls
      </p>
      <div
        class="mb-(--ngn-size-padding-lg) flex flex-wrap justify-center gap-(--ngn-size-padding-sm)"
      >
        @if (version(); as v) {
          <a
            href="https://www.npmjs.com/package/@ngneers/controls"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center rounded-full border border-(--ngn-color-surface-200) bg-(--ngn-color-surface-25) px-(--ngn-size-padding-md) py-(--ngn-size-padding-xs) text-(length:--ngn-font-size-sm) font-(--ngn-font-weight-semibold)"
          >
            <span class="ngn-rainbow-text">npm v{{ v }}</span>
          </a>
        }
        @if (stars(); as s) {
          <a
            href="https://github.com/NGneers/controls"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center rounded-full border border-(--ngn-color-surface-200) bg-(--ngn-color-surface-25) px-(--ngn-size-padding-md) py-(--ngn-size-padding-xs) text-(length:--ngn-font-size-sm) font-(--ngn-font-weight-semibold)"
          >
            <span class="ngn-rainbow-text">&#9733; {{ s }}</span>
          </a>
        }
      </div>
      <h1
        class="mx-auto mb-(--ngn-size-padding-lg) max-w-[760px] text-[3rem] font-(--ngn-font-weight-bold) text-(--ngn-color-primary-700)"
      >
        Build beautiful Angular apps, faster
      </h1>
      <p
        class="mx-auto mb-8 max-w-[640px] text-(length:--ngn-font-size-md) leading-relaxed text-(--ngn-color-surface-600)"
      >
        A signals-native, zoneless, accessible component library — themed by design tokens and built
        on native browser primitives.
      </p>
      <div class="mb-10 flex flex-wrap justify-center gap-(--ngn-size-padding-lg)">
        <a ngnButton kind="primary" routerLink="/components">Get Started</a>
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
        <span>{{ controlCount }}+ production-ready controls</span><span>Zero-zone performance</span
        ><span>Accessible by default</span>
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
          // Leave signals null — badges stay hidden.
        },
      });
    });
  }
}
