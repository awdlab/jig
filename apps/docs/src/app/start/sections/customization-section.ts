import { Component, computed, effect, signal, ViewEncapsulation } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnAvatar } from '@ngneers/controls/avatar';
import { NgnListBox } from '@ngneers/controls/list-box';
import { NgnSelectButton } from '@ngneers/controls/select-button';

import { NgnDocsSectionShell } from './section-shell';
import { style } from '../../utils/code/prism';

import type { NgnPassthrough } from '@ngneers/controls/base';

type Mode = 'pt' | 'unstyled' | 'templated' | 'theme';

interface Person {
  readonly label: string;
  readonly value: string;
  readonly role: string;
  readonly initials: string;
}

/** One list-box that morphs across four customization levels (pt / unstyled / templated / theme). */
@Component({
  selector: 'ngn-docs-customization-section',
  imports: [NgnDocsSectionShell, NgnListBox, NgnTemplate, NgnSelectButton, NgnAvatar],
  // None so the #unstyled-demo rules emit as global CSS, scoped by the id.
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      /* Demo CSS for the "Unstyled" mode — id-scoped to this one control. */
      #unstyled-demo .ngn-list-box-root {
        display: flex;
        flex-direction: column;
        gap: 0.625rem;
      }

      #unstyled-demo .ngn-list-box-item {
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 0.75rem 1rem;
        border: 1px solid #d8d2c4;
        border-left: 4px solid #d8d2c4;
        border-radius: 0.5rem;
        background: #faf8f2;
        color: #3a3526;
        font-weight: 500;
        transition:
          border-color 0.15s ease,
          background 0.15s ease,
          transform 0.15s ease;
      }

      #unstyled-demo .ngn-list-box-item:hover {
        border-color: #b59a3f;
        transform: translateX(2px);
      }

      #unstyled-demo .ngn-list-box-item-selected {
        background: #fbf2cf;
        border-color: #b59a3f;
        border-left-color: #8a6d12;
        color: #5c460a;
      }
    `,
  ],
  template: `
    <ngn-docs-section-shell
      layout="full"
      eyebrow="Customization"
      heading="Total control over every control"
      subtitle="One list-box, four levels of control — switch a mode and watch the same control morph from a light restyle all the way to your own theme."
    >
      <!-- auto orientation needs the select-button to fill a width-bounded
           wrapper so the group can measure available space and stack on mobile. -->
      <div class="mx-auto mb-(--ngn-size-padding-lg) w-full max-w-[560px]">
        <ngn-select-button
          class="block"
          [options]="modeOptions"
          [value]="mode()"
          (valueChange)="mode.set($event)"
          orientation="auto"
          aria-label="Customization mode"
        />
      </div>

      <p
        class="mx-auto mb-(--ngn-size-padding-xl) max-w-[680px] text-center text-(length:--ngn-font-size-md) text-(--ngn-color-surface-600)"
      >
        {{ description() }}
      </p>

      <div class="grid grid-cols-1 items-stretch gap-(--ngn-size-padding-xl) lg:grid-cols-2">
        <div class="card flex items-center justify-center p-(--ngn-size-padding-xl)">
          @switch (mode()) {
            @case ('pt') {
              <ngn-list-box
                #ptBox
                class="w-full"
                selectable
                [items]="people"
                [(value)]="selected"
                [pt]="ptOverrides"
              />
            }
            @case ('unstyled') {
              <div id="unstyled-demo" class="w-full">
                <ngn-list-box
                  #unstyledBox
                  class="w-full"
                  [unstyled]="true"
                  selectable
                  [items]="people"
                  [(value)]="selected"
                />
              </div>
            }
            @case ('templated') {
              <ngn-list-box #tplBox class="w-full" selectable [items]="people" [(value)]="selected">
                <ng-template #item [ngnTemplate]="tplBox.templateTypes.item" let-item>
                  <span class="flex w-full items-center gap-(--ngn-size-padding-md)">
                    <ngn-avatar [initials]="item?.initials" [size]="32" />
                    <span class="flex flex-col">
                      <span class="font-(--ngn-font-weight-semibold) text-(--ngn-color-text)">{{
                        item?.label
                      }}</span>
                      <span
                        class="text-(length:--ngn-font-size-sm) text-(--ngn-color-surface-500)"
                        >{{ item?.role }}</span
                      >
                    </span>
                  </span>
                </ng-template>
              </ngn-list-box>
            }
            @case ('theme') {
              <ngn-list-box
                #themeBox
                class="w-full"
                selectable
                [items]="people"
                [(value)]="selected"
                [pt]="themeOverrides"
              />
            }
          }
        </div>

        <div class="flex flex-col self-stretch">
          <pre
            class="flex-1 overflow-x-auto rounded-(--ngn-size-rounded-lg) p-(--ngn-size-padding-lg) text-(length:--ngn-font-size-sm)"
          ><code class="prism" [innerHTML]="highlighted()"></code></pre>
        </div>
      </div>
    </ngn-docs-section-shell>
  `,
})
export class NgnDocsCustomizationSection {
  // Escalation order: light restyle → richer content → own design system →
  // full visual freedom. "Unstyled" is the most radical, so it goes last.
  protected readonly modeOptions: readonly { label: string; value: Mode }[] = [
    { label: 'Passthrough', value: 'pt' },
    { label: 'Templated', value: 'templated' },
    { label: 'Custom theme', value: 'theme' },
    { label: 'Unstyled', value: 'unstyled' },
  ];

  protected readonly mode = signal<Mode>('pt');

  protected readonly people: readonly Person[] = [
    { label: 'Ada Lovelace', value: 'ada', role: 'Lead Engineer', initials: 'AL' },
    { label: 'Alan Turing', value: 'alan', role: 'Researcher', initials: 'AT' },
    { label: 'Grace Hopper', value: 'grace', role: 'Compiler Architect', initials: 'GH' },
    { label: 'Edsger Dijkstra', value: 'edsger', role: 'Algorithms', initials: 'ED' },
  ];

  protected readonly selected = signal<string | null>('ada');

  protected readonly ptOverrides: NgnPassthrough<'listBox'> = {
    root: {
      $styles: {
        borderRadius: '0',
        borderColor: 'var(--ngn-color-primary-300)',
        borderWidth: '1px',
        padding: 'var(--ngn-size-padding-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ngn-size-padding-sm)',
      },
    },
    item: {
      $styles: {
        borderRadius: '0',
        padding: 'var(--ngn-size-padding-md)',
        transition: 'background 0.15s ease, color 0.15s ease',
      },
    },
    'item-selected': {
      $styles: {
        background: 'var(--ngn-color-primary-500)',
        color: 'var(--ngn-color-primary-50)',
        fontWeight: 'var(--ngn-font-weight-semibold)',
      },
    },
  };

  protected readonly themeOverrides: NgnPassthrough<'listBox'> = {
    root: {
      $styles: {
        borderRadius: 'var(--ngn-size-rounded-lg)',
        borderColor: 'var(--ngn-color-primary-500)',
        borderWidth: '2px',
        background: 'var(--ngn-color-surface-50)',
        padding: 'var(--ngn-size-padding-md)',
      },
    },
    item: {
      $styles: {
        borderRadius: 'var(--ngn-size-rounded-lg)',
        fontWeight: 'var(--ngn-font-weight-semibold)',
      },
    },
    'item-selected': {
      $styles: {
        background: 'var(--ngn-color-primary-600)',
        color: 'var(--ngn-color-primary-50)',
      },
    },
  };

  protected readonly description = computed(() => {
    switch (this.mode()) {
      case 'pt':
        return 'Passthrough reaches into any internal scope of a control — apply classes, inline styles or attributes by name. No ::ng-deep, no global CSS, no specificity wars, and every scope is fully typed.';
      case 'unstyled':
        return 'Strip every bit of theme styling while keeping all accessibility and behaviour intact, then style it from scratch with your own plain CSS — zero specificity battles, total visual freedom.';
      case 'templated':
        return 'Replace the content of any slot with your own markup. Templates are fully type-safe through templateTypes, so the item context is correctly typed as you build a richer layout.';
      case 'theme':
        return 'Extend the functional base theme once and every instance updates automatically — colors, radii and spacing become your own design system, defined in one place.';
    }
  });

  protected readonly highlighted = signal('');

  constructor() {
    // Drop a stale highlight if the mode changed before style() resolved.
    effect(() => {
      const mode = this.mode();
      const snippet = CODE_BY_MODE[mode];
      void style(snippet).then(html => {
        if (this.mode() === mode) {
          this.highlighted.set(html);
        }
      });
    });
  }
}

const CODE_BY_MODE: Record<Mode, string> = {
  pt: `<ngn-list-box
  [items]="people"
  [pt]="{
    root: { $styles: { borderRadius: '0' } },
    item: { $styles: { borderRadius: '0' } },
    'item-selected': {
      $styles: { background: 'var(--ngn-color-primary-500)' },
    },
  }"
/>`,
  unstyled: `<!-- base theme only — bring your own CSS -->
<div id="unstyled-demo">
  <ngn-list-box [items]="people" [unstyled]="true" selectable />
</div>

/* global styles or a <style> tag — no ::ng-deep needed */
#unstyled-demo .ngn-list-box-item {
  border-left: 4px solid #d8d2c4;
  border-radius: 0.5rem;
  background: #faf8f2;
}
#unstyled-demo .ngn-list-box-item-selected {
  background: #fbf2cf;
  border-left-color: #8a6d12;
}`,
  templated: `<ngn-list-box #listBox [items]="people">
  <ng-template
    [ngnTemplate]="listBox.templateTypes.item"
    let-item
  >
    <ngn-avatar [initials]="item.initials" />
    <span>
      <strong>{{ item.label }}</strong>
      <small>{{ item.role }}</small>
    </span>
  </ng-template>
</ngn-list-box>`,
  theme: `import { createTheme, createThemePart } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';

const listBox = createThemePart({
  base: baseStyles.listBox, // extend the functional base
  root: { css: ({ v, c }) => css\`
    \${c('root')} { border-radius: \${v('size.rounded.lg')}; }
    \${c('item-selected')} { background: \${v('color.primary.600')}; }
  \` },
});

provideNgnControls({ theme: { preset: createTheme({ listBox }) } });`,
};
