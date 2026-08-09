import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  fontTemplate,
  sizesTemplate,
} from '@awdlab/jig-themes/shade/base';
import { uploadControlTemplate } from '@awdlab/jig-themes/templates/upload';

export const uploadStyles = createThemePart({
  controlTemplate: uploadControlTemplate,
  base: baseStyles.upload,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, animationTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('zone')} {
        padding: ${v('size.padding.xl')};
        border: 2px solid ${v('color.border')};
        border-radius: ${v('size.rounded.lg')};
        background: ${v('color.background')};
        color: ${v('color.foreground')};
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
        outline: 2px solid ${v('color.ring')};
        outline-offset: 2px;
      }
      ${c('clickable')} ${c('zone')}:hover {
        border-color: ${v('color.primary.base')};
        background: ${v('color.muted.base')};
      }
      ${c('dragover')} ${c('zone')} {
        border-color: ${v('color.primary.base')};
        border-style: solid;
        background: ${v('color.muted.base')};
      }
      ${c('disabled')} ${c('zone')} {
        background: ${v('color.muted.base')};
        color: ${v('color.muted.foreground')};
      }

      ${c('icon')} {
        font-size: ${v('font.size.xl')};
        color: ${v('color.muted.foreground')};
      }
      ${c('placeholder')} {
        font-size: ${v('font.size.sm')};
        color: ${v('color.muted.foreground')};
      }

      ${c('list')} {
        gap: 0.25rem;
      }
      ${c('item')} {
        padding: ${v('size.padding.sm')};
        border-radius: ${v('size.rounded.md')};
        background: ${v('color.muted.base')};
      }
      ${c('item-failed')} {
        background: color-mix(in srgb, ${v('color.destructive.base')} 15%, transparent);
      }

      ${c('name')} {
        font-size: ${v('font.size.sm')};
        font-weight: ${v('font.weight.medium')};
      }
      ${c('size')} {
        font-size: ${v('font.size.xs')};
        color: ${v('color.muted.foreground')};
      }

      ${c('item-done')} ${c('status')} {
        color: ${v('color.primary.base')};
      }
      ${c('item-failed')} ${c('status')},
      ${c('item-failed')} ${c('name')} {
        color: ${v('color.destructive.base')};
      }
    `,
  },
});
