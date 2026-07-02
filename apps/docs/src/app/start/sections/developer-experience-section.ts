import { Component, signal } from '@angular/core';
import tablerBook from '@iconify/icons-tabler/book';
import tablerAngular from '@iconify/icons-tabler/brand-angular';
import tablerFlask from '@iconify/icons-tabler/flask-2';
import tablerLanguage from '@iconify/icons-tabler/language';
import tablerPackage from '@iconify/icons-tabler/package';
import tablerShieldCheck from '@iconify/icons-tabler/shield-check';
import { NgnChip } from '@ngneers/controls/chip';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnSlider } from '@ngneers/controls/slider';

import { NgnDocsGlow } from './glow';
import { NgnDocsSectionShell } from './section-shell';
import { style } from '../../utils/code/prism';

import type { IconType } from '@ngneers/controls-custom-types';

type TileVisual = 'chips' | 'regression' | 'treeshake' | 'autocomplete' | 'locales' | 'docs';

interface DxTile {
  title: string;
  detail: string;
  visual: TileVisual;
  snippet?: string;
  highlighted: ReturnType<typeof signal<string>>;
  icon: IconType;
  /** Bento span classes — literal strings so Tailwind's scanner picks them up. */
  span: string;
  features?: { label: string; note: string }[];
}

interface LocaleRow {
  locale: string;
  date: string;
  number: string;
}

/** Fixed sample instant so prerender and browser agree. */
const SAMPLE_DATE = new Date(2026, 6, 2, 14, 30);
const SAMPLE_NUMBER = 1234567.89;

@Component({
  selector: 'ngn-docs-developer-experience-section',
  imports: [NgnDocsSectionShell, NgnIcon, NgnChip, NgnSlider, NgnDocsGlow],
  template: `
    <ngn-docs-section-shell
      layout="full"
      eyebrow="Developer experience"
      heading="Built for developers"
      subtitle="Modern Angular, great defaults, no surprises."
    >
      <div
        class="grid auto-rows-[minmax(7rem,auto)] grid-cols-2 gap-(--ngn-size-padding-lg) text-left md:grid-cols-4"
      >
        @for (tile of tiles; track tile.title) {
          <div
            ngnDocsGlow
            class="card group relative flex flex-col justify-between gap-(--ngn-size-padding-md) overflow-hidden p-(--ngn-size-padding-xl)"
            [class]="tile.span"
          >
            <ngn-icon
              [icon]="tile.icon"
              class="pointer-events-none absolute top-4 right-4 text-[3rem] text-(--ngn-color-primary-200) transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 group-hover:text-(--ngn-color-primary-300)"
            />
            <div class="relative flex flex-col gap-(--ngn-size-padding-xs)">
              <h3 class="font-(--ngn-font-weight-semibold) text-(--ngn-color-text)">
                {{ tile.title }}
              </h3>
              <p class="text-(length:--ngn-font-size-sm) text-(--ngn-color-surface-500)">
                {{ tile.detail }}
              </p>
            </div>

            @switch (tile.visual) {
              @case ('chips') {
                <ul
                  class="relative flex flex-1 flex-wrap content-center gap-(--ngn-size-padding-sm)"
                >
                  @for (feature of tile.features; track feature.label) {
                    <li>
                      <ngn-chip color="primary">{{ feature.label }}</ngn-chip>
                    </li>
                  }
                </ul>
              }

              @case ('regression') {
                <!-- Abstract visual-regression diff: Expected | Actual screenshot halves. -->
                <div class="relative flex flex-1 items-center justify-center">
                  <svg
                    viewBox="0 0 200 130"
                    class="h-auto w-full max-w-[16rem]"
                    role="img"
                    aria-label="Visual regression comparison of an expected and actual screenshot"
                    fill="none"
                  >
                    <rect
                      x="4"
                      y="4"
                      width="192"
                      height="110"
                      rx="8"
                      fill="#0f172a"
                      stroke="#334155"
                    />
                    <rect x="16" y="18" width="60" height="8" rx="3" fill="#475569" />
                    <rect x="16" y="34" width="74" height="6" rx="3" fill="#334155" />
                    <rect x="16" y="46" width="50" height="6" rx="3" fill="#334155" />
                    <rect
                      x="16"
                      y="64"
                      width="74"
                      height="30"
                      rx="4"
                      fill="#1e293b"
                      stroke="#334155"
                    />
                    <rect x="22" y="72" width="40" height="6" rx="3" fill="#475569" />
                    <rect x="110" y="18" width="60" height="8" rx="3" fill="#475569" />
                    <rect x="110" y="34" width="74" height="6" rx="3" fill="#334155" />
                    <rect x="110" y="46" width="50" height="6" rx="3" fill="#334155" />
                    <rect
                      x="116"
                      y="62"
                      width="74"
                      height="30"
                      rx="4"
                      fill="#3f1d2e"
                      stroke="#f43f5e"
                      stroke-dasharray="3 2"
                    />
                    <rect x="122" y="70" width="52" height="6" rx="3" fill="#f43f5e" />
                    <line x1="100" y1="6" x2="100" y2="112" stroke="#94a3b8" stroke-width="1.5" />
                    <circle cx="100" cy="59" r="7" fill="#e2e8f0" stroke="#94a3b8" />
                    <path
                      d="M97 56 l-3 3 l3 3 M103 56 l3 3 l-3 3"
                      stroke="#475569"
                      stroke-width="1.2"
                    />
                    <text x="16" y="108" fill="#94a3b8" font-size="8" font-family="monospace">
                      Expected
                    </text>
                    <text x="138" y="108" fill="#f43f5e" font-size="8" font-family="monospace">
                      Actual
                    </text>
                  </svg>
                </div>
              }

              @case ('treeshake') {
                <!-- Entry-point grid: hover shakes everything you didn't import out of the bundle. -->
                <div class="relative flex flex-1 items-center gap-(--ngn-size-padding-xl)">
                  <div class="grid w-max grid-cols-6 gap-1.5" aria-hidden="true">
                    @for (cell of treeshakeCells; track $index) {
                      <div
                        class="size-4 rounded-sm transition-all duration-300"
                        [class]="
                          cell
                            ? 'bg-(--ngn-color-primary-500) shadow-[0_0_10px_color-mix(in_srgb,var(--ngn-color-primary-500)_60%,transparent)]'
                            : 'bg-(--ngn-color-surface-200) group-hover:scale-50 group-hover:opacity-25'
                        "
                      ></div>
                    }
                  </div>
                  <p class="text-(length:--ngn-font-size-xs) text-(--ngn-color-surface-500)">
                    Hover — only what you import ships.
                  </p>
                </div>
              }

              @case ('autocomplete') {
                <!-- Editor autocomplete mock: the API your editor already knows. -->
                <div
                  aria-hidden="true"
                  class="relative w-fit max-w-full rounded-(--ngn-size-rounded-md) border border-(--ngn-color-surface-200) bg-(--ngn-color-surface-50) p-(--ngn-size-padding-md) font-mono text-(length:--ngn-font-size-xs)"
                >
                  <p class="text-(--ngn-color-text)">
                    date<span class="text-(--ngn-color-surface-400)">.</span
                    ><span class="text-(--ngn-color-primary-600)">va</span
                    ><span class="animate-pulse text-(--ngn-color-text)">|</span>
                  </p>
                  <div
                    class="mt-1 ml-6 w-max overflow-hidden rounded-(--ngn-size-rounded-md) border border-(--ngn-color-surface-300) bg-(--ngn-color-surface-25) shadow-(--ngn-shadow-md)"
                  >
                    <p class="bg-(--ngn-color-primary-100) px-2 py-1 text-(--ngn-color-text)">
                      value
                      <span class="text-(--ngn-color-surface-500)">ModelSignal&lt;Date&gt;</span>
                    </p>
                    <p class="px-2 py-1 text-(--ngn-color-surface-600)">
                      valueChange
                      <span class="text-(--ngn-color-surface-400)">OutputRef&lt;Date&gt;</span>
                    </p>
                    <p class="px-2 py-1 text-(--ngn-color-surface-600)">
                      valid
                      <span class="text-(--ngn-color-surface-400)">Signal&lt;boolean&gt;</span>
                    </p>
                  </div>
                </div>
              }

              @case ('locales') {
                <!-- Same instant, three locales — formatted live by the same Intl path the controls use. -->
                <ul class="relative flex flex-col gap-(--ngn-size-padding-sm) font-mono">
                  @for (row of localeRows; track row.locale) {
                    <li class="flex items-center gap-(--ngn-size-padding-md)">
                      <span
                        class="w-14 rounded-(--ngn-size-rounded-sm) bg-(--ngn-color-primary-100) px-1.5 py-0.5 text-center text-(length:--ngn-font-size-xs) font-(--ngn-font-weight-semibold) text-(--ngn-color-primary-700)"
                      >
                        {{ row.locale }}
                      </span>
                      <span class="text-(length:--ngn-font-size-xs) text-(--ngn-color-text)">
                        {{ row.date }}
                      </span>
                      <span class="text-(length:--ngn-font-size-xs) text-(--ngn-color-surface-500)">
                        {{ row.number }}
                      </span>
                    </li>
                  }
                </ul>
              }

              @case ('docs') {
                <!-- Mini docs page: live playground control + typed API rows. -->
                <div
                  inert
                  class="pointer-events-none relative w-full max-w-[20rem] overflow-hidden rounded-(--ngn-size-rounded-md) border border-(--ngn-color-surface-200) select-none"
                >
                  <div
                    class="flex items-center gap-1.5 border-b border-(--ngn-color-surface-200) bg-(--ngn-color-surface-50) px-3 py-2"
                  >
                    <span class="size-2 rounded-full bg-(--ngn-color-surface-300)"></span>
                    <span class="size-2 rounded-full bg-(--ngn-color-surface-300)"></span>
                    <span class="size-2 rounded-full bg-(--ngn-color-surface-300)"></span>
                    <span
                      class="ml-2 text-(length:--ngn-font-size-xs) text-(--ngn-color-surface-500)"
                    >
                      /components/slider
                    </span>
                  </div>
                  <div class="flex flex-col gap-(--ngn-size-padding-md) p-(--ngn-size-padding-md)">
                    <ngn-slider [min]="0" [max]="100" [value]="docsSliderValue" />
                    <div class="flex flex-col gap-1 font-mono text-(length:--ngn-font-size-xs)">
                      <p>
                        <span class="text-(--ngn-color-primary-600)">value</span>
                        <span class="text-(--ngn-color-surface-500)"
                          >: ModelSignal&lt;number&gt;</span
                        >
                      </p>
                      <p>
                        <span class="text-(--ngn-color-primary-600)">step</span>
                        <span class="text-(--ngn-color-surface-500)"
                          >: InputSignal&lt;number&gt;</span
                        >
                      </p>
                    </div>
                  </div>
                </div>
              }
            }

            @if (tile.snippet) {
              <pre
                class="relative block w-fit max-w-full overflow-x-auto rounded-(--ngn-size-rounded-md) px-(--ngn-size-padding-md) py-(--ngn-size-padding-sm) text-(length:--ngn-font-size-xs)"
              ><code class="prism font-mono whitespace-pre" [innerHTML]="tile.highlighted()"></code></pre>
            }
          </div>
        }
      </div>
    </ngn-docs-section-shell>
  `,
})
export class NgnDocsDeveloperExperienceSection {
  /** 18 entry points, one imported (index 8 — roughly central). */
  protected readonly treeshakeCells: readonly boolean[] = Array.from(
    { length: 18 },
    (_, i) => i === 8
  );

  protected readonly docsSliderValue = 64;

  protected readonly localeRows: readonly LocaleRow[] = ['de', 'en-US', 'ja'].map(locale => ({
    locale,
    date: new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(
      SAMPLE_DATE
    ),
    number: new Intl.NumberFormat(locale).format(SAMPLE_NUMBER),
  }));

  protected readonly tiles: DxTile[] = [
    {
      title: 'Cutting-edge Angular',
      detail: 'Built on the newest Angular — signals, zoneless, and reactive from day one.',
      visual: 'chips',
      features: [
        { label: 'Signals', note: 'inputs & models' },
        { label: 'Zoneless', note: 'no zone.js' },
        { label: 'OnPush by default', note: 'since day one' },
        { label: 'Signal Forms', note: 'reactive & typed' },
        { label: 'Native control flow', note: '@if / @for / @switch' },
        { label: 'Deferrable views', note: '@defer' },
        { label: 'Standalone APIs', note: 'no NgModules' },
      ],
      snippet: 'value = model<T>();\n// zoneless, signal-first',
      highlighted: signal(''),
      icon: tablerAngular,
      span: 'col-span-2 md:col-span-1 md:row-span-2',
    },
    {
      title: 'Tested',
      detail: 'Unit-tested logic plus pixel-perfect visual regression on every control.',
      visual: 'regression',
      snippet: 'await expectScreenshot(page)',
      highlighted: signal(''),
      icon: tablerFlask,
      span: 'col-span-2 md:col-span-1 md:row-span-2',
    },
    {
      title: 'Tree-shakeable',
      detail:
        'Each control is its own entry point — import one and the rest never reaches your bundle.',
      visual: 'treeshake',
      snippet: "import { NgnInput } from '@ngneers/controls/input';",
      highlighted: signal(''),
      icon: tablerPackage,
      span: 'col-span-2 md:col-span-2',
    },
    {
      title: 'Strict TypeScript',
      detail:
        'Every input, model, and event is fully typed — your editor autocompletes the whole public API.',
      visual: 'autocomplete',
      highlighted: signal(''),
      icon: tablerShieldCheck,
      span: 'col-span-2 md:col-span-2',
    },
    {
      title: 'Localizable',
      detail:
        'Ships with built-in UI translations, accepts your own languages, and formats dates & numbers to any locale.',
      visual: 'locales',
      highlighted: signal(''),
      icon: tablerLanguage,
      span: 'col-span-2 md:col-span-2',
    },
    {
      title: 'Documented',
      detail:
        'Every control ships live examples, an interactive playground, and a complete, typed API reference.',
      visual: 'docs',
      highlighted: signal(''),
      icon: tablerBook,
      span: 'col-span-2 md:col-span-2',
    },
  ];

  constructor() {
    for (const tile of this.tiles) {
      if (tile.snippet) {
        style(tile.snippet).then(html => tile.highlighted.set(html));
      }
    }
  }
}
