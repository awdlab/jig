import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  fontTemplate,
  shadowTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/shade/base';
import { dialogControlTemplate } from '@ngneers/controls-themes/templates/dialog';

const SCALE_AMOUNT = 0.95;

export const dialogStyles = createThemePart({
  controlTemplate: dialogControlTemplate,
  base: baseStyles.dialog,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, shadowTemplate, animationTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        background-color: ${v('color.background')};
        color: ${v('color.foreground')};
        border: 1px solid ${v('color.border')};
        border-radius: ${v('size.rounded.lg')};
        padding: ${v('size.padding.xl')};
        box-shadow: ${v('shadow.xl')};
        opacity: 0;
        transform: scale(${SCALE_AMOUNT});
        transition:
          opacity ${v('anim.time.snappyFade')} ${v('anim.ease.fade')},
          transform ${v('anim.time.snappyFade')} ${v('anim.ease.fade')},
          display calc(${v('anim.time.snappyFade')} + 10ms) allow-discrete,
          overlay calc(${v('anim.time.snappyFade')} + 10ms) allow-discrete;
      }
      ${c('root')}[open],
      ${c('root')}:popover-open {
        opacity: 1;
        transform: scale(1);
        @starting-style {
          opacity: 0;
          transform: scale(${SCALE_AMOUNT});
        }
      }
      ${c('modal')} {
        &::backdrop {
          background-color: transparent;
          backdrop-filter: blur(0);
          transition:
            background-color ${v('anim.time.snappyFade')} ${v('anim.ease.fade')},
            backdrop-filter ${v('anim.time.snappyFade')} ${v('anim.ease.fade')};
        }
        &[open]::backdrop {
          background-color: color-mix(in srgb, #000 50%, transparent);
          backdrop-filter: blur(8px);
          @starting-style {
            background-color: transparent;
            backdrop-filter: blur(0);
          }
        }
      }
      ${c('header')} {
        gap: ${v('size.padding.sm')};
        padding-bottom: ${v('size.padding.lg')};
      }
      ${c('default-header')} {
        font-weight: ${v('font.weight.semibold')};
        font-size: ${v('font.size.xl')};
        margin: 0;
      }
      ${c('content')} {
        color: ${v('color.muted.foreground')};
        font-size: ${v('font.size.sm')};
      }
      ${c('footer')} {
        padding-top: ${v('size.padding.lg')};
      }
      ${c('default-footer')} {
        gap: ${v('size.padding.sm')};
      }
      ${c('close-button')} {
        background: transparent;
        border: none;
        border-radius: ${v('size.rounded.md')};
        color: ${v('color.muted.foreground')};
        cursor: pointer;
        &:hover {
          background: ${v('color.accent.base')};
          color: ${v('color.accent.foreground')};
        }
      }
    `,
  },
});
