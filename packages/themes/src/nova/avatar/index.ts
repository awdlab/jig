import { createThemePart, css } from '@ngneers/controls-themes/api';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { avatarControlTemplate } from '@ngneers/controls-themes/templates/avatar';

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
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: ${v('color.primary.default')};
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
