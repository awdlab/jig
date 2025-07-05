import {
  buildVariationCombinationStyles,
  combineVariableVariations,
  createThemePart,
  createVariableTemplate,
  css,
  repeatVariables,
} from '@ngneers/controls-themes/api';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { buttonControlTemplate } from '@ngneers/controls-themes/templates/button';
import { subKey } from 'packages/themes/src/api/utils/sub-key';

const buttonKinds = ['', 'primary', 'secondary', 'text', 'link'] as const;
const buttonStates = ['', 'focus', 'hover', 'active', 'disabled'] as const;

export const buttonVariables = createVariableTemplate({
  scope: 'button',
  variables: {
    // TODO: Find maybe better names for these functions
    ...repeatVariables(combineVariableVariations(buttonKinds, buttonStates), {
      background: null,
      color: null,
      borderColor: null,
    }),
    borderRadius: null,
    borderStyle: null,
    fontSize: null,
    fontWeight: null,
    padding: null,
  },
});

export const buttonStyles = createThemePart({
  controlTemplate: buttonControlTemplate,
  variables: [buttonVariables],
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    values: {
      background: '{color.primary.default}',
      color: '{color.text}',
      borderRadius: '{size.rounded.md}',
      fontSize: '0.875rem',
      fontWeight: '600',
      padding: '0.5rem 1rem',
      hover: {
        background: '{color.primary.200}',
      },
      focus: {
        background: '{color.primary.300}',
      },
      active: {
        background: '{color.primary.100}',
      },
      link: {
        background: 'transparent',
        color: '{color.primary.default}',
        borderColor: 'transparent',
      },
    },
    css: ({ v, c }) =>
      // TODO: That function name is nasty :D
      buildVariationCombinationStyles(
        [buttonKinds, buttonStates],
        (variation, state) => css`
          ${c(variation ? `kind-${variation}` : '')}${state ? `:${state}` : ''} {
            background: ${v(subKey('button', variation, state, 'background'))};
            color: ${v(subKey('button', variation, state, 'color'))};
            border-color: ${v(subKey('button', variation, state, 'borderColor'))};
          }
        `
      ) +
      css`
        ${c()} {
          border-radius: ${v('button.borderRadius')};
          border-style: ${v('button.borderStyle')};
          font-size: ${v('button.fontSize')};
          font-weight: ${v('button.fontWeight')};
          padding: ${v('button.padding')};
          cursor: pointer;
        }
        ${c('kind-link')} {
          text-decoration: underline;
        }
      `,
  },
});
