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
        padding: ${v('size.padding.sm')};
      }
      ${c('headers')} {
        width: 100%;
        display: flex;
        position: relative;
        border-top-left-radius: ${v('size.rounded.sm')};
        border-top-right-radius: ${v('size.rounded.sm')};
        overflow-x: scroll;
        overflow-y: hidden;
        &::-webkit-scrollbar {
          display: none;
        }
        --ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
      }
      ${c('header')} {
        background: ${v('color.background')};
        border: none;
        cursor: pointer;
        white-space: nowrap;
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
      ${c('header-active')} {
      }
      ${c('header-active-indicator')} {
        position: absolute;
        bottom: 0;
        border-bottom: 2px solid ${v('color.primary.default')};
        transition:
          left 0.2s ease-in-out,
          width 0.2s ease-in-out;
        pointer-events: none;
      }
      ${c('scroll-left')}, ${c('scroll-right')} {
        position: sticky;
        border: none;
        background: ${v('color.background')};
        width: 16px;
        padding: 0;
        flex-shrink: 0;
        z-index: 1;
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
        &::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          pointer-events: none;
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
