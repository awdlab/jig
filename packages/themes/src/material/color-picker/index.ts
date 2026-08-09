import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, sizesTemplate } from '@awdlab/jig-themes/material/base';
import { colorPickerControlTemplate } from '@awdlab/jig-themes/templates/color-picker';

export const colorPickerStyles = createThemePart({
  controlTemplate: colorPickerControlTemplate,
  base: baseStyles['color-picker'],
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('trigger')} {
        width: 2.25rem;
        height: 2.25rem;
        border-radius: ${v('size.rounded.md')};
        border: 1px solid ${v('color.surface.300')};
        cursor: pointer;
        padding: 0.25rem;
      }
      ${c('preview')} {
        width: 100%;
        height: 100%;
        border-radius: ${v('size.rounded.sm')};
      }
      /* Popover mode gets its single surface (border/background/padding) from jig-popover
         itself; the panel's own surface only applies in inline mode, where there's no popover
         to supply one — otherwise the two would stack into a double border. */
      ${c('inline')} ${c('panel')} {
        padding: ${v('size.padding.md')};
        background: ${v('color.background')};
        border: 1px solid ${v('color.surface.300')};
        border-radius: ${v('size.rounded.md')};
      }
      ${c('hue-track')}, ${c('alpha-track')} {
        border-radius: ${v('size.rounded.sm')};
      }
      ${c('sv-thumb')} {
        width: 0.75rem;
        height: 0.75rem;
        border-radius: ${v('size.rounded.full')};
        border: 2px solid #fff;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
      }
      ${c('hue-thumb')}, ${c('alpha-thumb')} {
        width: 1rem;
        height: 1rem;
        border-radius: ${v('size.rounded.full')};
        background: #fff;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
      }
      ${c('swatch')} {
        width: 1.25rem;
        height: 1.25rem;
        border-radius: ${v('size.rounded.sm')};
        border: 1px solid ${v('color.surface.300')};
        cursor: pointer;
        padding: 0;
      }
      ${c('channel-label')} {
        color: ${v('color.surface.500')};
      }
      ${c('disabled')} {
        opacity: 0.5;
        pointer-events: none;
      }
      ${c('invalid')} {
        ${c('trigger')} {
          border-color: ${v('color.error.500')};
        }
      }
    `,
  },
});
