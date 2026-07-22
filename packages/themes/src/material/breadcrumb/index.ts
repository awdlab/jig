import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  colorsTemplate,
  fontTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/material/base';
import { breadcrumbControlTemplate } from '@ngneers/controls-themes/templates/breadcrumb';

export const breadcrumbStyles = createThemePart({
  controlTemplate: breadcrumbControlTemplate,
  base: baseStyles.breadcrumb,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} {
        gap: ${v('size.padding.md')};
        ${d('item-view')} {
          gap: ${v('size.padding.md')};
        }
      }
      ${c('separator')} {
        color: ${v('color.surface.500')};
        ngn-icon {
          margin-left: 0.5rem;
          font-size: ${v('font.size.xs')};
        }
      }
      ${c('item')}, ${c('overflow')} {
        cursor: default;
        color: ${v('color.surface.600')};
        transition:
          color 0.2s,
          background 0.15s ease;
        background: transparent;
        border: none;
        padding: 0;
        font-size: inherit;
      }
      /* MD3 state layer on the clickable crumbs — a rounded highlight that
         expands into the item's own gutter so it doesn't shift layout. */
      ${c('item-clickable')}, ${c('overflow')} {
        cursor: pointer;
        border-radius: ${v('size.rounded.sm')};
        padding: 0.125rem 0.25rem;
        &:hover {
          color: ${v('color.text')};
          background: color-mix(in srgb, ${v('color.text')} 8%, transparent);
        }
        &:focus-visible {
          outline: 2px solid color-mix(in srgb, ${v('color.primary.500')} 50%, transparent);
          outline-offset: 2px;
        }
      }
      ${c('item')}:last-child {
        color: ${v('color.text')};
        font-weight: ${v('font.weight.semibold')};
      }
    `,
  },
});
