import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, sizesTemplate } from '@awdlab/jig-themes/nova/base';
import { filterControlTemplate } from '@awdlab/jig-themes/templates/filter';

export const filterStyles = createThemePart({
  controlTemplate: filterControlTemplate,
  base: baseStyles.filter,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('icon')} {
        cursor: pointer;
      }
      ${c('popover-content')} {
        padding: ${v('size.padding.lg')};
        gap: ${v('size.padding.md')};
      }
      ${c('rows')} {
        gap: ${v('size.padding.sm')};
      }
      ${c('row')} {
        gap: ${v('size.padding.sm')};
        flex-wrap: nowrap;
      }
      ${d('operator')} {
        flex: 0 1 auto;
        min-width: 0;
      }
      ${d('value')} {
        flex: 1 1 0;
        min-width: 80px;
      }
      ${d('remove-btn')} {
        flex: 0 0 auto;
      }
      ${c('condition-divider')} {
        gap: ${v('size.padding.sm')};
        padding: ${v('size.padding.sm')} 0;
        font-size: 0.75rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: ${v('color.surface.500')};
        cursor: pointer;
        transition: color 0.15s ease;
      }
      ${c('condition-divider')}:hover {
        color: ${v('color.primary.500')};
      }
      ${c('condition-divider')}::before, ${c('condition-divider')}::after {
        background: ${v('color.surface.200')};
      }
      ${c('footer')} {
        padding-top: ${v('size.padding.md')};
        border-top: 1px solid ${v('color.border')};
        gap: ${v('size.padding.sm')};
      }
      ${c('footer-actions')} {
        gap: ${v('size.padding.sm')};
      }
      ${c('active-indicator')} {
        top: -2px;
        right: -2px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: ${v('color.primary.500')};
      }
      ${c('summary')} {
        padding-right: ${v('size.padding.sm')};
      }
      ${c('inline')} {
        display: flex;
        flex-direction: column;
        gap: ${v('size.padding.md')};
      }
    `,
  },
  dark: {
    css: ({ v, c }) => css`
      ${c('condition-divider')}::before, ${c('condition-divider')}::after {
        background: ${v('color.surface.600')};
      }
      ${c('footer')} {
        border-top-color: ${v('color.surface.700')};
      }
    `,
  },
});
