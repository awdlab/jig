import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@awdlab/jig-themes/material/base';
import { tabsControlTemplate } from '@awdlab/jig-themes/templates/tabs';

export const tabsStyles = createThemePart({
  controlTemplate: tabsControlTemplate,
  base: baseStyles.tabs,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('headers')} {
        border-start-start-radius: ${v('size.rounded.sm')};
        border-start-end-radius: ${v('size.rounded.sm')};
      }
      ${c('headers-container')} {
        border-bottom: 1px solid ${v('color.border')};
      }
      ${c('header')} {
        background: ${v('color.background')};
        border: none;
        cursor: pointer;
        font-weight: ${v('font.weight.medium')};
        padding: ${v('size.padding.md')} ${v('size.padding.xl')};
        &:hover {
          background: color-mix(in srgb, ${v('color.primary.foreground')} 8%, transparent);
        }
        &:focus-visible {
          outline: none;
          background: color-mix(in srgb, ${v('color.primary.foreground')} 12%, transparent);
        }
        &:active {
          background: color-mix(in srgb, ${v('color.primary.foreground')} 12%, transparent);
        }
      }
      ${c('header-active')} {
        color: ${v('color.primary.foreground')};
      }
      ${c('header-active-indicator')} {
        border-bottom: 2px solid ${v('color.primary.foreground')};
        transition:
          left 0.2s ease-in-out,
          width 0.2s ease-in-out;
      }
      ${c('scroll-start')}, ${c('scroll-end')} {
        background: ${v('color.background')};
        padding: 0;
        color: ${v('color.surface.400')};
        --icon-size: 0.625rem;
        cursor: pointer;
        --blurColor: ${v('color.background')};
        &:hover {
          background: color-mix(in srgb, ${v('color.text')} 8%, ${v('color.background')});
          color: ${v('color.surface.500')};
          --blurColor: color-mix(in srgb, ${v('color.text')} 8%, ${v('color.background')});
        }
        &:focus-visible {
          background: color-mix(in srgb, ${v('color.text')} 12%, ${v('color.background')});
          color: ${v('color.surface.600')};
          --blurColor: color-mix(in srgb, ${v('color.text')} 12%, ${v('color.background')});
          outline: none;
        }
        &:active {
          background: color-mix(in srgb, ${v('color.text')} 12%, ${v('color.background')});
          color: ${v('color.surface.700')};
          --blurColor: color-mix(in srgb, ${v('color.text')} 12%, ${v('color.background')});
        }
      }
      ${c('scroll-start')} {
        &::after {
          background: linear-gradient(90deg, var(--blurColor), transparent);
        }
      }
      ${c('scroll-end')} {
        &::after {
          background: linear-gradient(270deg, var(--blurColor), transparent);
        }
      }
      /* Gradient direction is physical: mirror the fade so it always washes over the
         content rather than away from it. */
      ${c('scroll-start')}:dir(rtl), ${c('scroll-end')}:dir(rtl) {
        &::after {
          transform: scaleX(-1);
        }
      }
      ${c('content')} {
        background: ${v('color.background')};
      }
    `,
  },
});
