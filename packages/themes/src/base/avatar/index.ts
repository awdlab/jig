import { createThemePart, css } from '@ngneers/controls-themes/api';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import {
  avatarControlTemplate,
  avatarGroupControlTemplate,
} from '@ngneers/controls-themes/templates/avatar';

export const avatarStyles = createThemePart({
  controlTemplate: avatarControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        width: var(--size);
        height: var(--size);
        overflow: hidden;
        display: inline-flex;
        vertical-align: middle;
        align-items: center;
        justify-content: center;
      }
      ${c('initials')} {
        font-size: calc(var(--size) / -8 * var(--letterCount) + var(--size) * 0.77);
        user-select: none;
      }
      ${c('image')} {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        display: block;
      }
    `,
  },
});

export const avatarGroupStyles = createThemePart({
  controlTemplate: avatarGroupControlTemplate,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c, d }) => css``,
  },
});
