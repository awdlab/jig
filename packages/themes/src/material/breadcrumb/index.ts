import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  focusRing,
  fontTemplate,
  sizesTemplate,
} from '@awdlab/jig-themes/material/base';
import { breadcrumbControlTemplate } from '@awdlab/jig-themes/templates/breadcrumb';

export const breadcrumbStyles = createThemePart({
  controlTemplate: breadcrumbControlTemplate,
  base: baseStyles.breadcrumb,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, animationTemplate],
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
        jig-icon {
          margin-inline-start: 0.5rem;
          font-size: ${v('font.size.xs')};
        }
      }
      ${c('item')}, ${c('overflow')} {
        cursor: default;
        color: ${v('color.surface.600')};
        transition:
          color ${v('anim.time.fade')},
          background ${v('anim.time.snappyFade')} ease;
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
          ${focusRing(v)}
        }
      }
      ${c('item')}:last-child {
        color: ${v('color.text')};
        font-weight: ${v('font.weight.semibold')};
      }
    `,
  },
});
