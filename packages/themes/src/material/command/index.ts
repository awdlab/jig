import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  colorsTemplate,
  fontTemplate,
  shadowTemplate,
  sizesTemplate,
} from '@awdlab/jig-themes/material/base';
import { commandControlTemplate } from '@awdlab/jig-themes/templates/command';

export const commandStyles = createThemePart({
  controlTemplate: commandControlTemplate,
  base: baseStyles.command,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, shadowTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} ${d('dialog', 'wrapper')} {
        border-radius: ${v('size.rounded.md')};
        box-shadow: ${v('shadow.lg')};
      }
      ${c('root')} ${d('search', 'root')} {
        border-bottom: 1px solid ${v('color.border')};
        border-radius: ${v('size.rounded.md')};
        padding: ${v('size.padding.lg')} ${v('size.padding.xl')};
        gap: ${v('size.padding.md')};
        font-size: ${v('font.size.md')};
      }
      ${c('search-icon')} {
        --icon-size: 1.125rem;
        color: ${v('color.surface.500')};
      }
      ${c('root')} ${d('list-box')} {
        padding: ${v('size.padding.sm')};
        background: transparent;
      }
      /* group labels stick while the list scrolls, so they need the palette surface behind them */
      ${c('root')} ${d('list-box', 'group')} {
        background: ${v('color.background')};
        color: ${v('color.surface.500')};
        padding: ${v('size.padding.md')} ${v('size.padding.lg')} ${v('size.padding.sm')};
        font-size: ${v('font.size.xs')};
        font-weight: ${v('font.weight.semibold')};
        letter-spacing: 0.06em;
      }
      ${c('root')} ${d('list-box', 'item')} {
        padding-inline: ${v('size.padding.lg')};
        border-radius: ${v('size.rounded.sm')};
        font-size: ${v('font.size.sm')};
      }
      /* the palette highlights with a neutral surface rather than the accent tint list-box uses on its own */
      ${c('root')} ${d('list-box', 'item-highlighted')} {
        background: ${v('color.surface.100')};
      }
      /* neutralizes the stuck selected-highlight left on the activated row after a command runs */
      ${c('root')} ${d('list-box', 'item-selected')} {
        background: transparent;
        color: ${v('color.text')};
      }
      ${c('item')} {
        gap: ${v('size.padding.lg')};
      }
      ${c('item-icon')} {
        --icon-size: 1rem;
        color: ${v('color.surface.500')};
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
        color: ${v('color.surface.500')};
        font-size: ${v('font.size.xs')};
      }
      ${c('empty')} {
        padding: ${v('size.padding.xl')};
        color: ${v('color.surface.500')};
        font-size: ${v('font.size.sm')};
      }
    `,
  },
});
