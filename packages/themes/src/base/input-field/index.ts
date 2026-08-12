import { createThemePart, css } from '@awdlab/jig-themes/api';
import { inputFieldControlTemplate } from '@awdlab/jig-themes/templates/input-field';

export const inputFieldStyles = createThemePart({
  controlTemplate: inputFieldControlTemplate,
  dependencies: [],
  root: {
    css: ({ c, d }) => css`
      ${c('host')} {
        display: block;
      }
      ${c('root')} {
        cursor: text;
        display: flex;
        align-items: center;
        width: 100%;
        min-height: fit-content;
        overflow: auto;
        /* Special handling for bitwarden autofill scale animation (causes unwanted overflow): */
        &:has(.com-bitwarden-browser-animated-fill) {
          overflow: hidden;
        }
        &:has(textarea) {
          resize: both;
        }

        /* The input covers the field's padding via negative margins, so clicks in
           the padding hit the input and the browser places the caret and starts
           selections itself. Themes publish their padding as --fieldPadX/Y. Width
           grows by exactly what the margins pull back, keeping the input's outer
           box — and the text area inside it — where it was. Matched at any depth so
           a nested input (editable select) claims the padding too. A label rendered
           inside the field grows the top padding, published as --fieldPadTop. */
        & ${d('input', 'root')} {
          background: transparent;
          border: none;
          outline: none;
          resize: none;
          box-sizing: border-box;
          align-self: stretch;
          --fieldClaimStart: var(--fieldPadX, 0px);
          --fieldClaimEnd: var(--fieldPadX, 0px);
          --fieldClaimTop: var(--fieldPadTop, var(--fieldPadY, 0px));
          width: calc(100% + var(--fieldClaimStart) + var(--fieldClaimEnd));
          margin-block: calc(-1 * var(--fieldClaimTop)) calc(-1 * var(--fieldPadY, 0px));
          margin-inline: calc(-1 * var(--fieldClaimStart)) calc(-1 * var(--fieldClaimEnd));
          padding-block: var(--fieldClaimTop) var(--fieldPadY, 0px);
          padding-inline: var(--fieldClaimStart) var(--fieldClaimEnd);
        }
        /* Anything following the input — a sibling (select's dropdown icon) or a sibling of
           one of its wrappers (the field's clear button) — owns the trailing strip. */
        & ${d('input', 'root')}:not(:last-child), & :not(:last-child) ${d('input', 'root')} {
          --fieldClaimEnd: 0px;
        }
        /* Same for anything preceding it (tag-input's tags): without this the input's
           negative leading margin covers that content and swallows its clicks. */
        & ${d('input', 'root')}:not(:first-child), & :not(:first-child) ${d('input', 'root')} {
          --fieldClaimStart: 0px;
        }

        &:has(${d('input', 'root')}:disabled), &:has(${d('mask', 'disabled')}) {
          cursor: default;
        }
        &:has(${d('input', 'root')}[aria-readonly]), &:has(${d('input', 'root')}:read-only), &:has(${d('mask', 'readonly')}) {
          cursor: default;
        }

        /* A projected non-editable select trigger opens on a click anywhere in the field. */
        &:has([role='combobox']:not(input):not([disabled]):not([aria-readonly='true'])) {
          cursor: pointer;
        }
      }

      ${c('root')}:has(${d('input', 'empty')}) ${c('clear-button')} {
        display: none;
      }

      /* Marker text lives in CSS so it stays out of the accessibility tree and
         themes can swap the character. */
      ${c('required-marker')}::after {
        content: '*';
      }
    `,
  },
});
