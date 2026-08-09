import {
  Component,
  DestroyRef,
  ElementRef,
  afterRenderEffect,
  computed,
  inject,
  signal,
} from '@angular/core';
import tablerLock from '@iconify/icons-tabler/lock';
import tablerUser from '@iconify/icons-tabler/user';
import { ColorSchemeService } from '@awdlab/jig/api/ng';
import { JigButton } from '@awdlab/jig/button';
import { JigIcon } from '@awdlab/jig/icon';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigSwitch } from '@awdlab/jig/switch';

import { JigDocsSectionShell } from './section-shell';
import { JigDocsThemePicker, ThemePickerService } from '../../utils/theme-picker';

/** Fixed annotation hues, one per token family. Not theme-derived — they must
 * stay distinguishable from whatever primary the visitor picks. */
const HUES = {
  radius: { light: '#2563eb', dark: '#60a5fa' },
  primary: { light: '#7c3aed', dark: '#a78bfa' },
  padding: { light: '#e11d48', dark: '#fb7185' },
  fontSize: { light: '#059669', dark: '#34d399' },
  surface: { light: '#b45309', dark: '#fbbf24' },
} as const;

type Hue = keyof typeof HUES;

/** Theme-styled but outside the animated subtree, so it always reads the target. */
const FONT_PROBE = '[data-probe="font"]';

/** Scoped to the card — the dark-mode switch renders a checkbox earlier in the host. */
const USERNAME_INPUT = '.token-preview input:not([type="password"])';

type Pill = { id: string; hue: Hue; label: string; value: string; position: string };

/** Opaque computed colors serialize as `color(srgb 0..1 …)` or `rgb(0..255 …)` — show hex instead. */
function toHex(color: string): string {
  const parts = color
    .match(/[\d.]+/g)
    ?.slice(0, 3)
    .map(Number);
  if (!parts || parts.length < 3) {
    return color;
  }
  const scale = color.startsWith('color(') ? 255 : 1;
  return `#${parts
    .map(p =>
      Math.round(p * scale)
        .toString(16)
        .padStart(2, '0')
    )
    .join('')}`;
}

@Component({
  selector: 'jig-docs-theming-section',
  imports: [
    JigDocsSectionShell,
    JigDocsThemePicker,
    JigSwitch,
    JigButton,
    JigIcon,
    JigInput,
    JigInputField,
  ],
  // Theme switches swap token values instantly. Easing everything inside the
  // preview turns the swap into a visible re-theme — the point of the section.
  // `::ng-deep` because the radius/padding live on the controls' own internals.
  styles: `
    :host ::ng-deep .token-preview,
    :host ::ng-deep .token-preview * {
      transition:
        margin 500ms ease,
        padding 500ms ease,
        gap 500ms ease,
        font-size 500ms ease,
        line-height 500ms ease,
        border-radius 500ms ease;
    }

    /* Markers are sized and placed off the tokens they measure, so they have to
       move with them — otherwise they jump while the card eases. */
    :host ::ng-deep .token-preview .token-marker {
      transition:
        width 500ms ease,
        height 500ms ease,
        top 500ms ease,
        left 500ms ease,
        right 500ms ease;
    }

    /* Pills are positioned as a share of a wrapper whose height follows the card. */
    .token-pill {
      transition: top 500ms ease;
    }

    @media (prefers-reduced-motion: reduce) {
      :host ::ng-deep .token-preview,
      :host ::ng-deep .token-preview *,
      :host ::ng-deep .token-preview .token-marker,
      .token-pill {
        transition: none;
      }
    }
  `,
  template: `
    <jig-docs-section-shell
      layout="split-left"
      eyebrow="Theming"
      heading="Your design system, not ours"
      subtitle="Every color, space and radius is a design token. Pick a theme and a color — every control follows."
    >
      <div primary>
        <div class="mb-(--jig-size-padding-xl) flex items-center gap-(--jig-size-padding-md)">
          <jig-switch
            #darkSwitch
            [value]="colorScheme.isDark()"
            (valueChange)="colorScheme.set($event ? 'dark' : 'light')"
          />
          <label [for]="darkSwitch.inputId()" class="text-(--jig-color-text)">Dark mode</label>
        </div>

        <jig-docs-theme-picker />
      </div>

      <!-- Gutters around the card are the pills' only breathing room: vertical at
           every width, horizontal only from lg (a phone has no room to spare). -->
      <div secondary class="relative pt-11 pb-14 lg:px-28">
        <span
          aria-hidden="true"
          data-probe="primary"
          class="absolute size-0 text-(--jig-color-primary-500)"
        ></span>
        <span
          aria-hidden="true"
          data-probe="surface"
          class="absolute size-0 text-(--jig-color-surface-500)"
        ></span>
        <!-- A real field carrying the theme's input styling, but outside
             .token-preview so none of it transitions. Reads here return the
             incoming value immediately instead of a frame of the ease. -->
        <div aria-hidden="true" inert class="absolute size-0 overflow-hidden opacity-0">
          <jig-input-field>
            <input ngnInput data-probe="font" tabindex="-1" />
          </jig-input-field>
        </div>

        <div class="card token-preview relative p-(--jig-size-padding-xl)">
          <!-- Card radius: square nested in the corner with the card's own radius, so
               its arc traces the card's. Offset -1px puts its border box on the card's,
               since absolute coords start inside the border. -->
          <div
            aria-hidden="true"
            class="token-marker absolute -top-px -left-px size-5 border-2"
            [style.border-radius]="'var(--jig-size-rounded-lg)'"
            [style.border-color]="hue('radius')"
          ></div>

          <!-- Padding: bar spanning content edge → border edge, capped at both ends.
               Sits beside its pill in the right gutter, so it only shows from lg. -->
          <div
            aria-hidden="true"
            class="token-marker absolute top-1/2 right-0 hidden h-2 w-(--jig-size-padding-xl) -translate-y-1/2 border-x lg:block"
            [style.border-color]="hue('padding')"
          >
            <div
              class="absolute top-1/2 left-0 h-px w-full"
              [style.background-color]="hue('padding')"
            ></div>
          </div>

          <!-- Surface: dot on bare card background — the bottom row is all buttons. -->
          @if (picker.activeOption().surfaces) {
            <div
              aria-hidden="true"
              class="token-marker absolute top-(--jig-size-padding-xl) right-(--jig-size-padding-xl) size-1.5 rounded-full"
              [style.background-color]="hue('surface')"
            ></div>
          }

          <!-- Indented clear of the corner marker. -->
          <p
            class="mono mb-(--jig-size-padding-lg) pl-2 text-(length:--jig-font-size-sm) text-(--jig-color-surface-500)"
          >
            live preview · {{ picker.activeOption().label }}
          </p>
          <h3
            class="mb-(--jig-size-padding-lg) text-(length:--jig-font-size-lg) font-(--jig-font-weight-bold) text-(--jig-color-text)"
          >
            Sign in
          </h3>

          <div class="flex flex-col gap-(--jig-size-padding-sm)">
            <label
              class="text-(length:--jig-font-size-sm) font-(--jig-font-weight-medium) text-(--jig-color-text)"
              [for]="usernameField.inputId()"
            >
              Username
            </label>
            <div class="relative">
              <jig-input-field #usernameField class="w-full">
                <jig-icon [icon]="userIcon" />
                <input ngnInput autocomplete="off" [placeholder]="username" />
              </jig-input-field>
              <!-- Font size: ruler under real text, not the password's masking dots.
                   Width comes from a hidden copy of the placeholder wearing the input's
                   own font, so it measures the actual glyphs (themes differ in size AND
                   family, so inheriting would be wrong). Hidden below lg with its pill. -->
              <div
                aria-hidden="true"
                class="token-marker absolute bottom-1 hidden h-2 overflow-hidden border-x lg:block"
                [style.left.px]="rulerLeft()"
                [style.border-color]="hue('fontSize')"
              >
                <span class="invisible" [style]="rulerFont()">{{ username }}</span>
                <div
                  class="absolute top-1/2 left-0 h-px w-full"
                  [style.background-color]="hue('fontSize')"
                ></div>
              </div>
            </div>
          </div>

          <div class="mt-(--jig-size-padding-lg) flex flex-col gap-(--jig-size-padding-sm)">
            <label
              class="text-(length:--jig-font-size-sm) font-(--jig-font-weight-medium) text-(--jig-color-text)"
              [for]="passwordField.inputId()"
            >
              Password
            </label>
            <div class="relative">
              <jig-input-field #passwordField class="w-full">
                <jig-icon [icon]="lockIcon" />
                <!-- Indent clears the corner marker. -->
                <input
                  ngnInput
                  type="password"
                  autocomplete="off"
                  placeholder="••••••••"
                  class="lg:pl-6"
                />
              </jig-input-field>
              <!-- Field radius: same token family as the card, usually a smaller value. -->
              <div
                aria-hidden="true"
                class="token-marker absolute top-0 left-0 hidden size-5 border-2 lg:block"
                [style.border-radius]="'var(--jig-size-rounded-md)'"
                [style.border-color]="hue('radius')"
              ></div>
            </div>
          </div>

          <div class="mt-(--jig-size-padding-xl) flex gap-(--jig-size-padding-md)">
            <div class="relative flex-1">
              <button ngnButton kind="primary" class="w-full justify-center">Sign in</button>
              <!-- Primary: dot inside the button on the side its pill sits — far
                   enough in to clear the corner arc at every theme's radius. -->
              <div
                aria-hidden="true"
                class="absolute bottom-2 left-2 size-2 rounded-full border border-solid border-black"
                [style.background-color]="hue('primary')"
              ></div>
            </div>
            <div class="relative">
              <button ngnButton kind="secondary">Cancel</button>
              <!-- Padding again, vertically: the gap under the button IS the card's
                   bottom padding, so top-full measures it with no magic number. -->
              <div
                aria-hidden="true"
                class="token-marker absolute top-full left-1/2 h-(--jig-size-padding-xl) w-2 -translate-x-1/2 border-y"
                [style.border-color]="hue('padding')"
              >
                <div
                  class="absolute top-0 left-1/2 h-full w-px"
                  [style.background-color]="hue('padding')"
                ></div>
              </div>
            </div>
          </div>
        </div>

        @for (pill of pills(); track pill.id) {
          <span
            class="mono token-pill absolute rounded-(--jig-size-rounded-sm) border px-1.5 py-0.5 text-[10px] whitespace-nowrap"
            [class]="pill.position"
            [style.color]="hue(pill.hue)"
            [style.border-color]="'color-mix(in srgb, ' + hue(pill.hue) + ' 45%, transparent)'"
            [style.background-color]="
              'color-mix(in srgb, ' + hue(pill.hue) + ' 12%, var(--jig-color-background))'
            "
          >
            {{ pill.label }}: {{ pill.value }}
          </span>
        }
      </div>
    </jig-docs-section-shell>
  `,
})
export class JigDocsThemingSection {
  protected readonly colorScheme = inject(ColorSchemeService);
  protected readonly picker = inject(ThemePickerService);

  protected readonly userIcon = tablerUser;
  protected readonly lockIcon = tablerLock;

  /** Shared by the field and the hidden copy the font-size ruler measures. */
  protected readonly username = 'jane.doe';

  private readonly _values = signal<Record<string, string>>({});

  private readonly _rulerLeft = signal(12);

  private readonly _rulerFont = signal<Record<string, string>>({});

  /** Left edge of the font-size ruler, tracking the input's theme-owned padding. */
  protected readonly rulerLeft = this._rulerLeft.asReadonly();

  /** The input's own font, copied onto the hidden string the ruler measures. */
  protected readonly rulerFont = this._rulerFont.asReadonly();

  /**
   * Each pill sits in the gutter beside the indicator it names. The two side
   * gutters only exist from lg, so the pills that need one are hidden below it;
   * `padding` moves to the bottom gutter instead of disappearing.
   */
  protected readonly pills = computed(() => {
    const value = (key: string): string => this._values()[key] ?? '…';
    const pills: Pill[] = [
      {
        id: 'radiusCard',
        hue: 'radius',
        label: 'radius',
        value: value('radiusCard'),
        position: 'top-0 left-0 lg:left-28',
      },
      {
        id: 'radiusField',
        hue: 'radius',
        label: 'radius',
        value: value('radiusField'),
        position: 'hidden lg:top-[62%] lg:left-0 lg:block',
      },
      {
        // Below lg it points at the ruler under Cancel instead of the side bar.
        id: 'padding',
        hue: 'padding',
        label: 'padding',
        value: value('padding'),
        position: 'right-0 bottom-0 lg:top-[47%] lg:bottom-auto',
      },
      {
        id: 'fontSize',
        hue: 'fontSize',
        label: 'fontSize',
        value: value('fontSize'),
        position: 'hidden lg:top-[44%] lg:left-0 lg:block',
      },
      {
        id: 'primary',
        hue: 'primary',
        label: 'primary',
        // Both offsets land on the card's left edge — the Sign-in button starts there.
        value: value('primary'),
        position: 'bottom-0 left-0 lg:left-28',
      },
    ];
    if (this.picker.activeOption().surfaces) {
      pills.push({
        id: 'surface',
        hue: 'surface',
        label: 'surface',
        value: value('surface'),
        position: 'top-0 right-0 lg:right-28',
      });
    }
    return pills;
  });

  protected hue(key: Hue): string {
    return this.colorScheme.isDark() ? HUES[key].dark : HUES[key].light;
  }

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    // font-size and padding are transitioned, so reading them when the theme
    // changes returns the OUTGOING value. Applying a theme is itself async, so a
    // Computed values only exist in the browser, so re-read them after render
    // whenever the selection changes.
    afterRenderEffect(() => {
      this.picker.themeId();
      this.picker.selectedColor();
      this.picker.selectedSurface();
      this.colorScheme.isDark();
      this._measure(host);
    });
  }

  private _measure(host: HTMLElement): void {
    const styles = getComputedStyle(host);
    const read = (selector: string, prop: 'color' | 'fontSize'): string | undefined => {
      const el = host.querySelector(selector);
      return el ? getComputedStyle(el)[prop] : undefined;
    };
    // Color custom properties hold an unresolved `hsl(from …)`, so read the
    // resolved color off a probe element that consumes them.
    this._values.set({
      radiusCard: styles.getPropertyValue('--jig-size-rounded-lg').trim() || '…',
      radiusField: styles.getPropertyValue('--jig-size-rounded-md').trim() || '…',
      padding: styles.getPropertyValue('--jig-size-padding-xl').trim() || '…',
      primary: toHex(read('[data-probe="primary"]', 'color') ?? '…'),
      surface: toHex(read('[data-probe="surface"]', 'color') ?? '…'),
      fontSize: read(FONT_PROBE, 'fontSize') ?? '…',
    });

    // The ruler starts where the glyphs do. The inset is the field's border plus
    // the input's own padding — the latter theme-owned, so take it off the probe.
    const probe = host.querySelector(FONT_PROBE);
    const input = host.querySelector(USERNAME_INPUT);
    const wrapper = input?.closest('.relative');
    if (probe && input && wrapper) {
      const style = getComputedStyle(probe);
      const border = input.getBoundingClientRect().x - wrapper.getBoundingClientRect().x;
      this._rulerLeft.set(border + (parseFloat(style.paddingLeft) || 0));
      this._rulerFont.set({
        'font-family': style.fontFamily,
        'font-size': style.fontSize,
        'font-weight': style.fontWeight,
        'letter-spacing': style.letterSpacing,
      });
    }
  }
}
