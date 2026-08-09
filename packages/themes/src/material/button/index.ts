import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  fontTemplate,
  shadowTemplate,
  sizesTemplate,
  themedColors,
} from '@awdlab/jig-themes/material/base';
import { buttonControlTemplate } from '@awdlab/jig-themes/templates/button';

export const buttonStyles = createThemePart({
  controlTemplate: buttonControlTemplate,
  base: baseStyles.button,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, shadowTemplate, animationTemplate],
  root: {
    css: ({ v, c }) => css`
      ${themedColors(c, v)}

      ${c('root')} {
        --padding: ${v('size.padding.md')} ${v('size.padding.lg')};
        border-radius: ${v('size.rounded.md')};
        border-style: none;
        font-family: ${v('font.family')};
        font-weight: ${v('font.weight.medium')};
        padding: var(--padding);
        gap: ${v('size.padding.md')};
        cursor: pointer;
        transition:
          background ${v('anim.ease.fade')} ${v('anim.time.fade')},
          box-shadow ${v('anim.ease.fade')} ${v('anim.time.fade')};
        &:disabled {
          cursor: default;
          color: ${v('color.disabled.text')};
        }
        &:focus-visible {
          outline: 2px solid color-mix(in srgb, var(--theme-color-500) 50%, transparent);
          outline-offset: 2px;
        }
      }

      ${c('kind-primary')} {
        background: var(--theme-color-500);
        color: var(--theme-color-500-contrast);
        box-shadow: ${v('shadow.sm')};
        &:disabled {
          background: ${v('color.disabled.background')};
          box-shadow: none;
        }
        &:hover:not(:disabled) {
          background: color-mix(
            in srgb,
            var(--theme-color-500) 92%,
            var(--theme-color-500-contrast)
          );
          box-shadow: ${v('shadow.md')};
        }
        &:focus-visible:not(:disabled) {
          background: color-mix(
            in srgb,
            var(--theme-color-500) 90%,
            var(--theme-color-500-contrast)
          );
        }
        &:active:not(:disabled) {
          background: color-mix(
            in srgb,
            var(--theme-color-500) 88%,
            var(--theme-color-500-contrast)
          );
          box-shadow: ${v('shadow.sm')};
        }
      }
      ${c('kind-secondary')} {
        background: transparent;
        color: var(--theme-color-foreground);
        border: 1px solid var(--theme-color-foreground);
        &:disabled {
          border-color: ${v('color.disabled.border')};
        }
        &:hover:not(:disabled) {
          background: color-mix(in srgb, var(--theme-color-500) 8%, transparent);
        }
        &:focus-visible:not(:disabled) {
          background: color-mix(in srgb, var(--theme-color-500) 12%, transparent);
        }
        &:active:not(:disabled) {
          background: color-mix(in srgb, var(--theme-color-500) 12%, transparent);
        }
      }
      ${c('kind-text')} {
        background: transparent;
        color: var(--theme-color-foreground);
        &:hover:not(:disabled) {
          background: color-mix(in srgb, var(--theme-color-500) 8%, transparent);
        }
        &:focus-visible:not(:disabled) {
          background: color-mix(in srgb, var(--theme-color-500) 12%, transparent);
        }
        &:active:not(:disabled) {
          background: color-mix(in srgb, var(--theme-color-500) 12%, transparent);
        }
      }
      ${c('kind-icon')} {
        background: transparent;
        border-radius: ${v('size.rounded.full')};
        --padding: ${v('size.padding.md')};

        width: calc(1em + 2 * var(--padding)); /** font size plus padding */
        height: calc(1em + 2 * var(--padding));
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover:not(:disabled) {
          background: color-mix(in srgb, var(--theme-color-500) 8%, transparent);
        }
        &:focus-visible:not(:disabled) {
          background: color-mix(in srgb, var(--theme-color-500) 12%, transparent);
        }
        &:active:not(:disabled) {
          background: color-mix(in srgb, var(--theme-color-500) 12%, transparent);
        }
      }
      /* Inline text link: no background chrome — a tint behind wrapped lines reads as a broken
         box. The root's offset focus outline already clears the text. */
      ${c('kind-link')} {
        text-decoration: none;
        text-underline-offset: 3px;
        color: var(--theme-color-500);
        &:hover:not(:disabled),
        &:focus-visible:not(:disabled) {
          text-decoration: underline;
        }
        &:active:not(:disabled) {
          color: color-mix(in srgb, var(--theme-color-500) 80%, var(--theme-color-foreground));
        }
      }
    `,
  },
});
