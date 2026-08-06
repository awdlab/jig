import { createTheme } from '@ngneers/controls-themes/api';

import { accordionStyles } from '@ngneers/controls-themes/material/accordion';
import { accordionPanelStyles } from '@ngneers/controls-themes/material/accordion-panel';
import {
  movableStyles,
  resizableStyles,
  scrollShadowStyles,
} from '@ngneers/controls-themes/material/api';
import { avatarGroupStyles, avatarStyles } from '@ngneers/controls-themes/material/avatar';
import { badgeStyles } from '@ngneers/controls-themes/material/badge';
import {
  animation,
  font,
  material as materialColors,
  shadow,
  sizes,
} from '@ngneers/controls-themes/material/base';
import { breadcrumbStyles } from '@ngneers/controls-themes/material/breadcrumb';
import { buttonStyles } from '@ngneers/controls-themes/material/button';
import { buttonGroupStyles } from '@ngneers/controls-themes/material/button-group';
import { calendarStyles } from '@ngneers/controls-themes/material/calendar';
import { checkboxStyles } from '@ngneers/controls-themes/material/checkbox';
import { chipStyles } from '@ngneers/controls-themes/material/chip';
import { colorPickerStyles } from '@ngneers/controls-themes/material/color-picker';
import { commandStyles } from '@ngneers/controls-themes/material/command';
import { dialogStyles } from '@ngneers/controls-themes/material/dialog';
import { drawerStyles } from '@ngneers/controls-themes/material/drawer';
import { editInplaceStyles } from '@ngneers/controls-themes/material/edit-inplace';
import { filterStyles } from '@ngneers/controls-themes/material/filter';
import { hintStyles } from '@ngneers/controls-themes/material/hint';
import { iconStyles } from '@ngneers/controls-themes/material/icon';
import { inplaceStyles } from '@ngneers/controls-themes/material/inplace';
import { inputStyles } from '@ngneers/controls-themes/material/input';
import { inputFieldStyles } from '@ngneers/controls-themes/material/input-field';
import { itemViewStyles } from '@ngneers/controls-themes/material/item-view';
import { kbdStyles } from '@ngneers/controls-themes/material/kbd';
import { listBoxStyles } from '@ngneers/controls-themes/material/list-box';
import { maskInputStyles } from '@ngneers/controls-themes/material/mask-input';
import { menuStyles } from '@ngneers/controls-themes/material/menu';
import { messageStyles } from '@ngneers/controls-themes/material/message';
import { otpStyles } from '@ngneers/controls-themes/material/otp';
import { paginatorStyles } from '@ngneers/controls-themes/material/paginator';
import { popoverStyles } from '@ngneers/controls-themes/material/popover';
import { progressStyles } from '@ngneers/controls-themes/material/progress';
import { radioStyles } from '@ngneers/controls-themes/material/radio';
import { radioGroupStyles } from '@ngneers/controls-themes/material/radio-group';
import { ratingStyles } from '@ngneers/controls-themes/material/rating';
import { scrollerStyles } from '@ngneers/controls-themes/material/scroller';
import { selectStyles } from '@ngneers/controls-themes/material/select';
import { selectButtonStyles } from '@ngneers/controls-themes/material/select-button';
import { sliderStyles } from '@ngneers/controls-themes/material/slider';
import { snackbarStyles } from '@ngneers/controls-themes/material/snackbar';
import { spinButtonsStyles } from '@ngneers/controls-themes/material/spin-buttons';
import { spinnerStyles } from '@ngneers/controls-themes/material/spinner';
import { splitterStyles } from '@ngneers/controls-themes/material/splitter';
import { stateStyles } from '@ngneers/controls-themes/material/state';
import { stepperStyles } from '@ngneers/controls-themes/material/stepper';
import { switchStyles } from '@ngneers/controls-themes/material/switch';
import { tableStyles } from '@ngneers/controls-themes/material/table';
import { tabsStyles } from '@ngneers/controls-themes/material/tabs';
import { tagStyles } from '@ngneers/controls-themes/material/tag';
import { toastStyles } from '@ngneers/controls-themes/material/toast';
import { toggleButtonStyles } from '@ngneers/controls-themes/material/toggle-button';
import { tooltipStyles } from '@ngneers/controls-themes/material/tooltip';
import { treeStyles } from '@ngneers/controls-themes/material/tree';
import { uploadStyles } from '@ngneers/controls-themes/material/upload';

import type {} from './theme-types';

export const KINDS = {
  button: ['primary', 'secondary', 'link', 'text', 'icon'] as const,
  message: ['default', 'outlined', 'simple'] as const,
  tag: ['default', 'pill'] as const,
  'input-field': ['outlined', 'filled'] as const,
  inputFieldLabel: ['in', 'on', 'over', 'floatIn', 'floatOn', 'floatOver', 'hidden'] as const,
  spinButtons: ['stacked', 'inline'] as const,
  hint: ['default', 'info', 'success', 'warning', 'error'] as const,
  state: ['loading', 'cancelled', 'success', 'warning', 'error'] as const,
  splitter: ['default', 'thin', 'invisible'] as const,
};

export const COLORS = [
  'primary',
  'secondary',
  'accent',
  'surface',
  'info',
  'success',
  'warning',
  'error',
] as const;

export const material = createTheme(
  'Material',
  [
    accordionStyles,
    accordionPanelStyles,
    animation,
    avatarGroupStyles,
    avatarStyles,
    badgeStyles,
    breadcrumbStyles,
    buttonStyles,
    buttonGroupStyles,
    calendarStyles,
    checkboxStyles,
    chipStyles,
    colorPickerStyles,
    commandStyles,
    materialColors,
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
    maskInputStyles,
    inputStyles,
    itemViewStyles,
    kbdStyles,
    listBoxStyles,
    menuStyles,
    messageStyles,
    otpStyles,
    movableStyles,
    paginatorStyles,
    popoverStyles,
    progressStyles,
    radioGroupStyles,
    radioStyles,
    ratingStyles,
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
    stepperStyles,
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
