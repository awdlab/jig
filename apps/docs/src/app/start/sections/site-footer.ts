import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'jig-docs-site-footer',
  imports: [RouterLink],
  template: `
    <!-- Full-width band so the divider spans the viewport, not just the content. -->
    <div class="mt-auto w-full border-t border-(--jig-color-surface-200)">
      <footer
        class="mx-auto flex max-w-[1200px] flex-col items-center gap-(--jig-size-padding-lg) px-(--jig-size-padding-xl) py-(--jig-size-padding-xl) text-(length:--jig-font-size-sm) text-(--jig-color-surface-600) md:flex-row md:justify-between"
      >
        <div class="flex items-center gap-(--jig-size-padding-md)">
          <a routerLink="/" class="flex items-center no-underline">
            <img src="img/logo.png" alt="jig" class="h-7 w-7" />
          </a>
          <a
            href="https://github.com/awdlab"
            target="_blank"
            rel="noopener"
            class="no-underline hover:underline"
          >
            by awdlab
          </a>
        </div>
        <nav class="flex flex-wrap justify-center gap-(--jig-size-padding-xl)">
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
export class JigDocsSiteFooter {}
