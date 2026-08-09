import { createTheme } from '@awdlab/jig-themes/api';

import { accordionStyles } from '@awdlab/jig-themes/material/accordion';
import { accordionPanelStyles } from '@awdlab/jig-themes/material/accordion-panel';
import {
  movableStyles,
  resizableStyles,
  scrollShadowStyles,
} from '@awdlab/jig-themes/material/api';
import { avatarGroupStyles, avatarStyles } from '@awdlab/jig-themes/material/avatar';
import { badgeStyles } from '@awdlab/jig-themes/material/badge';
import {
  animation,
  font,
  material as materialColors,
  shadow,
  sizes,
} from '@awdlab/jig-themes/material/base';
import { breadcrumbStyles } from '@awdlab/jig-themes/material/breadcrumb';
import { buttonStyles } from '@awdlab/jig-themes/material/button';
import { buttonGroupStyles } from '@awdlab/jig-themes/material/button-group';
import { calendarStyles } from '@awdlab/jig-themes/material/calendar';
import { checkboxStyles } from '@awdlab/jig-themes/material/checkbox';
import { chipStyles } from '@awdlab/jig-themes/material/chip';
import { colorPickerStyles } from '@awdlab/jig-themes/material/color-picker';
import { commandStyles } from '@awdlab/jig-themes/material/command';
import { dialogStyles } from '@awdlab/jig-themes/material/dialog';
import { drawerStyles } from '@awdlab/jig-themes/material/drawer';
import { editInplaceStyles } from '@awdlab/jig-themes/material/edit-inplace';
import { filterStyles } from '@awdlab/jig-themes/material/filter';
import { hintStyles } from '@awdlab/jig-themes/material/hint';
import { iconStyles } from '@awdlab/jig-themes/material/icon';
import { inplaceStyles } from '@awdlab/jig-themes/material/inplace';
import { inputStyles } from '@awdlab/jig-themes/material/input';
import { inputFieldStyles } from '@awdlab/jig-themes/material/input-field';
import { itemViewStyles } from '@awdlab/jig-themes/material/item-view';
import { kbdStyles } from '@awdlab/jig-themes/material/kbd';
import { listBoxStyles } from '@awdlab/jig-themes/material/list-box';
import { maskInputStyles } from '@awdlab/jig-themes/material/mask-input';
import { menuStyles } from '@awdlab/jig-themes/material/menu';
import { messageStyles } from '@awdlab/jig-themes/material/message';
import { otpStyles } from '@awdlab/jig-themes/material/otp';
import { paginatorStyles } from '@awdlab/jig-themes/material/paginator';
import { popoverStyles } from '@awdlab/jig-themes/material/popover';
import { progressStyles } from '@awdlab/jig-themes/material/progress';
import { radioStyles } from '@awdlab/jig-themes/material/radio';
import { radioGroupStyles } from '@awdlab/jig-themes/material/radio-group';
import { ratingStyles } from '@awdlab/jig-themes/material/rating';
import { scrollerStyles } from '@awdlab/jig-themes/material/scroller';
import { selectStyles } from '@awdlab/jig-themes/material/select';
import { selectButtonStyles } from '@awdlab/jig-themes/material/select-button';
import { sliderStyles } from '@awdlab/jig-themes/material/slider';
import { snackbarStyles } from '@awdlab/jig-themes/material/snackbar';
import { spinButtonsStyles } from '@awdlab/jig-themes/material/spin-buttons';
import { spinnerStyles } from '@awdlab/jig-themes/material/spinner';
import { splitterStyles } from '@awdlab/jig-themes/material/splitter';
import { stateStyles } from '@awdlab/jig-themes/material/state';
import { stepperStyles } from '@awdlab/jig-themes/material/stepper';
import { switchStyles } from '@awdlab/jig-themes/material/switch';
import { tableStyles } from '@awdlab/jig-themes/material/table';
import { tabsStyles } from '@awdlab/jig-themes/material/tabs';
import { tagStyles } from '@awdlab/jig-themes/material/tag';
import { toastStyles } from '@awdlab/jig-themes/material/toast';
import { toggleButtonStyles } from '@awdlab/jig-themes/material/toggle-button';
import { tooltipStyles } from '@awdlab/jig-themes/material/tooltip';
import { treeStyles } from '@awdlab/jig-themes/material/tree';
import { uploadStyles } from '@awdlab/jig-themes/material/upload';

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
