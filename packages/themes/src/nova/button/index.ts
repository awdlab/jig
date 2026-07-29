import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  colorsTemplate,
  fontTemplate,
  ringTemplate,
  shadowTemplate,
  sizesTemplate,
  themedColors,
} from '@ngneers/controls-themes/nova/base';
import { buttonControlTemplate } from '@ngneers/controls-themes/templates/button';

export const buttonStyles = createThemePart({
  controlTemplate: buttonControlTemplate,
  base: baseStyles.button,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, shadowTemplate, ringTemplate],
  root: {
    css: ({ v, c }) => css`
      ${themedColors(c, v)}

      ${c('root')} {
        --padding: ${v('size.padding.md')} ${v('size.padding.lg')};
        border-radius: ${v('size.rounded.md')};
        border: 1px solid transparent;
        font-weight: ${v('font.weight.semibold')};
        padding: var(--padding);
        gap: ${v('size.padding.md')};
        cursor: pointer;
        /* Colour only transitions for kinds that opt in: crossfading text against a moving
           background passes through a low-contrast midpoint and reads as muddy. */
        transition:
          color var(--color-transition, 0s) ease,
          background 0.18s ease,
          border-color 0.18s ease,
          box-shadow 0.18s ease;
        &:disabled {
          cursor: default;
          color: ${v('color.disabled.text')};
        }
        &:focus-visible:not(:disabled) {
          outline: none;
          box-shadow: 0 0 0 3px
            color-mix(in oklab, var(--theme-color-500) ${v('ring.alpha')}, transparent);
        }
      }

      /* Single-line buttons share the control height; inline buttons track the
         surrounding line height instead, and links stay text-sized. */
      ${c('root')}:not(${c('inline')}):not(${c('kind-link')}) {
        height: ${v('size.height.control')};
        padding: 0 ${v('size.padding.lg')};
      }

      ${c('kind-primary')} {
        background: var(--theme-color-500);
        color: var(--theme-color-500-contrast);
        border-color: var(--theme-color-500);
        box-shadow: ${v('shadow.sm')};
        &:disabled {
          background: ${v('color.disabled.background')};
          border-color: ${v('color.disabled.background')};
          box-shadow: none;
        }
        &:hover:not(:disabled) {
          background: var(--theme-color-600);
          border-color: var(--theme-color-600);
          box-shadow: ${v('shadow.md')};
        }
        &:active:not(:disabled) {
          background: var(--theme-color-700);
          border-color: var(--theme-color-700);
          box-shadow: ${v('shadow.sm')};
        }
      }
      ${c('kind-secondary')} {
        --color-transition: 0.18s;
        background: ${v('color.surface.50')};
        border-color: ${v('color.border')};
        color: ${v('color.text')};
        &:hover:not(:disabled) {
          border-color: var(--theme-color-500);
          color: var(--theme-color-600);
        }
        &:active:not(:disabled) {
          background: ${v('color.surface.200')};
        }
        &:disabled {
          background: ${v('color.disabled.background')};
          border-color: ${v('color.disabled.border')};
        }
      }
      ${c('kind-text')} {
        background: transparent;
        color: var(--theme-color-600);
        &:hover:not(:disabled) {
          background: color-mix(in oklab, var(--theme-color-500) 10%, transparent);
        }
        &:active:not(:disabled) {
          background: color-mix(in oklab, var(--theme-color-500) 16%, transparent);
        }
      }
      ${c('kind-icon')} {
        background: ${v('color.surface.100')};
        border-radius: ${v('size.rounded.md')};
        --padding: ${v('size.padding.md')};

        width: calc(1em + 2 * var(--padding)); /** font size plus padding */
        height: calc(1em + 2 * var(--padding));
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${v('color.text')};

        &:hover:not(:disabled) {
          background: ${v('color.surface.200')};
        }
        &:active:not(:disabled) {
          background: ${v('color.surface.300')};
        }
        &:disabled {
          background: ${v('color.disabled.background')};
        }
      }
      /* Inline icon buttons sit inside other chrome (field clear button, edit-inplace),
         where a resting fill would read as a box inside the host control. */
      ${c('kind-icon')}${c('inline')} {
        background: transparent;
        &:hover:not(:disabled) {
          background: ${v('color.surface.100')};
        }
        &:active:not(:disabled) {
          background: ${v('color.surface.200')};
        }
        &:disabled {
          background: transparent;
        }
      }
      /* Square at the shared control height so icon buttons line up with fields. */
      ${c('kind-icon')}:not(${c('inline')}) {
        width: ${v('size.height.control')};
        height: ${v('size.height.control')};
        padding: 0;
      }
      ${c('kind-link')} {
        --color-transition: 0.18s;
        text-decoration: underline;
        text-underline-offset: 3px;
        color: var(--theme-color-600);
        &:hover:not(:disabled) {
          color: var(--theme-color-700);
        }
        &:active:not(:disabled) {
          color: var(--theme-color-800);
        }
        &:disabled {
          text-decoration-color: ${v('color.disabled.text')};
        }
        /* An inline ring must clear the text it wraps, so the link renders the shared ring
           as an offset outline instead of a hugging shadow. */
        &:focus-visible:not(:disabled) {
          box-shadow: none;
          outline: 3px solid
            color-mix(in oklab, var(--theme-color-500) ${v('ring.alpha')}, transparent);
          outline-offset: 3px;
          border-radius: 2px;
        }
      }
    `,
  },
});
