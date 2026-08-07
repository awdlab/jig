import { createThemePart, css } from '@ngneers/controls-themes/api';
import { buttonControlTemplate } from '@ngneers/controls-themes/templates/button';

export const buttonStyles = createThemePart({
  controlTemplate: buttonControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        font-family: inherit;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      ${c('kind-icon')}${c('inline')} {
        height: 1lh;
        width: 1lh;
        /* WCAG 2.5.8 — a pointer target stays at least 24x24 CSS px even when the
           surrounding line box is smaller. */
        min-height: 24px;
        min-width: 24px;
        --padding: 0px;
        padding: 0;
        /* Inline-level so it can sit in a line of text. As a flex/grid item — every internal
           use, e.g. a field's clear button — this blockifies back to flex, so those slots are
           unaffected. */
        display: inline-flex;
        vertical-align: middle;
      }
      /* The link kind is a text-level control, not a box: it flows inside running text, wraps
         with it and inherits the surrounding typography. Compounded with the root class so it
         wins over the theme's button chrome (padding, height, font) — themes only add colour,
         decoration and the focus ring. */
      ${c('root')}${c('kind-link')} {
        display: inline;
        font: inherit;
        text-align: inherit;
        padding: 0;
        border: none;
        background: none;
        width: auto;
        height: auto;
        /* A block-level icon would break the link's line box. */
        ngn-icon {
          display: inline-flex;
          vertical-align: -0.15em;
        }
      }
    `,
  },
});
