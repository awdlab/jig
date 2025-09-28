import { createThemePart, css } from '@ngneers/controls-themes/api';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { buttonGroupControlTemplate } from '@ngneers/controls-themes/templates/button-group';

export const buttonGroupStyles = createThemePart({
  controlTemplate: buttonGroupControlTemplate,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c()} {
        display: block;
      }
      ${c('horizontal')}, ${c('vertical')} {
        display: flex;
        width: fit-content;
        & ${d('button')} {
          border-radius: 0;
          white-space: nowrap;
        }
      }
      ${c('horizontal')} {
        flex-direction: row;
        & ${d('button')} {
          &:first-child {
            border-top-left-radius: ${v('size.rounded.md')};
            border-bottom-left-radius: ${v('size.rounded.md')};
          }
          &:last-child {
            border-top-right-radius: ${v('size.rounded.md')};
            border-bottom-right-radius: ${v('size.rounded.md')};
          }
        }
      }
      ${c('vertical')} {
        width: fit-content;
        flex-direction: column;
        & ${d('button')} {
          width: 100%;
          &:first-child {
            border-top-left-radius: ${v('size.rounded.md')};
            border-top-right-radius: ${v('size.rounded.md')};
          }
          &:last-child {
            border-bottom-left-radius: ${v('size.rounded.md')};
            border-bottom-right-radius: ${v('size.rounded.md')};
          }
        }
      }
    `,
  },
});
