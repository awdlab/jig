import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, sizesTemplate } from '@awdlab/jig-themes/shade/base';
import { spinButtonsControlTemplate } from '@awdlab/jig-themes/templates/spin-buttons';

export const spinButtonsStyles = createThemePart({
  controlTemplate: spinButtonsControlTemplate,
  base: baseStyles.spinButtons,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c, d }) => css`
      /* Bleed over the field's vertical padding so the buttons reach the top
       * and bottom border — the whole cell out to the edge stays clickable. */
      ${c('root')} {
        margin-block: calc(-1 * ${v('size.padding.sm')});
      }
      /* Bleed over the field's horizontal padding on the border-facing side. */
      ${c('trailing')} {
        margin-inline-end: calc(-1 * ${v('size.padding.md')});
      }
      ${c('leading')} {
        margin-inline-start: calc(-1 * ${v('size.padding.md')});
      }

      /* Scoped under the root so these win over the icon-button's own
       * two-class rules (e.g. .button-kind-icon sets a fixed width/height)
       * regardless of stylesheet order. */
      ${c('root')} ${d('decrement')},
      ${c('root')} ${d('increment')} {
        color: ${v('color.muted.foreground')};
        /* Reset the underlying icon-button chrome (radius + fixed square size):
         * these buttons bleed to the field border and fill its height. */
        border-radius: 0;
        width: auto;
        height: auto;
        /* Keep the icon visually inset by the field padding while the padded
         * area itself is part of the clickable button. */
        padding-block: 0;
        padding-inline: ${v('size.padding.md')};
        font-size: calc(1em * 0.9);
        &:hover:not(:disabled) {
          color: ${v('color.foreground')};
          background: ${v('color.accent.base')};
        }
        &:disabled {
          color: ${v('color.muted.foreground')};
          opacity: 0.5;
        }
      }

      /* The stacked pair: two half-height chevrons that share one field line. */
      ${c('pair')}:not(${c('kind-inline')}) ${d('decrement')},
      ${c('pair')}:not(${c('kind-inline')}) ${d('increment')} {
        flex: 1 1 0;
        font-size: calc(1em * 0.6);
        padding-block: 0;
      }

      ${c('kind-inline')} {
        gap: 2px;
      }
    `,
  },
});
