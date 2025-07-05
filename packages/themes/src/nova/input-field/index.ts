import {
  combineVariableVariations,
  createThemePart,
  createVariableTemplate,
  css,
  repeatVariables,
} from '@ngneers/controls-themes/api';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { inputFieldControlTemplate } from '@ngneers/controls-themes/templates/input-field';

const inputFieldKinds = ['', 'readonly'] as const;
const inputFieldValidity = ['', 'error'] as const;
const inputFieldStates = ['', 'hover', 'focus', 'disabled'] as const;

const inputFieldKindsCombined = combineVariableVariations(inputFieldKinds, inputFieldValidity);
const inputFieldVariations = combineVariableVariations(inputFieldKindsCombined, inputFieldStates);

export const inputFieldVariables = createVariableTemplate({
  scope: 'input-field',
  variables: {
    borderRadius: null,
    padding: null,
    boxShadow: null,
    transition: null,
    ...repeatVariables(inputFieldVariations, {
      borderColor: null,
      borderWidth: null,
      outlineColor: null,
      outlineWidth: null,
      background: null,
      color: null,
      cursor: null,
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
      padding: '0.25rem 0.5rem',
      background: '{color.background}',
      color: '{color.text}',
      outlineColor: 'transparent',
      transition:
        'border-color 0.1s ease-in-out, color 0.1s ease-in-out, outline-color 0.1s ease-in-out',
      error: {
        borderColor: '{color.error.default}',
        focus: {
          outlineColor: '{color.error.default}',
          outlineWidth: '1px',
        },
      },
      hover: {
        borderColor: '{color.surface.500}',
      },
      focus: {
        borderColor: '{color.primary.default}',
        outlineColor: '{color.primary.default}',
        outlineWidth: '1px',
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
        box-shadow: ${v('input-field.boxShadow')};
        transition: ${v('input-field.transition')};
        outline-color: ${v('input-field.outlineColor')};
        outline-width: ${v('input-field.outlineWidth')};
        outline-style: solid;
        cursor: ${v('input-field.cursor')};
        &:hover {
          border-color: ${v('input-field.hover.borderColor')};
          border-width: ${v('input-field.hover.borderWidth')};
          background: ${v('input-field.hover.background')};
          color: ${v('input-field.hover.color')};
          outline-color: ${v('input-field.hover.outlineColor')};
          outline-width: ${v('input-field.hover.outlineWidth')};
        }
        &:focus-within {
          border-color: ${v('input-field.focus.borderColor')};
          border-width: ${v('input-field.focus.borderWidth')};
          background: ${v('input-field.focus.background')};
          color: ${v('input-field.focus.color')};
          outline-color: ${v('input-field.focus.outlineColor')};
          outline-width: ${v('input-field.focus.outlineWidth')};
        }
        &:disabled {
          border-color: ${v('input-field.disabled.borderColor')};
          border-width: ${v('input-field.disabled.borderWidth')};
          background: ${v('input-field.disabled.background')};
          color: ${v('input-field.disabled.color')};
          outline-color: ${v('input-field.disabled.outlineColor')};
          outline-width: ${v('input-field.disabled.outlineWidth')};
          cursor: ${v('input-field.disabled.cursor')};
        }
      }
      .ng-invalid.ng-touched ${c()}, ${c()} .ng-invalid.ng-touched {
        border-color: ${v('input-field.error.borderColor')};
        border-width: ${v('input-field.error.borderWidth')};
        background: ${v('input-field.error.background')};
        color: ${v('input-field.error.color')};
        outline-color: ${v('input-field.error.outlineColor')};
        outline-width: ${v('input-field.error.outlineWidth')};
        cursor: ${v('input-field.error.cursor')};
        &:hover {
          border-color: ${v('input-field.error.hover.borderColor')};
          border-width: ${v('input-field.error.hover.borderWidth')};
          background: ${v('input-field.error.hover.background')};
          color: ${v('input-field.error.hover.color')};
          outline-color: ${v('input-field.error.hover.outlineColor')};
          outline-width: ${v('input-field.error.hover.outlineWidth')};
        }
        &:focus-within {
          border-color: ${v('input-field.error.focus.borderColor')};
          border-width: ${v('input-field.error.focus.borderWidth')};
          background: ${v('input-field.error.focus.background')};
          color: ${v('input-field.error.focus.color')};
          outline-color: ${v('input-field.error.focus.outlineColor')};
          outline-width: ${v('input-field.error.focus.outlineWidth')};
        }
        &:disabled {
          border-color: ${v('input-field.error.disabled.borderColor')};
          border-width: ${v('input-field.error.disabled.borderWidth')};
          background: ${v('input-field.error.disabled.background')};
          color: ${v('input-field.error.disabled.color')};
          outline-color: ${v('input-field.error.disabled.outlineColor')};
          outline-width: ${v('input-field.error.disabled.outlineWidth')};
          cursor: ${v('input-field.error.disabled.cursor')};
        }
      }
      ${c('readonly')} {
        background: ${v('input-field.readonly.background')};
        color: ${v('input-field.readonly.color')};
        border-color: ${v('input-field.readonly.borderColor')};
        border-width: ${v('input-field.readonly.borderWidth')};
        outline-color: ${v('input-field.readonly.outlineColor')};
        outline-width: ${v('input-field.readonly.outlineWidth')};
        cursor: ${v('input-field.readonly.cursor')};
        &:hover {
          background: ${v('input-field.readonly.hover.background')};
          color: ${v('input-field.readonly.hover.color')};
          border-color: ${v('input-field.readonly.hover.borderColor')};
          border-width: ${v('input-field.readonly.hover.borderWidth')};
          outline-color: ${v('input-field.readonly.hover.outlineColor')};
          outline-width: ${v('input-field.readonly.hover.outlineWidth')};
        }
        &:focus-within {
          background: ${v('input-field.readonly.focus.background')};
          color: ${v('input-field.readonly.focus.color')};
          border-color: ${v('input-field.readonly.focus.borderColor')};
          border-width: ${v('input-field.readonly.focus.borderWidth')};
          outline-color: ${v('input-field.readonly.focus.outlineColor')};
          outline-width: ${v('input-field.readonly.focus.outlineWidth')};
        }
      }
    `,
  },
});
