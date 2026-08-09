import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import tablerBrandGithub from '@iconify/icons-tabler/brand-github';
import { NgnButton } from '@awdlab/jig/button';
import { NgnIcon } from '@awdlab/jig/icon';

import { NgnDocsSectionHeader } from './section-header';

@Component({
  selector: 'awd-docs-final-cta-section',
  imports: [NgnButton, NgnIcon, RouterLink, NgnDocsSectionHeader],
  host: { class: 'block px-(--awd-size-padding-xl) py-12 lg:py-16' },
  template: `
    <div
      class="mx-auto max-w-[1100px] rounded-(--awd-size-rounded-lg) border border-(--awd-color-surface-200) bg-[radial-gradient(120%_140%_at_0%_0%,color-mix(in_srgb,var(--awd-color-primary-400)_22%,transparent),var(--awd-color-surface-25)_62%)] p-(--awd-size-padding-xl) lg:p-12"
    >
      <awd-docs-section-header
        class="mb-8"
        eyebrow="Get started"
        heading="Start with one control"
        subtitle="Install, import, bind a signal — that is the whole learning curve. Swap in a single control where you need it and leave the rest of your app untouched, or point your coding agent at our MCP server and let it migrate the whole app in one pass. Your call."
      />
      <div class="flex flex-wrap gap-(--awd-size-padding-lg)">
        <a ngnButton kind="primary" routerLink="/guides/introduction">Read the docs</a>
        <a ngnButton kind="secondary" routerLink="/guides/mcp-server">Migrate with the MCP</a>
        <a
          ngnButton
          kind="secondary"
          href="https://github.com/awdlab/jig"
          target="_blank"
          rel="noopener"
        >
          <awd-icon [icon]="githubIcon" /> GitHub
        </a>
      </div>
      <p
        class="mono mt-(--awd-size-padding-xl) text-(length:--awd-font-size-sm) text-(--awd-color-surface-500)"
      >
        MIT licensed · Angular 22+ · zoneless and signals-native
      </p>
    </div>
  `,
})
export class NgnDocsFinalCtaSection {
  protected readonly githubIcon = tablerBrandGithub;
}
