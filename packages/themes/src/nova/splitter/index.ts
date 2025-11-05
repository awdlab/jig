import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate } from '@ngneers/controls-themes/nova/base';
import { splitterControlTemplate } from '@ngneers/controls-themes/templates/splitter';

export const splitterStyles = createThemePart({
  controlTemplate: splitterControlTemplate,
  base: baseStyles.splitter,
  dependencies: [colorsTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('divider-handle')} {
        background: ${v('color.surface.100')};
        &:hover {
          background: ${v('color.surface.200')};
        }
        &:focus {
          background: ${v('color.surface.300')};
        }
        &:active {
          background: ${v('color.surface.400')};
        }
      }

      ${c('horizontal')} {
        ${c('divider')}, ${c('divider-handle')} {
          width: 0.25rem;
        }
      }

      ${c('vertical')} {
        ${c('divider')}, ${c('divider-handle')} {
          height: 0.25rem;
        }
      }
    `,
  },
});
