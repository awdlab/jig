import { autoContrast, createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/shade/base';
import {
  avatarControlTemplate,
  avatarGroupControlTemplate,
} from '@ngneers/controls-themes/templates/avatar';

export const avatarStyles = createThemePart({
  controlTemplate: avatarControlTemplate,
  base: baseStyles.avatar,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        --avatar-bg: var(--color, ${v('color.muted.base')});
        border-radius: ${v('size.rounded.full')};
        &:not(:has(${c('image')})) {
          background-color: var(--avatar-bg);
        }
      }
      ${c('initials')} {
        /* Adapts to a custom --color at runtime; pure-CSS since it can't be precomputed. */
        color: ${autoContrast('var(--avatar-bg)')};
        font-weight: ${v('font.weight.medium')};
      }
    `,
  },
});

export const avatarGroupStyles = createThemePart({
  controlTemplate: avatarGroupControlTemplate,
  base: baseStyles.avatarGroup,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} {
        display: flex;
      }
      ${c('root')} ${d('avatar', 'root')} {
        --border-width: 3px;
        border: var(--border-width) solid ${v('color.background')};
        &:not(:first-child) {
          /* Overlap scales with avatar size (half-overlap) so small stacks don't clump.
             At the 48px default this equals the former -1.5rem. */
          margin-left: calc(var(--size, 48px) * -0.5);
        }
        &:first-child {
          margin-left: calc(-1 * var(--border-width));
        }
        &:last-child {
          margin-right: calc(-1 * var(--border-width));
        }
      }
    `,
  },
});
