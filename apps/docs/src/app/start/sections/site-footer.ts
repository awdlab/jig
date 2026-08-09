import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'awd-docs-site-footer',
  imports: [RouterLink],
  template: `
    <!-- Full-width band so the divider spans the viewport, not just the content. -->
    <div class="mt-auto w-full border-t border-(--awd-color-surface-200)">
      <footer
        class="mx-auto flex max-w-[1200px] flex-col items-center gap-(--awd-size-padding-lg) px-(--awd-size-padding-xl) py-(--awd-size-padding-xl) text-(length:--awd-font-size-sm) text-(--awd-color-surface-600) md:flex-row md:justify-between"
      >
        <a
          routerLink="/"
          class="flex items-center gap-(--awd-size-padding-md) text-(--awd-color-text) no-underline"
        >
          <img src="img/logo.png" alt="" class="h-7 w-7" />
          &#64;awdlab/jig
        </a>
        <nav class="flex flex-wrap justify-center gap-(--awd-size-padding-xl)">
          <a routerLink="/guides/introduction" class="no-underline hover:underline">Docs</a>
          <a routerLink="/components" class="no-underline hover:underline">Components</a>
          <a
            href="https://github.com/awdlab/jig"
            target="_blank"
            rel="noopener"
            class="no-underline hover:underline"
          >
            GitHub
          </a>
          <a
            href="https://www.npmjs.com/package/@awdlab/jig"
            target="_blank"
            rel="noopener"
            class="no-underline hover:underline"
          >
            npm
          </a>
        </nav>
      </footer>
    </div>
  `,
})
export class NgnDocsSiteFooter {}
