import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  colorsTemplate,
  fontTemplate,
  shadowTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/shade/base';
import { commandControlTemplate } from '@ngneers/controls-themes/templates/command';

export const commandStyles = createThemePart({
  controlTemplate: commandControlTemplate,
  base: baseStyles.command,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, shadowTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} ${d('dialog', 'wrapper')} {
        border-radius: ${v('size.rounded.lg')};
        box-shadow: ${v('shadow.xl')};
      }
      ${c('root')} ${d('search', 'root')} {
        border-bottom: 1px solid ${v('color.border')};
        border-radius: 0;
        padding: ${v('size.padding.lg')} ${v('size.padding.xl')};
        gap: ${v('size.padding.md')};
        font-size: ${v('font.size.md')};
        /* the field's outward box-shadow ring would bleed past the divider, so the
           focus ring is drawn inset instead */
        outline: 3px solid transparent;
        transition: outline-color 0.15s ease;
        &:focus-within {
          outline-color: color-mix(in srgb, ${v('color.ring')} 50%, transparent);
          box-shadow: none;
        }
      }
      ${c('search-icon')} {
        --icon-size: 1.125rem;
        color: ${v('color.muted.foreground')};
      }
      ${c('root')} ${d('list-box')} {
        padding: ${v('size.padding.sm')};
        background: transparent;
      }
      /* group labels stick while the list scrolls, so they need the palette surface behind them */
      ${c('root')} ${d('list-box', 'group')} {
        background: ${v('color.background')};
        color: ${v('color.muted.foreground')};
        padding: ${v('size.padding.md')} ${v('size.padding.lg')} ${v('size.padding.sm')};
        font-size: ${v('font.size.xs')};
        font-weight: ${v('font.weight.semibold')};
        letter-spacing: 0.06em;
      }
      ${c('root')} ${d('list-box', 'item')} {
        padding-inline: ${v('size.padding.lg')};
        border-radius: ${v('size.rounded.md')};
        font-size: ${v('font.size.sm')};
      }
      /* neutralizes the stuck selected-highlight left on the activated row after a command runs */
      ${c('root')} ${d('list-box', 'item-selected')} {
        background: transparent;
        color: inherit;
      }
      ${c('item')} {
        gap: ${v('size.padding.lg')};
      }
      ${c('item-icon')} {
        --icon-size: 1rem;
        color: ${v('color.muted.foreground')};
      }
      /* the hint bar reads as a quiet legend under the list */
      ${c('root')} ${d('dialog', 'footer')} {
        padding: 0;
        border-top: 1px solid ${v('color.border')};
      }
      ${c('hints')} {
        gap: ${v('size.padding.lg')};
        padding: ${v('size.padding.md')} ${v('size.padding.xl')};
      }
      ${c('hint')} {
        gap: ${v('size.padding.sm')};
        color: ${v('color.muted.foreground')};
        font-size: ${v('font.size.xs')};
      }
      ${c('empty')} {
        padding: ${v('size.padding.xl')};
        color: ${v('color.muted.foreground')};
        font-size: ${v('font.size.sm')};
      }
    `,
  },
});
