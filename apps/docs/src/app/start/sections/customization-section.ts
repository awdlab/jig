import { Component, signal, ViewEncapsulation } from '@angular/core';
import { NgnAccordion, NgnAccordionPanel } from '@ngneers/controls/accordion';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnAvatar } from '@ngneers/controls/avatar';
import { NgnListBox } from '@ngneers/controls/list-box';

import { NgnDocsSectionShell } from './section-shell';
import { style } from '../../utils/code/prism';

import type { NgnPassthrough } from '@ngneers/controls/base';

type Mode = 'pt' | 'templated' | 'theme' | 'unstyled';

interface Person {
  readonly label: string;
  readonly value: string;
  readonly role: string;
  readonly initials: string;
}

/** One list-box, four customization levels — one accordion panel each. */
@Component({
  selector: 'ngn-docs-customization-section',
  imports: [
    NgnDocsSectionShell,
    NgnListBox,
    NgnTemplate,
    NgnAvatar,
    NgnAccordion,
    NgnAccordionPanel,
  ],
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

      /* Shared per-level layout: description, demo card, code pane. */
      .level-lead {
        margin-bottom: var(--ngn-size-padding-xl);
        max-width: 70ch;
        font-size: var(--ngn-font-size-md);
        color: var(--ngn-color-surface-600);
      }

      .level-grid {
        display: grid;
        align-items: stretch;
        gap: var(--ngn-size-padding-xl);
      }

      @media (width >= 64rem) {
        .level-grid {
          grid-template-columns: 1fr 1fr;
        }
      }

      .level-demo {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--ngn-size-padding-xl);
      }

      .level-code {
        overflow-x: auto;
        border-radius: var(--ngn-size-rounded-lg);
        padding: var(--ngn-size-padding-lg);
        font-size: var(--ngn-font-size-sm);
      }
    `,
  ],
  template: `
    <ngn-docs-section-shell
      layout="full"
      eyebrow="Customization"
      heading="Total control over every control"
      subtitle="One list-box, four levels of control — open a level and watch the same control morph from a light restyle all the way to your own theme."
    >
      <!-- Escalation order: light restyle → richer content → own design system →
           full visual freedom. "Unstyled" is the most radical, so it goes last. -->
      <ngn-accordion [lazy]="true" [(expandedPanels)]="expandedPanels">
        <ngn-accordion-panel panelId="pt" header="Passthrough">
          <ng-template #content>
            <p class="level-lead">
              Passthrough reaches into any internal scope of a control — apply classes, inline
              styles or attributes by name. No <code>::ng-deep</code>, no global CSS, no specificity
              wars, and every scope is fully typed.
            </p>
            <div class="level-grid">
              <div class="card level-demo">
                <ngn-list-box
                  class="w-full"
                  selectable
                  [items]="people"
                  [(value)]="selected"
                  [pt]="ptOverrides"
                />
              </div>
              <pre class="level-code"><code class="prism" [innerHTML]="code().pt"></code></pre>
            </div>
          </ng-template>
        </ngn-accordion-panel>

        <ngn-accordion-panel panelId="templated" header="Templated">
          <ng-template #content>
            <p class="level-lead">
              Replace the content of any slot with your own markup. Templates are fully type-safe
              through <code>templateTypes</code>, so the item context is correctly typed as you
              build a richer layout.
            </p>
            <div class="level-grid">
              <div class="card level-demo">
                <ngn-list-box
                  #tplBox
                  class="w-full"
                  selectable
                  [items]="people"
                  [(value)]="selected"
                >
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
              </div>
              <pre
                class="level-code"
              ><code class="prism" [innerHTML]="code().templated"></code></pre>
            </div>
          </ng-template>
        </ngn-accordion-panel>

        <ngn-accordion-panel panelId="theme" header="Custom theme">
          <ng-template #content>
            <p class="level-lead">
              Extend the functional base theme once and every instance updates automatically —
              colors, radii and spacing become your own design system, defined in one place.
            </p>
            <div class="level-grid">
              <div class="card level-demo">
                <ngn-list-box
                  class="w-full"
                  selectable
                  [items]="people"
                  [(value)]="selected"
                  [pt]="themeOverrides"
                />
              </div>
              <pre class="level-code"><code class="prism" [innerHTML]="code().theme"></code></pre>
            </div>
          </ng-template>
        </ngn-accordion-panel>

        <ngn-accordion-panel panelId="unstyled" header="Unstyled">
          <ng-template #content>
            <p class="level-lead">
              Strip every bit of theme styling while keeping all accessibility and behaviour intact,
              then style it from scratch with your own plain CSS — zero specificity battles, total
              visual freedom.
            </p>
            <div class="level-grid">
              <div class="card level-demo">
                <div id="unstyled-demo" class="w-full">
                  <ngn-list-box
                    class="w-full"
                    [unstyled]="true"
                    selectable
                    [items]="people"
                    [(value)]="selected"
                  />
                </div>
              </div>
              <pre
                class="level-code"
              ><code class="prism" [innerHTML]="code().unstyled"></code></pre>
            </div>
          </ng-template>
        </ngn-accordion-panel>
      </ngn-accordion>
    </ngn-docs-section-shell>
  `,
})
export class NgnDocsCustomizationSection {
  protected readonly expandedPanels = signal<string[]>(['pt']);

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

  protected readonly code = signal<Record<Mode, string>>({
    pt: '',
    templated: '',
    theme: '',
    unstyled: '',
  });

  constructor() {
    for (const [mode, snippet] of Object.entries(CODE_BY_MODE)) {
      void style(snippet).then(html => this.code.update(current => ({ ...current, [mode]: html })));
    }
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
};
