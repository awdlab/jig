import { Component, input } from '@angular/core';
import tablerBrandGithub from '@iconify/icons-tabler/brand-github';
import { NgnIcon } from '@ngneers/controls/icon';

@Component({
  selector: 'ngn-docs-site-footer',
  imports: [NgnIcon],
  template: `
    <!-- Full-width band carries the last segment's tone; padding lives here (not
         the card) so the tint has no gap above the footer. -->
    <div
      class="mt-auto w-full py-(--ngn-size-padding-xl)"
      [class]="tinted() ? 'bg-(--ngn-color-surface-50)' : ''"
    >
      <footer
        class="card mx-(--ngn-size-padding-xl) flex w-auto max-w-[1200px] flex-col items-center gap-(--ngn-size-padding-md) rounded-(--ngn-size-rounded-lg) border border-(--ngn-color-surface-200) px-8 py-8 text-(length:--ngn-font-size-sm) text-(--ngn-color-surface-600) shadow-(--ngn-shadow-md) md:flex-row md:justify-between xl:mx-auto"
      >
        <span class="font-(--ngn-font-weight-semibold) text-(--ngn-color-text)">
          &#64;ngneers/controls
        </span>
        <a
          class="flex items-center gap-(--ngn-size-padding-sm) text-(--ngn-color-primary-500) no-underline hover:underline"
          href="https://github.com/NGneers/controls"
          target="_blank"
          rel="noopener"
        >
          <ngn-icon [icon]="githubIcon" /> GitHub
        </a>
      </footer>
    </div>
  `,
})
export class NgnDocsSiteFooter {
  public readonly tinted = input(false);

  protected readonly githubIcon = tablerBrandGithub;
}
