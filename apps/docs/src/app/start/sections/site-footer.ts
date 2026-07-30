import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ngn-docs-site-footer',
  imports: [RouterLink],
  template: `
    <!-- Full-width band so the divider spans the viewport, not just the content. -->
    <div class="mt-auto w-full border-t border-(--ngn-color-surface-200)">
      <footer
        class="mx-auto flex max-w-[1200px] flex-col items-center gap-(--ngn-size-padding-lg) px-(--ngn-size-padding-xl) py-(--ngn-size-padding-xl) text-(length:--ngn-font-size-sm) text-(--ngn-color-surface-600) md:flex-row md:justify-between"
      >
        <a
          routerLink="/"
          class="flex items-center gap-(--ngn-size-padding-md) text-(--ngn-color-text) no-underline"
        >
          <img src="img/logo.png" alt="" class="h-7 w-7" />
          &#64;ngneers/controls
        </a>
        <nav class="flex flex-wrap justify-center gap-(--ngn-size-padding-xl)">
          <a routerLink="/guides/introduction" class="no-underline hover:underline">Docs</a>
          <a routerLink="/components" class="no-underline hover:underline">Components</a>
          <a
            href="https://github.com/NGneers/controls"
            target="_blank"
            rel="noopener"
            class="no-underline hover:underline"
          >
            GitHub
          </a>
          <a
            href="https://www.npmjs.com/package/@ngneers/controls"
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
