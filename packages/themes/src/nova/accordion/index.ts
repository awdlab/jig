import { createThemePart, css } from '@ngneers/controls-themes/api';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { accordionControlTemplate } from '@ngneers/controls-themes/templates/accordion';

export const accordionStyles = createThemePart({
  controlTemplate: accordionControlTemplate,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c()} {
        display: flex;
        flex-direction: column;
        --icon-size: 14px;
      }
      ${c('panel')} {
        border-bottom: 1px solid ${v('color.surface.200')};
      }
      ${c('panel-content-expander')} {
        color: ${v('color.text')};
        /**
        * Nice css trick to animate from auto height to 0 without using (currently not well supported) 'interpolate-size'
        * Source: https://css-tricks.com/css-grid-can-do-auto-height-transitions
        */
        display: grid;
        grid-template-rows: 1fr;
        overflow: hidden;
        transition: grid-template-rows 0.2s ease-in-out;
      }
      ${c('panel-content')} {
        min-height: 0;
        ngn-defer {
          padding-top: 0;
          padding-bottom: ${v('size.padding.md')};
          padding-left: ${v('size.padding.xl')};
          padding-right: ${v('size.padding.xl')};
          display: block;
        }
      }
      ${c('panel-content-expander-collapsed')} {
        grid-template-rows: 0fr;
      }
      ${c('panel-header')} {
        display: flex;
        width: 100%;
        background: transparent;
        border: none;
        padding: 0;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        user-select: none;
        ngn-icon {
          color: ${v('color.surface.500')};
          margin: 0 ${v('size.padding.md')};
          transition: color 0.2s ease-in-out;
        }
        &:hover {
          ${c('panel-header-text')} {
            color: ${v('color.surface.600')};
          }
          ngn-icon {
            color: ${v('color.surface.600')};
          }
        }
        &:focus-visible {
          outline: none;
          ${c('panel-header-text')} {
            color: ${v('color.text')};
          }
          ngn-icon {
            color: ${v('color.text')};
          }
        }
      }
      ${c('panel-header-disabled')}, ${c('panel-header-disabled')}:hover {
        cursor: default;
        ${c('panel-header-text')} {
          color: ${v('color.surface.300')};
        }
        ngn-icon {
          color: ${v('color.surface.300')};
        }
      }
      ${c('panel-header-text')} {
        padding: ${v('size.padding.md')} ${v('size.padding.xl')};
        font-weight: ${v('font.weight.semibold')};
        color: ${v('color.surface.500')};
        transition: color 0.2s ease-in-out;
      }
    `,
  },
});
