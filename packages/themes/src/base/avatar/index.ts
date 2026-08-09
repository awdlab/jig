import { createThemePart, css } from '@awdlab/jig-themes/api';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@awdlab/jig-themes/nova/base';
import {
  avatarControlTemplate,
  avatarGroupControlTemplate,
} from '@awdlab/jig-themes/templates/avatar';

export const avatarStyles = createThemePart({
  controlTemplate: avatarControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        width: var(--size);
        height: var(--size);
        flex-shrink: 0;
        overflow: hidden;
        display: inline-flex;
        vertical-align: middle;
        align-items: center;
        justify-content: center;
      }
      ${c('initials')} {
        font-size: calc(var(--size) / -12 * var(--letterCount) + var(--size) * 0.7);
        line-height: 0;
        font-family: monospace;
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
