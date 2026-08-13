import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  colorsTemplate,
  controlRing,
  fontTemplate,
  ringTemplate,
  shadowTemplate,
  sizesTemplate,
} from '@awdlab/jig-themes/nova/base';
import { tabsControlTemplate } from '@awdlab/jig-themes/templates/tabs';

export const tabsStyles = createThemePart({
  controlTemplate: tabsControlTemplate,
  base: baseStyles.tabs,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, shadowTemplate, ringTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('headers-container')} {
        background: ${v('color.surface.50')};
        border-radius: ${v('size.rounded.md')};
        padding: 1px ${v('size.padding.sm')};
      }
      /* The headers strip is the scroll container (overflow-y: hidden), so without vertical
         padding it clips the active pill's shadow. Vertical only — horizontal padding would
         shift the sticky scroll buttons. */
      ${c('headers')} {
        gap: ${v('size.padding.sm')};
        padding: 3px 0;
      }
      ${c('header')} {
        background: transparent;
        border: none;
        cursor: pointer;
        color: ${v('color.surface.700')};
        font-weight: ${v('font.weight.semibold')};
        border-radius: calc(${v('size.rounded.md')} - 3px);
        padding: ${v('size.padding.sm')} ${v('size.padding.lg')};
        transition:
          background 0.15s ease,
          color 0.15s ease;
        &:hover {
          color: ${v('color.text')};
        }
        /* Inset: the headers strip is the scroll container, so a ring around the first tab
           would be clipped at its edge. Inset also leaves the active pill's shadow intact. */
        &:focus-visible {
          outline: 3px solid ${controlRing(v)};
          outline-offset: -3px;
        }
      }
      ${c('header-active')} {
        background: ${v('color.background')};
        color: ${v('color.primary.600')};
        box-shadow: ${v('shadow.sm')};
      }
      ${c('header-active-indicator')} {
        display: none;
      }
      ${c('scroll-start')}, ${c('scroll-end')} {
        background: ${v('color.surface.50')};
        padding: 0;
        color: ${v('color.surface.600')};
        --icon-size: 0.625rem;
        cursor: pointer;
        --blurColor: ${v('color.surface.50')};
        &:hover {
          color: ${v('color.surface.700')};
        }
        /* Inset: these sit sticky inside the headers strip, which hides its vertical
           overflow and would clip an offset ring. */
        &:focus-visible {
          color: ${v('color.surface.700')};
          outline: 3px solid ${controlRing(v)};
          outline-offset: -3px;
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
        padding-top: ${v('size.padding.md')};
      }
    `,
  },
});
