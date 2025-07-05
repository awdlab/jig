import {
  combineVariableVariations,
  createThemePart,
  createVariableTemplate,
  css,
  repeatVariables,
} from '@ngneers/controls-themes/api';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { inputFieldControlTemplate } from '@ngneers/controls-themes/templates/input-field';

const inputFieldKinds = ['', 'disabled', 'readonly'] as const;
const inputFieldStates = ['', 'hover', 'focus'] as const;
const inputFieldValidity = ['', 'error'] as const;

const inputFieldVariations = combineVariableVariations(
  combineVariableVariations(inputFieldKinds, inputFieldStates),
  inputFieldValidity
);

export const inputFieldVariables = createVariableTemplate({
  scope: 'input-field',
  variables: {
    ...repeatVariables(inputFieldVariations, {
      borderColor: null,
      borderRadius: null,
      borderWidth: null,
      padding: null,
      background: null,
      color: null,
      boxShadow: null,
    }),
  },
});

export const inputFieldStyles = createThemePart({
  controlTemplate: inputFieldControlTemplate,
  variables: [inputFieldVariables],
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    values: {
      borderColor: '{color.surface.300}',
      borderRadius: '{size.rounded.md}',
      borderWidth: '1px',
      padding: '0',
      background: '{color.background}',
      color: '{color.text}',
      error: {
        borderColor: '{color.error.default}',
      },
    },
    css: ({ v, c }) => css`
      ${c()} {
        border-radius: ${v('input-field.borderRadius')};
        border-color: ${v('input-field.borderColor')};
        border-width: ${v('input-field.borderWidth')};
        border-style: solid;
        padding: ${v('input-field.padding')};
        background: ${v('input-field.background')};
        color: ${v('input-field.color')};
        &:has(.ng-invalid) {
          border-radius: ${v('input-field.error.borderRadius')};
          border-color: ${v('input-field.error.borderColor')};
          border-width: ${v('input-field.error.borderWidth')};
          padding: ${v('input-field.error.padding')};
          background: ${v('input-field.error.background')};
          color: ${v('input-field.error.color')};
          &:hover {
            border-radius: ${v('input-field.hover.error.borderRadius')};
            border-color: ${v('input-field.hover.error.borderColor')};
            border-width: ${v('input-field.hover.error.borderWidth')};
            padding: ${v('input-field.hover.error.padding')};
            background: ${v('input-field.hover.error.background')};
            color: ${v('input-field.hover.error.color')};
          }
        }
      }
    `,
  },
});
