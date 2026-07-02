import { Component, computed, input } from '@angular/core';

import { NgnDocsReveal } from './reveal';

export type SectionLayout = 'split-left' | 'split-right' | 'centered' | 'full';

@Component({
  selector: 'ngn-docs-section-shell',
  imports: [NgnDocsReveal],
  host: { class: 'block px-(--ngn-size-padding-xl) py-24 lg:py-32' },
  template: `
    <div class="mx-auto max-w-[1100px]">
      <header [ngnDocsReveal]="0" class="mb-12 lg:mb-16" [class]="headerClass()">
        <p
          class="mb-0.5 text-(length:--ngn-font-size-sm) font-(--ngn-font-weight-semibold) tracking-wide text-(--ngn-color-primary-500) uppercase"
        >
          {{ eyebrow() }}
        </p>
        <h2
          class="mb-(--ngn-size-padding-md) text-[2.25rem] leading-tight font-(--ngn-font-weight-bold) text-(--ngn-color-text) lg:text-[2.75rem]"
        >
          {{ heading() }}
        </h2>
        @if (subtitle()) {
          <p class="text-(length:--ngn-font-size-md) text-(--ngn-color-surface-600)">
            {{ subtitle() }}
          </p>
        }
      </header>

      <!-- Order via inline style (not a dynamic class) so it survives JIT. -->
      @if (isSplit()) {
        <div
          [ngnDocsReveal]="60"
          class="grid grid-cols-1 items-center gap-(--ngn-size-padding-xl) lg:grid-cols-2"
        >
          <div [style.order]="layout() === 'split-right' ? 2 : 1">
            <ng-content select="[primary]" />
          </div>
          <div [style.order]="layout() === 'split-right' ? 1 : 2">
            <ng-content select="[secondary]" />
          </div>
        </div>
      } @else {
        <div [ngnDocsReveal]="60">
          <ng-content />
        </div>
      }
    </div>
  `,
})
export class NgnDocsSectionShell {
  public readonly eyebrow = input.required<string>();
  public readonly heading = input.required<string>();
  public readonly subtitle = input<string>('');
  public readonly layout = input<SectionLayout>('full');

  protected readonly isSplit = computed(
    () => this.layout() === 'split-left' || this.layout() === 'split-right'
  );

  // Full literal class strings so Tailwind's scanner picks them up.
  protected readonly headerClass = computed(() => {
    switch (this.layout()) {
      case 'centered':
        return 'mx-auto max-w-[640px] text-center';
      case 'full':
        return 'text-center';
      default:
        return '';
    }
  });
}
