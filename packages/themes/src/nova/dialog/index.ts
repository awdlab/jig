import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  fontTemplate,
  shadowTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/nova/base';
import { dialogControlTemplate } from '@ngneers/controls-themes/templates/dialog';

const SCALE_AMOUNT = 0.95;

export const dialogStyles = createThemePart({
  controlTemplate: dialogControlTemplate,
  base: baseStyles.dialog,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, shadowTemplate, animationTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('wrapper')} {
        background-color: ${v('color.background')};
        border: 1px solid ${v('color.border')};
        border-radius: ${v('size.rounded.xl')};
        padding: ${v('size.padding.lg')};
        box-shadow: ${v('shadow.lg')};
        opacity: 0;
        transform: scale(${SCALE_AMOUNT});
        transition:
          opacity ${v('anim.time.snappyFade')} ${v('anim.ease.fade')},
          transform ${v('anim.time.snappyFade')} ${v('anim.ease.fade')},
          display calc(${v('anim.time.snappyFade')} + 10ms) allow-discrete,
          overlay calc(${v('anim.time.snappyFade')} + 10ms) allow-discrete;
      }
      ${c('wrapper')}[open],
      ${c('wrapper')}:popover-open {
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
          transition: background-color ${v('anim.time.snappyFade')} ${v('anim.ease.fade')};
        }
        &[open]::backdrop {
          background-color: rgba(from ${v('color.text')} r g b / 0.1);
          @starting-style {
            background-color: transparent;
          }
        }
      }
      ${c('header')} {
        gap: ${v('size.padding.sm')};
        padding-bottom: ${v('size.padding.lg')};
      }
      ${c('default-header')} {
        font-weight: 600;
        font-size: ${v('font.size.2xl')};
        margin: 0;
      }
      ${c('footer')} {
        padding-top: ${v('size.padding.lg')};
      }
      ${c('default-footer')} {
        gap: ${v('size.padding.sm')};
      }
    `,
  },
});
