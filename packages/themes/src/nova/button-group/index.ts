import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@awdlab/jig-themes/nova/base';
import { buttonGroupControlTemplate } from '@awdlab/jig-themes/templates/button-group';

export const buttonGroupStyles = createThemePart({
  controlTemplate: buttonGroupControlTemplate,
  base: baseStyles.buttonGroup,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c, d }) => css`
      /* Buttons sit flush against each other, so a focused button's ring is otherwise
         painted over by its neighbors. Lift the focused item above its siblings so the
         ring renders on every side. */
      ${c('horizontal')}, ${c('vertical')} {
        &
        > ${d('button', 'root')}:focus-visible,
        &
        > ${d('toggle-button', 'root')}
        ${d('toggle-button', 'button')}:focus-visible {
          position: relative;
          z-index: 1;
        }
      }
      ${c('horizontal')} {
        /* Regular button */
        & > ${d('button', 'root')} {
          &:first-child {
            border-start-start-radius: ${v('size.rounded.md')};
            border-end-start-radius: ${v('size.rounded.md')};
          }
          &:last-child {
            border-start-end-radius: ${v('size.rounded.md')};
            border-end-end-radius: ${v('size.rounded.md')};
          }
          &:not(:last-child) {
            border-inline-end: 1px solid var(--theme-color-300);
          }
        }

        /* Toggle button */
        & > ${d('toggle-button', 'root')} {
          &:first-child ${d('toggle-button', 'button')} {
            border-start-start-radius: ${v('size.rounded.md')};
            border-end-start-radius: ${v('size.rounded.md')};
          }
          &:last-child ${d('toggle-button', 'button')} {
            border-start-end-radius: ${v('size.rounded.md')};
            border-end-end-radius: ${v('size.rounded.md')};
          }
          &:not(:last-child) ${d('toggle-button', 'button')} {
            border-inline-end: none;
          }
        }
      }
      ${c('vertical')} {
        & > ${d('button', 'root')}, & > ${d('toggle-button', 'root')} {
          width: 100%;
          &:first-child,
          &:first-child ${d('toggle-button', 'button')} {
            border-start-start-radius: ${v('size.rounded.md')};
            border-start-end-radius: ${v('size.rounded.md')};
          }
          &:last-child,
          &:last-child ${d('toggle-button', 'button')} {
            border-end-start-radius: ${v('size.rounded.md')};
            border-end-end-radius: ${v('size.rounded.md')};
          }
        }
      }
    `,
  },
});
