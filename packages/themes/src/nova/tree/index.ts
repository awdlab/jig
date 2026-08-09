import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  colorsTemplate,
  controlRing,
  fontTemplate,
  ringTemplate,
  sizesTemplate,
} from '@awdlab/jig-themes/nova/base';
import { treeControlTemplate } from '@awdlab/jig-themes/templates/tree';

export const treeStyles = createThemePart({
  controlTemplate: treeControlTemplate,
  base: baseStyles.tree,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, ringTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} {
        padding: ${v('size.padding.sm')};
        border-radius: ${v('size.rounded.lg')};
        border-color: ${v('color.border')};
        border-width: 1px;
        border-style: solid;
        background: ${v('color.background')};
        /* The tree is one tab stop and moves the highlight with the arrow keys, so the ring
           goes on the container. */
        &:focus-visible {
          outline: 3px solid ${controlRing(v)};
          outline-offset: 0;
        }
      }
      ${c('invalid')} {
        border-color: ${v('color.error.500')};
      }
      ${c('item')},
      ${c('group')} {
        gap: ${v('size.padding.sm')};
        min-height: 1.75rem;
        padding-inline-end: ${v('size.padding.md')};
        border-radius: ${v('size.rounded.sm')};
        user-select: none;
        cursor: default;
        position: relative;
        &:hover {
          background-color: ${v('color.surface.100')};
        }
        /* Indent guides. Rows are a flat list indented by margin (level * 1.5rem), so there is no
           nested element to hang a border-left on. Instead paint one 1px line per ancestor level
           into the indent gutter left of the row: the gradient repeats every 1.5rem. */
        &::before {
          content: '';
          position: absolute;
          inset-block: 0;
          inset-inline-end: 100%;
          width: calc(var(--jig-tree-level, 0) * 1.5rem);
          background-image: repeating-linear-gradient(
            to right,
            transparent 0 0.6875rem,
            ${v('color.border')} 0.6875rem calc(0.6875rem + 1px),
            transparent calc(0.6875rem + 1px) 1.5rem
          );
        }
      }
      /* Extra breathing room between a row's checkbox and its label
         (adds to the row's flex gap; leaves the toggle-arrow spacing untouched). */
      ${d('item-checkbox')} {
        margin-inline-end: ${v('size.padding.sm')};
      }

      /* Accent mixed into the surface so the tint survives the dark-mode palette reversal. */
      ${c('item-highlighted')} {
        background-color: color-mix(
          in oklab,
          ${v('color.primary.500')} 12%,
          ${v('color.background')}
        );
      }
      ${c('item-selected')}:not(:has(${d('item-checkbox')})) {
        background-color: color-mix(
          in oklab,
          ${v('color.primary.500')} 16%,
          ${v('color.background')}
        );
        color: ${v('color.primary.700')};
        font-weight: ${v('font.weight.semibold')};
        &:hover {
          background-color: color-mix(
            in oklab,
            ${v('color.primary.500')} 22%,
            ${v('color.background')}
          );
        }
      }
      ${c('toggle')} {
        color: ${v('color.surface.600')};
        &:hover {
          color: ${v('color.surface.700')};
        }
      }
      ${c('toggle-arrow')} {
        width: 0;
        height: 0;
        border-top: 0.28rem solid transparent;
        border-bottom: 0.28rem solid transparent;
        border-left: 0.36rem solid currentColor;
      }
      ${c('item-selectable')} {
        cursor: pointer;
      }
      ${c('default-item')} {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      ${c('empty')} {
        text-align: center;
        padding: ${v('size.padding.md')};
      }
      ${c('root')} ${d('scroller', 'item')} {
        align-items: center;
      }
    `,
  },
});
