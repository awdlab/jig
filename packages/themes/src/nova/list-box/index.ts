import {
  combineVariableVariations,
  createThemePart,
  createVariableTemplate,
  css,
  repeatVariables,
} from '@ngneers/controls-themes/api';
import { colorsTemplate } from '@ngneers/controls-themes/nova/base';
import { listBoxControlTemplate } from '@ngneers/controls-themes/templates/list-box';

const listBoxKinds = [''] as const;
const listBoxStates = ['', 'disabled'] as const;

export const listBoxVariables = createVariableTemplate({
  scope: 'list-box',
  variables: {
    // TODO: Find maybe better names for these functions
    ...repeatVariables(combineVariableVariations(listBoxKinds, listBoxStates), {
      background: null,
      color: null,
      borderColor: null,
    }),
    borderRadius: null,
    borderColor: null,
    borderWidth: null,
    fontSize: null,
    fontWeight: null,
    scroller: {
      padding: null,
    },
    ...repeatVariables(
      [...combineVariableVariations(['item'], ['', 'selected', 'highlighted']), 'group'],
      {
        background: null,
        padding: null,
        color: null,
        borderRadius: null,
        borderColor: null,
        borderWidth: null,
        hover: {
          background: null,
          color: null,
        },
      }
    ),
  },
});

export const listBoxStyles = createThemePart({
  controlTemplate: listBoxControlTemplate,
  variables: [listBoxVariables],
  dependencies: [colorsTemplate],
  root: {
    values: {
      borderRadius: '0.25rem',
      borderColor: '{color.surface.300}',
      borderWidth: '1px',
      scroller: {
        padding: '0.25rem',
      },
      item: {
        padding: '0.5rem',
        borderRadius: '0.25rem',
        borderWidth: '0',
        hover: {
          background: '{color.surface.200}',
        },
        selected: {
          background: '{color.surface.300}',
          hover: {
            background: '{color.surface.300}',
          },
        },
        highlighted: {
          background: '{color.surface.200}',
        },
      },
      group: {
        padding: '0.5rem 0.5rem 0.5rem 1rem',
        color: '{color.surface.600}',
        borderRadius: '0.25rem',
        borderWidth: '0',
        background: '{color.surface.100}',
        hover: {
          background: '{color.surface.100}',
        },
      },
    },
    css: ({ v, c }) => css`
      ${c()} {
        border-radius: ${v('list-box.borderRadius')};
        border-color: ${v('list-box.borderColor')};
        border-width: ${v('list-box.borderWidth')};
        border-style: solid;
      }
      ${c('scroller')} {
        padding: ${v('list-box.scroller.padding')};
      }
      ${c('item')} {
        display: inline-block;
        width: 100%;
        padding: ${v('list-box.item.padding')};
        background: ${v('list-box.item.background')};
        color: ${v('list-box.item.color')};
        border-radius: ${v('list-box.item.borderRadius')};
        border-color: ${v('list-box.item.borderColor')};
        border-width: ${v('list-box.item.borderWidth')};
        border-style: solid;
        &:hover {
          background: ${v('list-box.item.hover.background')};
          color: ${v('list-box.item.hover.color')};
        }
      }
      ${c('item-highlighted')} {
        background: ${v('list-box.item.highlighted.background')};
        color: ${v('list-box.item.color')};
      }
      ${c('item-selected')} {
        background: ${v('list-box.item.selected.background')};
        color: ${v('list-box.item.color')};
        &:hover {
          background: ${v('list-box.item.selected.hover.background')};
          color: ${v('list-box.item.hover.color')};
        }
      }
      ${c('group')} {
        display: inline-block;
        width: 100%;
        padding: ${v('list-box.group.padding')};
        background: ${v('list-box.group.background')};
        color: ${v('list-box.group.color')};
        border-radius: ${v('list-box.group.borderRadius')};
        border-color: ${v('list-box.group.borderColor')};
        border-width: ${v('list-box.group.borderWidth')};
        border-style: solid;
        &:hover {
          background: ${v('list-box.group.hover.background')};
          color: ${v('list-box.group.hover.color')};
        }
      }
    `,
  },
});
