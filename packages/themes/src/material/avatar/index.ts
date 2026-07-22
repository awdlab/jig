import { autoContrast, createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  colorsTemplate,
  fontTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/material/base';
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
        /* MD3 avatars default to a neutral surface fill (not primary) unless a
           caller sets a deterministic per-user --color at runtime. */
        --avatar-bg: var(--color, ${v('color.surface.200')});
        border-radius: ${v('size.rounded.full')};
        &:not(:has(${c('image')})) {
          background-color: var(--avatar-bg);
        }
      }
      ${c('initials')} {
        /* Adapts to a custom --color at runtime; pure-CSS since it can't be precomputed. */
        color: ${autoContrast('var(--avatar-bg)')};
        font-weight: ${v('font.weight.semibold')};
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
        /* Use :*-of-type (keyed on the ngn-avatar element) rather than :*-child so
           a non-avatar sibling injected into the group at runtime — e.g. a tooltip
           anchor when an avatar is hovered — doesn't steal first/last position and
           shift the stack. */
        &:not(:first-of-type) {
          /* Overlap scales with avatar size (half-overlap) so small stacks don't clump.
             At the 48px default this equals the former -1.5rem. */
          margin-left: calc(var(--size, 48px) * -0.5);
        }
        &:first-of-type {
          margin-left: calc(-1 * var(--border-width));
        }
        &:last-of-type {
          margin-right: calc(-1 * var(--border-width));
        }
      }
    `,
  },
});
