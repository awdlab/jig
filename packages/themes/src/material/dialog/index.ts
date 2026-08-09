import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  fontTemplate,
  shadowTemplate,
  sizesTemplate,
} from '@awdlab/jig-themes/material/base';
import { dialogControlTemplate } from '@awdlab/jig-themes/templates/dialog';

const SCALE_AMOUNT = 0.95;

export const dialogStyles = createThemePart({
  controlTemplate: dialogControlTemplate,
  base: baseStyles.dialog,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, shadowTemplate, animationTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('wrapper')} {
        background-color: ${v('color.background')};
        border-radius: ${v('size.rounded.lg')};
        padding: ${v('size.padding.lg')};
        box-shadow: ${v('shadow.xl')};
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
        font-weight: ${v('font.weight.medium')};
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
