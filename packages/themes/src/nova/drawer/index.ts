import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  fontTemplate,
  shadowTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/nova/base';
import { drawerControlTemplate } from '@ngneers/controls-themes/templates/drawer';

export const drawerStyles = createThemePart({
  controlTemplate: drawerControlTemplate,
  base: baseStyles.drawer,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, animationTemplate, shadowTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c()} {
        box-shadow: ${v('shadow.lg')};
        padding: ${v('size.padding.xl')};
        gap: ${v('size.padding.md')};
        transition:
          display calc(${v('anim.time.fade')} + 10ms) allow-discrete,
          overlay calc(${v('anim.time.fade')} + 10ms) allow-discrete;
        animation: ngnDrawer_in ${v('anim.time.fade')} ${v('anim.ease.fade')};
        background: ${v('color.background')};
        &::backdrop {
          transition: background-color ${v('anim.time.fade')};
        }
        &:popover-open::backdrop {
          background-color: rgba(0, 0, 0, 0.1);
          @starting-style {
            background-color: transparent;
          }
        }
        &:not(:popover-open) {
          animation: ngnDrawer_out ${v('anim.time.fade')} ${v('anim.ease.fade')} forwards;
        }

        &[data-position='top'] {
          --animation-y: -40px;
          --animation-x: 0;
        }
        &[data-position='right'] {
          --animation-y: 0;
          --animation-x: 40px;
        }
        &[data-position='bottom'] {
          --animation-y: 40px;
          --animation-x: 0;
        }
        &[data-position='left'] {
          --animation-y: 0;
          --animation-x: -40px;
        }
      }
      @keyframes ngnDrawer_in {
        from {
          opacity: 0;
          transform: translateY(var(--animation-y)) translateX(var(--animation-x));
        }
        to {
          opacity: 1;
          transform: translateY(0) translateX(0);
        }
      }
      @keyframes ngnDrawer_out {
        from {
          opacity: 1;
          transform: translateY(0) translateX(0);
        }
        to {
          opacity: 0;
          transform: translateY(var(--animation-y)) translateX(var(--animation-x));
        }
      }
      ${c('default-header-text')} {
        font-weight: ${v('font.weight.semibold')};
        font-size: ${v('font.size.xl')};
      }
    `,
  },
});
