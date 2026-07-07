import { createTheme } from '@ngneers/controls-themes/api';

import { accordionStyles } from '@ngneers/controls-themes/nova/accordion';
import { accordionPanelStyles } from '@ngneers/controls-themes/nova/accordion-panel';
import {
  movableStyles,
  resizableStyles,
  scrollShadowStyles,
} from '@ngneers/controls-themes/nova/api';
import { avatarGroupStyles, avatarStyles } from '@ngneers/controls-themes/nova/avatar';
import { animation, coral, font, sizes, shadow } from '@ngneers/controls-themes/nova/base';
import { breadcrumbStyles } from '@ngneers/controls-themes/nova/breadcrumb';
import { buttonStyles } from '@ngneers/controls-themes/nova/button';
import { buttonGroupStyles } from '@ngneers/controls-themes/nova/button-group';
import { calendarStyles } from '@ngneers/controls-themes/nova/calendar';
import { checkboxStyles } from '@ngneers/controls-themes/nova/checkbox';
import { chipStyles } from '@ngneers/controls-themes/nova/chip';
import { dialogStyles } from '@ngneers/controls-themes/nova/dialog';
import { drawerStyles } from '@ngneers/controls-themes/nova/drawer';
import { editInplaceStyles } from '@ngneers/controls-themes/nova/edit-inplace';
import { filterStyles } from '@ngneers/controls-themes/nova/filter';
import { hintStyles } from '@ngneers/controls-themes/nova/hint';
import { iconStyles } from '@ngneers/controls-themes/nova/icon';
import { inplaceStyles } from '@ngneers/controls-themes/nova/inplace';
import { inputStyles } from '@ngneers/controls-themes/nova/input';
import { inputFieldStyles } from '@ngneers/controls-themes/nova/input-field';
import { inputMaskStyles } from '@ngneers/controls-themes/nova/input-mask';
import { itemViewStyles } from '@ngneers/controls-themes/nova/item-view';
import { listBoxStyles } from '@ngneers/controls-themes/nova/list-box';
import { menuStyles } from '@ngneers/controls-themes/nova/menu';
import { messageStyles } from '@ngneers/controls-themes/nova/message';
import { paginatorStyles } from '@ngneers/controls-themes/nova/paginator';
import { popoverStyles } from '@ngneers/controls-themes/nova/popover';
import { progressStyles } from '@ngneers/controls-themes/nova/progress';
import { radioStyles } from '@ngneers/controls-themes/nova/radio';
import { radioGroupStyles } from '@ngneers/controls-themes/nova/radio-group';
import { scrollerStyles } from '@ngneers/controls-themes/nova/scroller';
import { selectStyles } from '@ngneers/controls-themes/nova/select';
import { selectButtonStyles } from '@ngneers/controls-themes/nova/select-button';
import { sliderStyles } from '@ngneers/controls-themes/nova/slider';
import { snackbarStyles } from '@ngneers/controls-themes/nova/snackbar';
import { spinButtonsStyles } from '@ngneers/controls-themes/nova/spin-buttons';
import { spinnerStyles } from '@ngneers/controls-themes/nova/spinner';
import { splitterStyles } from '@ngneers/controls-themes/nova/splitter';
import { stateStyles } from '@ngneers/controls-themes/nova/state';
import { switchStyles } from '@ngneers/controls-themes/nova/switch';
import { tableStyles } from '@ngneers/controls-themes/nova/table';
import { tabsStyles } from '@ngneers/controls-themes/nova/tabs';
import { tagStyles } from '@ngneers/controls-themes/nova/tag';
import { toastStyles } from '@ngneers/controls-themes/nova/toast';
import { toggleButtonStyles } from '@ngneers/controls-themes/nova/toggle-button';
import { tooltipStyles } from '@ngneers/controls-themes/nova/tooltip';
import { treeStyles } from '@ngneers/controls-themes/nova/tree';
import { uploadStyles } from '@ngneers/controls-themes/nova/upload';

import type {} from './theme-types';

export const KINDS = {
  button: ['primary', 'secondary', 'link', 'text', 'icon'] as const,
  message: ['default', 'outlined', 'simple'] as const,
  tag: ['default', 'pill'] as const,
  inputFieldLabel: ['in', 'on', 'over', 'floatIn', 'floatOn', 'floatOver', 'hidden'] as const,
  spinButtons: ['stacked', 'inline'] as const,
  hint: ['default', 'info', 'success', 'warning', 'error'] as const,
  state: ['loading', 'cancelled', 'success', 'warning', 'error'] as const,
};

export const COLORS = [
  'surface',
  'primary',
  'secondary',
  'accent',
  'info',
  'success',
  'warning',
  'error',
] as const;

export const novaCoral = createTheme(
  'Nova Coral',
  [
    accordionStyles,
    accordionPanelStyles,
    animation,
    avatarGroupStyles,
    avatarStyles,
    breadcrumbStyles,
    buttonStyles,
    buttonGroupStyles,
    calendarStyles,
    checkboxStyles,
    chipStyles,
    coral,
    dialogStyles,
    drawerStyles,
    filterStyles,
    editInplaceStyles,
    font,
    hintStyles,
    iconStyles,
    shadow,
    inplaceStyles,
    inputFieldStyles,
    inputMaskStyles,
    inputStyles,
    itemViewStyles,
    listBoxStyles,
    menuStyles,
    messageStyles,
    movableStyles,
    paginatorStyles,
    popoverStyles,
    progressStyles,
    radioGroupStyles,
    radioStyles,
    resizableStyles,
    scrollShadowStyles,
    scrollerStyles,
    selectStyles,
    selectButtonStyles,
    sizes,
    sliderStyles,
    snackbarStyles,
    spinButtonsStyles,
    spinnerStyles,
    splitterStyles,
    stateStyles,
    switchStyles,
    tableStyles,
    tabsStyles,
    tagStyles,
    toastStyles,
    toggleButtonStyles,
    tooltipStyles,
    treeStyles,
    uploadStyles,
  ],
  {
    kinds: KINDS,
    colors: COLORS,
  }
);
