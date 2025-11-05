import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { tabsControlTemplate } from '@ngneers/controls-themes/templates/tabs';

export const tabsStyles = createThemePart({
  controlTemplate: tabsControlTemplate,
  base: baseStyles.tabs,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('content')} {
        padding: ${v('size.padding.sm')};
      }
      ${c('headers')} {
        border-top-left-radius: ${v('size.rounded.sm')};
        border-top-right-radius: ${v('size.rounded.sm')};
      }
      ${c('header')} {
        background: ${v('color.background')};
        border: none;
        cursor: pointer;
        font-weight: ${v('font.weight.semibold')};
        padding: ${v('size.padding.md')} ${v('size.padding.xl')};
        border-bottom: 1px solid ${v('color.surface.300')};
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
      ${c('header-active-indicator')} {
        border-bottom: 2px solid ${v('color.primary.default')};
        transition:
          left 0.2s ease-in-out,
          width 0.2s ease-in-out;
      }
      ${c('scroll-left')}, ${c('scroll-right')} {
        background: ${v('color.background')};
        width: 16px;
        padding: 0;
        color: ${v('color.surface.400')};
        --icon-size: 10px;
        cursor: pointer;
        --blurColor: ${v('color.background')};
        &:hover {
          background: ${v('color.surface.100')};
          color: ${v('color.surface.500')};
          --blurColor: ${v('color.surface.100')};
        }
        &:focus {
          background: ${v('color.surface.200')};
          color: ${v('color.surface.600')};
          --blurColor: ${v('color.surface.200')};
          outline: none;
        }
        &:active {
          background: ${v('color.surface.300')};
          color: ${v('color.surface.700')};
          --blurColor: ${v('color.surface.300')};
        }
      }
      ${c('scroll-left')} {
        left: 0;
        margin-right: -16px;
        &::after {
          left: 100%;
          right: -10px;
          background: linear-gradient(90deg, var(--blurColor), transparent);
        }
      }
      ${c('scroll-right')} {
        right: 0;
        margin-left: -16px;
        &::after {
          right: 100%;
          left: -10px;
          background: linear-gradient(270deg, var(--blurColor), transparent);
        }
      }
    `,
  },
});
