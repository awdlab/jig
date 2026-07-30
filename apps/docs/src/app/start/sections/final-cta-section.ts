import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import tablerBrandGithub from '@iconify/icons-tabler/brand-github';
import { NgnButton } from '@ngneers/controls/button';
import { NgnIcon } from '@ngneers/controls/icon';

import { NgnDocsSectionHeader } from './section-header';

@Component({
  selector: 'ngn-docs-final-cta-section',
  imports: [NgnButton, NgnIcon, RouterLink, NgnDocsSectionHeader],
  host: { class: 'block px-(--ngn-size-padding-xl) py-12 lg:py-16' },
  template: `
    <div
      class="mx-auto max-w-[1100px] rounded-(--ngn-size-rounded-lg) border border-(--ngn-color-surface-200) bg-[radial-gradient(120%_140%_at_0%_0%,color-mix(in_srgb,var(--ngn-color-primary-400)_22%,transparent),var(--ngn-color-surface-25)_62%)] p-(--ngn-size-padding-xl) lg:p-12"
    >
      <ngn-docs-section-header
        class="mb-8"
        eyebrow="Get started"
        heading="Start with one control"
        subtitle="Install, import, bind a signal — that is the whole learning curve. Swap in a single control where you need it and leave the rest of your app untouched, or point your coding agent at our MCP server and let it migrate the whole app in one pass. Your call."
      />
      <div class="flex flex-wrap gap-(--ngn-size-padding-lg)">
        <a ngnButton kind="primary" routerLink="/guides/introduction">Read the docs</a>
        <a ngnButton kind="secondary" routerLink="/guides/mcp-server">Migrate with the MCP</a>
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
      <p
        class="mono mt-(--ngn-size-padding-xl) text-(length:--ngn-font-size-sm) text-(--ngn-color-surface-500)"
      >
        MIT licensed · Angular 22+ · zoneless and signals-native
      </p>
    </div>
  `,
})
export class NgnDocsFinalCtaSection {
  protected readonly githubIcon = tablerBrandGithub;
}
