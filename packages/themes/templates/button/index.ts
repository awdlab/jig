import { createThemePart, createThemePartTemplate, css } from '@ngneers/controls-themes';

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
  background: '{background}',
  color: '{color}',
  borderStyle: '{borderStyle}',
  borderWidth: '{borderWidth}',
  borderColor: '{borderColor}',
  borderRadius: '{borderRadius}',
  padding: '{padding}',
  fontFamily: '{fontFamily}',
  fontSize: '{fontSize}',
  fontWeight: '{fontWeight}',
  lineHeight: '{lineHeight}',
  textTransform: '{textTransform}',
  boxShadow: '{boxShadow}',
  outlineStyle: '{outlineStyle}',
  outlineWidth: '{outlineWidth}',
  outlineColor: '{outlineColor}',
  outlineOffset: '{outlineOffset}',
  cursor: '{cursor}',
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
    classNames: [],
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
        background: ${v('background')};
        color: ${v('color')};
        border-style: ${v('borderStyle')};
        border-width: ${v('borderWidth')};
        border-color: ${v('borderColor')};
        border-radius: ${v('borderRadius')};
        padding: ${v('padding')};
        font-family: ${v('fontFamily')};
        font-size: ${v('fontSize')};
        font-weight: ${v('fontWeight')};
        line-height: ${v('lineHeight')};
        text-transform: ${v('textTransform')};
        box-shadow: ${v('boxShadow')};
        outline-style: ${v('outlineStyle')};
        outline-width: ${v('outlineWidth')};
        outline-color: ${v('outlineColor')};
        outline-offset: ${v('outlineOffset')};
        cursor: ${v('cursor')};
      }
      ${c()}:focus-visible {
        background: ${v('focus.background')};
        color: ${v('focus.color')};
        border-style: ${v('focus.borderStyle')};
        border-width: ${v('focus.borderWidth')};
        border-color: ${v('focus.borderColor')};
        border-radius: ${v('focus.borderRadius')};
        padding: ${v('focus.padding')};
        font-family: ${v('focus.fontFamily')};
        font-size: ${v('focus.fontSize')};
        font-weight: ${v('focus.fontWeight')};
        line-height: ${v('focus.lineHeight')};
        text-transform: ${v('focus.textTransform')};
        box-shadow: ${v('focus.boxShadow')};
        outline-style: ${v('focus.outlineStyle')};
        outline-width: ${v('focus.outlineWidth')};
        outline-color: ${v('focus.outlineColor')};
        outline-offset: ${v('focus.outlineOffset')};
        cursor: ${v('focus.cursor')};
      }
      ${c()}:hover {
        background: ${v('hover.background')};
        color: ${v('hover.color')};
        border-style: ${v('hover.borderStyle')};
        border-width: ${v('hover.borderWidth')};
        border-color: ${v('hover.borderColor')};
        border-radius: ${v('hover.borderRadius')};
        padding: ${v('hover.padding')};
        font-family: ${v('hover.fontFamily')};
        font-size: ${v('hover.fontSize')};
        font-weight: ${v('hover.fontWeight')};
        line-height: ${v('hover.lineHeight')};
        text-transform: ${v('hover.textTransform')};
        box-shadow: ${v('hover.boxShadow')};
        outline-style: ${v('hover.outlineStyle')};
        outline-width: ${v('hover.outlineWidth')};
        outline-color: ${v('hover.outlineColor')};
        outline-offset: ${v('hover.outlineOffset')};
        cursor: ${v('hover.cursor')};
      }
      ${c()}:active {
        background: ${v('active.background')};
        color: ${v('active.color')};
        border-style: ${v('active.borderStyle')};
        border-width: ${v('active.borderWidth')};
        border-color: ${v('active.borderColor')};
        border-radius: ${v('active.borderRadius')};
        padding: ${v('active.padding')};
        font-family: ${v('active.fontFamily')};
        font-size: ${v('active.fontSize')};
        font-weight: ${v('active.fontWeight')};
        line-height: ${v('active.lineHeight')};
        text-transform: ${v('active.textTransform')};
        box-shadow: ${v('active.boxShadow')};
        outline-style: ${v('active.outlineStyle')};
        outline-width: ${v('active.outlineWidth')};
        outline-color: ${v('active.outlineColor')};
        outline-offset: ${v('active.outlineOffset')};
        cursor: ${v('active.cursor')};
      }
      ${c()}:disabled {
        background: ${v('disabled.background')};
        color: ${v('disabled.color')};
        border-style: ${v('disabled.borderStyle')};
        border-width: ${v('disabled.borderWidth')};
        border-color: ${v('disabled.borderColor')};
        border-radius: ${v('disabled.borderRadius')};
        padding: ${v('disabled.padding')};
        font-family: ${v('disabled.fontFamily')};
        font-size: ${v('disabled.fontSize')};
        font-weight: ${v('disabled.fontWeight')};
        line-height: ${v('disabled.lineHeight')};
        text-transform: ${v('disabled.textTransform')};
        box-shadow: ${v('disabled.boxShadow')};
        outline-style: ${v('disabled.outlineStyle')};
        outline-width: ${v('disabled.outlineWidth')};
        outline-color: ${v('disabled.outlineColor')};
        outline-offset: ${v('disabled.outlineOffset')};
        cursor: ${v('disabled.cursor')};
      }
    `,
  }
);
