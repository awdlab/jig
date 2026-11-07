import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { animationTemplate, colorsTemplate } from '@awdlab/jig-themes/shade/base';
import { splitterControlTemplate } from '@awdlab/jig-themes/templates/splitter';

export const splitterStyles = createThemePart({
  controlTemplate: splitterControlTemplate,
  base: baseStyles.splitter,
  dependencies: [colorsTemplate, animationTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('panel')} {
        overflow: hidden;
      }

      /* Default kind: the handle itself is the visible divider. */
      ${c('kind-default')} {
        ${c('divider-handle')} {
          background: ${v('color.border')};
          transition: background-color ${v('anim.time.snappyFade')} ease;
          &:hover {
            background: ${v('color.accent.base')};
          }
          &:focus {
            background: color-mix(in srgb, ${v('color.ring')} 40%, transparent);
          }
          &:active {
            background: ${v('color.ring')};
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
          background: ${v('color.border')};
          transition:
            width ${v('anim.time.snappyFade')} ease,
            height ${v('anim.time.snappyFade')} ease,
            background-color ${v('anim.time.snappyFade')} ease;
        }
        ${c('divider-handle')}:hover::after {
          background: ${v('color.accent.base')};
        }
        ${c('divider-handle')}:focus::after {
          background: color-mix(in srgb, ${v('color.ring')} 40%, transparent);
        }
        ${c('divider-handle')}:active::after {
          background: ${v('color.ring')};
        }
      }
    `,
  },
});
