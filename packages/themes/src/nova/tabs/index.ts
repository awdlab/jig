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
      ${c('headers')} {
        border-top-left-radius: ${v('size.rounded.sm')};
        border-top-right-radius: ${v('size.rounded.sm')};
      }
      ${c('headers-container')} {
        border-bottom: 1px solid ${v('color.surface.300')};
      }
      ${c('header')} {
        background: ${v('color.background')};
        border: none;
        cursor: pointer;
        font-weight: ${v('font.weight.semibold')};
        padding: ${v('size.padding.md')} ${v('size.padding.xl')};
        &:hover {
          background: ${v('color.surface.100')};
        }
        &:focus-visible {
          outline: none;
          background: ${v('color.surface.200')};
        }
        &:active {
          background: ${v('color.surface.300')};
        }
      }
      ${c('header-active-indicator')} {
        border-bottom: 2px solid ${v('color.primary.500')};
        transition:
          left 0.2s ease-in-out,
          width 0.2s ease-in-out;
      }
      ${c('scroll-left')}, ${c('scroll-right')} {
        background: ${v('color.background')};
        padding: 0;
        color: ${v('color.surface.400')};
        --icon-size: 0.625rem;
        cursor: pointer;
        --blurColor: ${v('color.background')};
        &:hover {
          background: ${v('color.surface.100')};
          color: ${v('color.surface.500')};
          --blurColor: ${v('color.surface.100')};
        }
        &:focus-visible {
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
        &::after {
          background: linear-gradient(90deg, var(--blurColor), transparent);
        }
      }
      ${c('scroll-right')} {
        &::after {
          background: linear-gradient(270deg, var(--blurColor), transparent);
        }
      }
    `,
  },
});
