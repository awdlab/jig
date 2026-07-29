import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { buttonGroupControlTemplate } from '@ngneers/controls-themes/templates/button-group';

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
            border-top-left-radius: ${v('size.rounded.md')};
            border-bottom-left-radius: ${v('size.rounded.md')};
          }
          &:last-child {
            border-top-right-radius: ${v('size.rounded.md')};
            border-bottom-right-radius: ${v('size.rounded.md')};
          }
          &:not(:last-child) {
            border-right: 1px solid var(--theme-color-300);
          }
        }

        /* Toggle button */
        & > ${d('toggle-button', 'root')} {
          &:first-child ${d('toggle-button', 'button')} {
            border-top-left-radius: ${v('size.rounded.md')};
            border-bottom-left-radius: ${v('size.rounded.md')};
          }
          &:last-child ${d('toggle-button', 'button')} {
            border-top-right-radius: ${v('size.rounded.md')};
            border-bottom-right-radius: ${v('size.rounded.md')};
          }
          &:not(:last-child) ${d('toggle-button', 'button')} {
            border-right: none;
          }
        }
      }
      ${c('vertical')} {
        & > ${d('button', 'root')}, & > ${d('toggle-button', 'root')} {
          width: 100%;
          &:first-child,
          &:first-child ${d('toggle-button', 'button')} {
            border-top-left-radius: ${v('size.rounded.md')};
            border-top-right-radius: ${v('size.rounded.md')};
          }
          &:last-child,
          &:last-child ${d('toggle-button', 'button')} {
            border-bottom-left-radius: ${v('size.rounded.md')};
            border-bottom-right-radius: ${v('size.rounded.md')};
          }
        }
      }
    `,
  },
});
