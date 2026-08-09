import { Component, input } from '@angular/core';

/** The one header pattern every start-page segment uses: keyword, heading, subheader. */
@Component({
  selector: 'jig-docs-section-header',
  host: { class: 'block text-left' },
  template: `
    <p
      class="mono text-(length:--jig-font-size-sm) tracking-wider text-(--jig-color-primary-500) uppercase"
    >
      {{ eyebrow() }}
    </p>
    <h2
      class="mt-1 mb-(--jig-size-padding-md) text-[2.25rem] leading-tight font-(--jig-font-weight-bold) text-(--jig-color-text) lg:text-[2.75rem]"
    >
      {{ heading() }}
    </h2>
    @if (subtitle()) {
      <p class="max-w-[70ch] text-(length:--jig-font-size-md) text-(--jig-color-surface-600)">
        {{ subtitle() }}
      </p>
    }
  `,
})
export class AwdDocsSectionHeader {
  public readonly eyebrow = input.required<string>();
  public readonly heading = input.required<string>();
  public readonly subtitle = input<string>('');
}
