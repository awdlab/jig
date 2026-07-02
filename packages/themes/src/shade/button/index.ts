import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  focusRing,
  focusRingSetup,
  fontTemplate,
  shadowTemplate,
  sizesTemplate,
  slotColors,
} from '@ngneers/controls-themes/shade/base';
import { buttonControlTemplate } from '@ngneers/controls-themes/templates/button';

export const buttonStyles = createThemePart({
  controlTemplate: buttonControlTemplate,
  base: baseStyles.button,
  dependencies: [animationTemplate, colorsTemplate, fontTemplate, shadowTemplate, sizesTemplate],
  root: {
    css: ({ v, c }) => css`
      ${slotColors(c, v)}

      ${c('root')} {
        /* focus-ring contract (see focusRingSetup): kinds override --shade-shadow / --shade-ring */
        ${focusRingSetup(v)}
        box-sizing: border-box;
        /* transparent border keeps bordered (outline) and borderless kinds pixel-identical */
        border: 1px solid transparent;
        border-radius: ${v('size.rounded.md')};
        font-family: ${v('font.family')};
        font-size: ${v('font.size.sm')};
        font-weight: ${v('font.weight.medium')};
        padding: ${v('size.padding.md')} ${v('size.padding.xl')};
        gap: ${v('size.padding.sm')};
        justify-content: center;
        cursor: pointer;
        box-shadow: var(--shade-shadow);
        transition-property: color, background-color, border-color, box-shadow, transform;
        transition-duration: ${v('anim.time.snappyFade')};
        transition-timing-function: ${v('anim.ease.snappyFade')};
        ${focusRing}
        /* universal tactile press feedback for every kind */
        &:active:not(:disabled) {
          transform: scale(0.97);
        }
        &:disabled {
          cursor: default;
          opacity: 0.5;
        }
        &${c('inline')} {
          height: 1lh;
          min-width: 1lh;
          padding: 0 ${v('size.padding.sm')};
        }
      }

      /* Shared kind vocabulary across all themes: primary | secondary | text | icon | link.
       * 'destructive' is NOT a kind — it is a color slot (color="destructive"); a destructive
       * button is kind="primary" color="destructive", which retints --theme-bg/--theme-fg. */

      /* primary — filled. Shifts the background toward its OWN foreground on hover/active: an
       * opaque tonal change that stays visible whether the button is dark (zinc primary) or a
       * light color slot on a white page, unlike mixing toward transparent. */
      ${c('kind-primary')} {
        --btn-bg: var(--theme-bg, ${v('color.primary.base')});
        --btn-fg: var(--theme-fg, ${v('color.primary.foreground')});
        --shade-shadow: ${v('shadow.sm')};
        background: var(--btn-bg);
        color: var(--btn-fg);
        &:hover:not(:disabled) {
          background: color-mix(in srgb, var(--btn-bg) 88%, var(--btn-fg));
        }
        &:active:not(:disabled) {
          background: color-mix(in srgb, var(--btn-bg) 78%, var(--btn-fg));
        }
      }

      /* secondary — outline (shadcn 'outline'): bordered, transparent fill, hover accent. */
      ${c('kind-secondary')} {
        --shade-shadow: ${v('shadow.sm')};
        border-color: ${v('color.border')};
        background: ${v('color.background')};
        &:hover:not(:disabled) {
          background: ${v('color.accent.base')};
          color: ${v('color.accent.foreground')};
        }
        &:active:not(:disabled) {
          background: color-mix(in srgb, ${v('color.accent.base')} 82%, ${v('color.foreground')});
        }
        &:focus-visible {
          border-color: ${v('color.ring')};
        }
      }

      /* text — ghost (shadcn 'ghost'): no border/fill, hover accent. */
      ${c('kind-text')} {
        background: transparent;
        &:hover:not(:disabled) {
          background: ${v('color.accent.base')};
          color: ${v('color.accent.foreground')};
        }
        &:active:not(:disabled) {
          background: color-mix(in srgb, ${v('color.accent.base')} 82%, ${v('color.foreground')});
        }
      }

      /* Square, ghost-style icon-only button. Kept because the built-in controls (dialog/toast
       * close, paginator nav, calendar nav, input-field clear, …) reference kind="icon".
       * NOTE: the paginator sizes its page buttons with an inline
       * width: calc(1rem + 2 * var(--padding)) — so --padding MUST be defined here or those
       * buttons collapse to inconsistent widths. */
      ${c('kind-icon')} {
        --padding: ${v('size.padding.md')};
        background: transparent;
        padding: var(--padding);
        width: calc(1em + 2 * var(--padding));
        height: calc(1em + 2 * var(--padding));
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover:not(:disabled) {
          background: ${v('color.accent.base')};
          color: ${v('color.accent.foreground')};
        }
        &:active:not(:disabled) {
          background: color-mix(in srgb, ${v('color.accent.base')} 82%, ${v('color.foreground')});
        }
        &${c('inline')} {
          height: 1lh;
          width: 1lh;
        }
      }

      ${c('kind-link')} {
        background: transparent;
        /* slot base color doubles as link text color */
        color: var(--theme-bg, ${v('color.primary.base')});
        text-decoration: none;
        text-underline-offset: 4px;
        &:hover:not(:disabled) {
          text-decoration: underline;
        }
      }
    `,
  },
});
