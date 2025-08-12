import { createThemePart, css } from '@ngneers/controls-themes/api';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import {
  avatarControlTemplate,
  avatarGroupControlTemplate,
} from '@ngneers/controls-themes/templates/avatar';

export const avatarStyles = createThemePart({
  controlTemplate: avatarControlTemplate,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c()} {
        border-radius: ${v('size.rounded.full')};
        width: var(--size);
        height: var(--size);
        overflow: hidden;
        display: inline-flex;
        vertical-align: middle;
        align-items: center;
        justify-content: center;
        &:not(:has(${c('image')})) {
          background-color: var(--color, ${v('color.primary.default')});
        }
      }
      ${c('initials')} {
        color: ${v('color.text')};
        font-weight: ${v('font.weight.semibold')};
        font-size: calc(var(--size) / -8 * var(--letterCount) + var(--size) * 0.77);
        user-select: none;
      }
    `,
  },
});

export const avatarGroupStyles = createThemePart({
  controlTemplate: avatarGroupControlTemplate,
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
