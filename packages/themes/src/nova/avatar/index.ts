import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
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
      ${c()} {
        border-radius: ${v('size.rounded.full')};
        &:not(:has(${c('image')})) {
          background-color: var(--color, ${v('color.primary.500')});
        }
      }
      ${c('initials')} {
        color: ${v('color.text')};
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
      ${c()} {
        display: flex;
      }
      ${c()} ${d('avatar')} {
        --border-width: 3px;
        border: var(--border-width) solid ${v('color.background')};
        &:not(:first-child) {
          margin-left: -1.5rem;
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
