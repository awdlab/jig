import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  fontTemplate,
  shadowTemplate,
  sizesTemplate,
} from '@awdlab/jig-themes/shade/base';
import { tabsControlTemplate } from '@awdlab/jig-themes/templates/tabs';

export const tabsStyles = createThemePart({
  controlTemplate: tabsControlTemplate,
  base: baseStyles.tabs,
  dependencies: [animationTemplate, colorsTemplate, fontTemplate, shadowTemplate, sizesTemplate],
  root: {
    // shadcn "pill-in-tray": the headers row is a muted tray, the active header a raised pill.
    // The moving underline indicator is hidden in favour of the pill background.
    css: ({ v, c }) => css`
      ${c('headers-container')} {
        border-bottom: none;
        padding: 0.25rem;
        background: ${v('color.muted.base')};
        border-radius: ${v('size.rounded.lg')};
      }
      ${c('headers')} {
        gap: 0.25rem;
      }
      ${c('header')} {
        background: transparent;
        border: none;
        border-radius: ${v('size.rounded.md')};
        color: ${v('color.muted.foreground')};
        cursor: pointer;
        font-weight: ${v('font.weight.medium')};
        font-size: ${v('font.size.sm')};
        padding: ${v('size.padding.sm')} ${v('size.padding.lg')};
        transition:
          color ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')},
          background-color ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')},
          box-shadow ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')};
        &:hover {
          color: ${v('color.foreground')};
        }
        &:focus-visible {
          outline: 2px solid transparent;
          outline-offset: 2px;
          box-shadow: 0 0 0 3px color-mix(in srgb, ${v('color.ring')} 50%, transparent);
        }
      }
      ${c('header-active')} {
        background: ${v('color.background')};
        color: ${v('color.foreground')};
        box-shadow: ${v('shadow.sm')};
      }
      ${c('header-active-indicator')} {
        display: none;
      }
      /* Scroll affordances live inside the muted pill tray, so they blend into it (not the page
       * background) — otherwise a white block with the tray's gray showing around its corners. */
      ${c('scroll-left')},
      ${c('scroll-right')} {
        background: ${v('color.muted.base')};
        padding: 0;
        color: ${v('color.muted.foreground')};
        --icon-size: 0.625rem;
        cursor: pointer;
        --blurColor: ${v('color.muted.base')};
        &:hover {
          color: ${v('color.foreground')};
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
      ${c('content')} {
        background: ${v('color.background')};
      }
    `,
  },
});
