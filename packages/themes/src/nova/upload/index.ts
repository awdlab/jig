import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  colorsTemplate,
  controlRing,
  ringTemplate,
  sizesTemplate,
  animationTemplate,
  fontTemplate,
} from '@ngneers/controls-themes/nova/base';
import { uploadControlTemplate } from '@ngneers/controls-themes/templates/upload';

export const uploadStyles = createThemePart({
  controlTemplate: uploadControlTemplate,
  base: baseStyles.upload,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, animationTemplate, ringTemplate],
  root: {
    css: ({ v, c }) => {
      return css`
        ${c('zone')} {
          padding: ${v('size.padding.xl')};
          border: 2px solid ${v('color.border')};
          border-radius: ${v('size.rounded.lg')};
          background: ${v('color.surface.50')};
          color: ${v('color.text')};
          transition:
            border-color ${v('anim.time.fade')} ${v('anim.ease.fade')},
            background ${v('anim.time.fade')} ${v('anim.ease.fade')};
        }
        /* The dashed outline reads as "droppable" — only when drag is enabled. */
        ${c('draggable')} ${c('zone')} {
          border-style: dashed;
        }
        /* Focus lives on the projected native input; surface the ring on the zone. */
        ${c('zone')}:has(:focus-visible) {
          outline: 3px solid ${controlRing(v)};
          outline-offset: 2px;
        }
        ${c('clickable')} ${c('zone')}:hover {
          border-color: ${v('color.primary.500')};
          background: ${v('color.surface.100')};
        }
        ${c('dragover')} ${c('zone')} {
          border-color: ${v('color.primary.500')};
          border-style: solid;
          background: ${v('color.accent.100')};
        }
        ${c('disabled')} ${c('zone')} {
          border-color: ${v('color.disabled.border')};
          background: ${v('color.disabled.background')};
          color: ${v('color.disabled.text')};
        }

        ${c('icon')} {
          font-size: ${v('font.size.2xl')};
          color: ${v('color.surface.600')};
        }
        ${c('placeholder')} {
          font-size: ${v('font.size.sm')};
          color: ${v('color.surface.700')};
        }

        ${c('list')} {
          gap: 0.25rem;
        }
        ${c('item')} {
          padding: ${v('size.padding.sm')};
          border-radius: ${v('size.rounded.md')};
          background: ${v('color.surface.50')};
        }
        ${c('item-failed')} {
          background: ${v('color.error.100')};
        }

        ${c('name')} {
          font-size: ${v('font.size.sm')};
          font-weight: ${v('font.weight.medium')};
        }
        ${c('size')} {
          font-size: ${v('font.size.xs')};
          color: ${v('color.surface.600')};
        }

        ${c('item-done')} ${c('status')} {
          color: ${v('color.success.700')};
        }
        ${c('item-failed')} ${c('status')} {
          color: ${v('color.error.500')};
        }
        ${c('item-failed')} ${c('name')} {
          color: ${v('color.error.700')};
        }
      `;
    },
  },
});
