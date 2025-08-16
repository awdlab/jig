import { createThemePart, css } from '@ngneers/controls-themes/api';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { tabsControlTemplate } from '@ngneers/controls-themes/templates/tabs';

export const tabsStyles = createThemePart({
  controlTemplate: tabsControlTemplate,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c()} {
        display: flex;
        flex-direction: column;
      }
      ${c('content')} {
      }
      ${c('headers')} {
        width: 100%;
        border-bottom: 1px solid ${v('color.surface.300')};
        display: flex;
        position: relative;
      }
      ${c('header')} {
        background: ${v('color.background')};
        border: none;
        cursor: pointer;
        font-weight: ${v('font.weight.semibold')};
        padding: ${v('size.padding.md')};
        &:hover {
          background: ${v('color.surface.100')};
        }
        &:focus {
          outline: none;
          background: ${v('color.surface.200')};
        }
        &:active {
          background: ${v('color.surface.300')};
        }
      }
      ${c('header-active')} {
      }
      ${c('header-active-indicator')} {
        position: absolute;
        bottom: -1px;
        border-bottom: 2px solid ${v('color.primary.default')};
      }
    `,
  },
});
