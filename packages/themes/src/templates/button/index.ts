import { createThemePartTemplate, css } from '@ngneers/controls-themes/api';

const stateVars = {
  background: null,
  color: null,
  borderStyle: null,
  borderWidth: null,
  borderColor: null,
  borderRadius: null,
  padding: null,
  fontFamily: null,
  fontSize: null,
  fontWeight: null,
  lineHeight: null,
  textTransform: null,
  boxShadow: null,
  outlineStyle: null,
  outlineWidth: null,
  outlineColor: null,
  outlineOffset: null,
  cursor: null,
};

const stateVarDefaults = {
  background: '{button.background}',
  color: '{button.color}',
  borderStyle: '{button.borderStyle}',
  borderWidth: '{button.borderWidth}',
  borderColor: '{button.borderColor}',
  borderRadius: '{button.borderRadius}',
  padding: '{button.padding}',
  fontFamily: '{button.fontFamily}',
  fontSize: '{button.fontSize}',
  fontWeight: '{button.fontWeight}',
  lineHeight: '{button.lineHeight}',
  textTransform: '{button.textTransform}',
  boxShadow: '{button.boxShadow}',
  outlineStyle: '{button.outlineStyle}',
  outlineWidth: '{button.outlineWidth}',
  outlineColor: '{button.outlineColor}',
  outlineOffset: '{button.outlineOffset}',
  cursor: '{button.cursor}',
} as const;

export const buttonTemplate = createThemePartTemplate(
  {
    scope: 'button',
    variables: {
      ...stateVars,
      focus: stateVars,
      hover: stateVars,
      active: stateVars,
      disabled: stateVars,
    },
    classNames: ['primary'],
  },
  {
    defaults: {
      focus: stateVarDefaults,
      hover: stateVarDefaults,
      active: stateVarDefaults,
      disabled: stateVarDefaults,
    },
    defaultStyles: ({ c, v }) => css`
      ${c()} {
        background: ${v('button.background')};
        color: ${v('button.color')};
        border-style: ${v('button.borderStyle')};
        border-width: ${v('button.borderWidth')};
        border-color: ${v('button.borderColor')};
        border-radius: ${v('button.borderRadius')};
        padding: ${v('button.padding')};
        font-family: ${v('button.fontFamily')};
        font-size: ${v('button.fontSize')};
        font-weight: ${v('button.fontWeight')};
        line-height: ${v('button.lineHeight')};
        text-transform: ${v('button.textTransform')};
        box-shadow: ${v('button.boxShadow')};
        outline-style: ${v('button.outlineStyle')};
        outline-width: ${v('button.outlineWidth')};
        outline-color: ${v('button.outlineColor')};
        outline-offset: ${v('button.outlineOffset')};
        cursor: ${v('button.cursor')};
      }
      ${c()}:focus-visible {
        background: ${v('button.focus.background')};
        color: ${v('button.focus.color')};
        border-style: ${v('button.focus.borderStyle')};
        border-width: ${v('button.focus.borderWidth')};
        border-color: ${v('button.focus.borderColor')};
        border-radius: ${v('button.focus.borderRadius')};
        padding: ${v('button.focus.padding')};
        font-family: ${v('button.focus.fontFamily')};
        font-size: ${v('button.focus.fontSize')};
        font-weight: ${v('button.focus.fontWeight')};
        line-height: ${v('button.focus.lineHeight')};
        text-transform: ${v('button.focus.textTransform')};
        box-shadow: ${v('button.focus.boxShadow')};
        outline-style: ${v('button.focus.outlineStyle')};
        outline-width: ${v('button.focus.outlineWidth')};
        outline-color: ${v('button.focus.outlineColor')};
        outline-offset: ${v('button.focus.outlineOffset')};
        cursor: ${v('button.focus.cursor')};
      }
      ${c()}:hover {
        background: ${v('button.hover.background')};
        color: ${v('button.hover.color')};
        border-style: ${v('button.hover.borderStyle')};
        border-width: ${v('button.hover.borderWidth')};
        border-color: ${v('button.hover.borderColor')};
        border-radius: ${v('button.hover.borderRadius')};
        padding: ${v('button.hover.padding')};
        font-family: ${v('button.hover.fontFamily')};
        font-size: ${v('button.hover.fontSize')};
        font-weight: ${v('button.hover.fontWeight')};
        line-height: ${v('button.hover.lineHeight')};
        text-transform: ${v('button.hover.textTransform')};
        box-shadow: ${v('button.hover.boxShadow')};
        outline-style: ${v('button.hover.outlineStyle')};
        outline-width: ${v('button.hover.outlineWidth')};
        outline-color: ${v('button.hover.outlineColor')};
        outline-offset: ${v('button.hover.outlineOffset')};
        cursor: ${v('button.hover.cursor')};
      }
      ${c()}:active {
        background: ${v('button.active.background')};
        color: ${v('button.active.color')};
        border-style: ${v('button.active.borderStyle')};
        border-width: ${v('button.active.borderWidth')};
        border-color: ${v('button.active.borderColor')};
        border-radius: ${v('button.active.borderRadius')};
        padding: ${v('button.active.padding')};
        font-family: ${v('button.active.fontFamily')};
        font-size: ${v('button.active.fontSize')};
        font-weight: ${v('button.active.fontWeight')};
        line-height: ${v('button.active.lineHeight')};
        text-transform: ${v('button.active.textTransform')};
        box-shadow: ${v('button.active.boxShadow')};
        outline-style: ${v('button.active.outlineStyle')};
        outline-width: ${v('button.active.outlineWidth')};
        outline-color: ${v('button.active.outlineColor')};
        outline-offset: ${v('button.active.outlineOffset')};
        cursor: ${v('button.active.cursor')};
      }
      ${c()}:disabled {
        background: ${v('button.disabled.background')};
        color: ${v('button.disabled.color')};
        border-style: ${v('button.disabled.borderStyle')};
        border-width: ${v('button.disabled.borderWidth')};
        border-color: ${v('button.disabled.borderColor')};
        border-radius: ${v('button.disabled.borderRadius')};
        padding: ${v('button.disabled.padding')};
        font-family: ${v('button.disabled.fontFamily')};
        font-size: ${v('button.disabled.fontSize')};
        font-weight: ${v('button.disabled.fontWeight')};
        line-height: ${v('button.disabled.lineHeight')};
        text-transform: ${v('button.disabled.textTransform')};
        box-shadow: ${v('button.disabled.boxShadow')};
        outline-style: ${v('button.disabled.outlineStyle')};
        outline-width: ${v('button.disabled.outlineWidth')};
        outline-color: ${v('button.disabled.outlineColor')};
        outline-offset: ${v('button.disabled.outlineOffset')};
        cursor: ${v('button.disabled.cursor')};
      }
    `,
  }
);
