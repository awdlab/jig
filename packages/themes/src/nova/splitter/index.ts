import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, controlRing, ringTemplate } from '@awdlab/jig-themes/nova/base';
import { splitterControlTemplate } from '@awdlab/jig-themes/templates/splitter';

export const splitterStyles = createThemePart({
  controlTemplate: splitterControlTemplate,
  base: baseStyles.splitter,
  dependencies: [colorsTemplate, ringTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('panel')} {
        overflow: hidden;
      }

      /* One ring for every kind: the thin/invisible kinds only paint their bar on hover, so
         without it a keyboard-focused divider would be invisible. */
      ${c('divider-handle')}:focus-visible {
        outline: 3px solid ${controlRing(v)};
        outline-offset: 0;
      }

      /* Default kind: the handle itself is the visible divider. */
      ${c('kind-default')} {
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

        &${c('horizontal')} {
          ${c('divider')}, ${c('divider-handle')} {
            width: 0.25rem;
          }
        }

        &${c('vertical')} {
          ${c('divider')}, ${c('divider-handle')} {
            height: 0.25rem;
          }
        }
      }

      /* Thin & invisible kinds: the expanding ::after bar is the visible divider. */
      ${c('kind-thin')}, ${c('kind-invisible')} {
        ${c('divider-handle')}::after {
          background: ${v('color.surface.200')};
        }
        ${c('divider-handle')}:hover::after {
          background: ${v('color.surface.300')};
        }
        ${c('divider-handle')}:focus::after {
          background: ${v('color.surface.300')};
        }
        ${c('divider-handle')}:active::after {
          background: ${v('color.surface.400')};
        }
      }
    `,
  },
});
