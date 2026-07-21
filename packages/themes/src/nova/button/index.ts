import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  colorsTemplate,
  fontTemplate,
  sizesTemplate,
  themedColors,
} from '@ngneers/controls-themes/nova/base';
import { buttonControlTemplate } from '@ngneers/controls-themes/templates/button';

export const buttonStyles = createThemePart({
  controlTemplate: buttonControlTemplate,
  base: baseStyles.button,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${themedColors(c, v)}

      ${c('root')} {
        --padding: ${v('size.padding.md')} ${v('size.padding.lg')};
        border-radius: ${v('size.rounded.md')};
        border-style: none;
        font-weight: ${v('font.weight.semibold')};
        padding: var(--padding);
        gap: ${v('size.padding.md')};
        cursor: pointer;
        &:disabled {
          cursor: default;
          color: ${v('color.disabled.text')};
        }
      }

      ${c('kind-primary')} {
        background: var(--theme-color-500);
        color: var(--theme-color-500-contrast);
        &:disabled {
          background: ${v('color.disabled.background')};
        }
        &:hover:not(:disabled) {
          background: var(--theme-color-400);
        }
        &:focus:not(:disabled) {
          background: var(--theme-color-300);
        }
        &:active:not(:disabled) {
          background: var(--theme-color-200);
        }
      }
      ${c('kind-secondary')} {
        background: transparent;
        &:hover:not(:disabled) {
          background: var(--theme-color-100);
        }
        &:focus:not(:disabled) {
          background: var(--theme-color-200);
        }
        &:active:not(:disabled) {
          background: var(--theme-color-300);
        }
      }
      ${c('kind-text')} {
        background: transparent;
        color: var(--theme-color-500);
        &:hover:not(:disabled) {
          color: var(--theme-color-600);
        }
        &:focus:not(:disabled) {
          color: var(--theme-color-700);
        }
        &:active:not(:disabled) {
          color: var(--theme-color-800);
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
          background: var(--theme-color-100);
        }
        &:focus:not(:disabled) {
          background: var(--theme-color-200);
        }
        &:active:not(:disabled) {
          background: var(--theme-color-300);
        }
      }
      ${c('kind-link')} {
        text-decoration: underline;
        background: transparent;
        color: var(--theme-color-500);
        &:hover:not(:disabled) {
          color: var(--theme-color-600);
        }
        &:focus:not(:disabled) {
          color: var(--theme-color-700);
        }
        &:active:not(:disabled) {
          color: var(--theme-color-800);
        }
      }
    `,
  },
});
