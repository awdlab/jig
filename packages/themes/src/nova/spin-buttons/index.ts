import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, sizesTemplate } from '@awdlab/jig-themes/nova/base';
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
      /* Bleed over the field's horizontal padding on the border-facing side so the buttons sit
         flush against the border. Must match the field's own inline padding or a gap is left. */
      ${c('trailing')} {
        margin-inline-end: calc(-1 * ${v('size.padding.lg')});
        border-inline-start: 1px solid ${v('color.border')};
        background: ${v('color.surface.100')};
        border-start-end-radius: calc(${v('size.rounded.md')} - 1px);
        border-end-end-radius: calc(${v('size.rounded.md')} - 1px);
      }
      ${c('leading')} {
        margin-inline-start: calc(-1 * ${v('size.padding.lg')});
        border-inline-end: 1px solid ${v('color.border')};
        background: ${v('color.surface.100')};
        border-start-start-radius: calc(${v('size.rounded.md')} - 1px);
        border-end-start-radius: calc(${v('size.rounded.md')} - 1px);
      }

      /* Scoped under the root so these win over the icon-button's own
       * two-class rules (e.g. .button-kind-icon.button-inline sets a fixed
       * width/height) regardless of stylesheet order. */
      ${c('root')} ${d('decrement')},
      ${c('root')} ${d('increment')} {
        color: ${v('color.surface.600')};
        /* Reset the underlying icon-button chrome (rounded corners + fixed square
         * size): these buttons bleed to the field border and fill its height. */
        border-radius: 0;
        width: auto;
        height: auto;
        /* Keep the icon visually inset by the field padding while the padded
         * area itself is part of the clickable button. */
        padding-block: 0;
        padding-inline: ${v('size.padding.md')};
        font-size: calc(1em * 0.9);
        &:hover:not(:disabled) {
          color: ${v('color.surface.700')};
          background: ${v('color.surface.200')};
        }
        &:disabled {
          color: ${v('color.disabled.text')};
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
