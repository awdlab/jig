import { createTheme } from '@awdlab/jig-themes/api';

import { accordionStyles } from '@awdlab/jig-themes/nova/accordion';
import { accordionPanelStyles } from '@awdlab/jig-themes/nova/accordion-panel';
import { movableStyles, resizableStyles, scrollShadowStyles } from '@awdlab/jig-themes/nova/api';
import { avatarGroupStyles, avatarStyles } from '@awdlab/jig-themes/nova/avatar';
import { badgeStyles } from '@awdlab/jig-themes/nova/badge';
import {
  animation,
  backdrop,
  coral,
  font,
  ring,
  shadow,
  sizes,
} from '@awdlab/jig-themes/nova/base';
import { breadcrumbStyles } from '@awdlab/jig-themes/nova/breadcrumb';
import { buttonStyles } from '@awdlab/jig-themes/nova/button';
import { buttonGroupStyles } from '@awdlab/jig-themes/nova/button-group';
import { calendarStyles } from '@awdlab/jig-themes/nova/calendar';
import { checkboxStyles } from '@awdlab/jig-themes/nova/checkbox';
import { chipStyles } from '@awdlab/jig-themes/nova/chip';
import { colorPickerStyles } from '@awdlab/jig-themes/nova/color-picker';
import { commandStyles } from '@awdlab/jig-themes/nova/command';
import { dialogStyles } from '@awdlab/jig-themes/nova/dialog';
import { drawerStyles } from '@awdlab/jig-themes/nova/drawer';
import { dropdownListStyles } from '@awdlab/jig-themes/nova/dropdown-list';
import { editInplaceStyles } from '@awdlab/jig-themes/nova/edit-inplace';
import { filterBarStyles } from '@awdlab/jig-themes/nova/filter-bar';
import { filterBuilderStyles } from '@awdlab/jig-themes/nova/filter-builder';
import { filterFieldStyles } from '@awdlab/jig-themes/nova/filter-field';
import { globalStyles } from '@awdlab/jig-themes/nova/global';
import { hintStyles } from '@awdlab/jig-themes/nova/hint';
import { iconStyles } from '@awdlab/jig-themes/nova/icon';
import { inplaceStyles } from '@awdlab/jig-themes/nova/inplace';
import { inputStyles } from '@awdlab/jig-themes/nova/input';
import { inputFieldStyles } from '@awdlab/jig-themes/nova/input-field';
import { itemViewStyles } from '@awdlab/jig-themes/nova/item-view';
import { kbdStyles } from '@awdlab/jig-themes/nova/kbd';
import { listBoxStyles } from '@awdlab/jig-themes/nova/list-box';
import { maskInputStyles } from '@awdlab/jig-themes/nova/mask-input';
import { menuStyles } from '@awdlab/jig-themes/nova/menu';
import { messageStyles } from '@awdlab/jig-themes/nova/message';
import { meterStyles } from '@awdlab/jig-themes/nova/meter';
import { otpStyles } from '@awdlab/jig-themes/nova/otp';
import { paginatorStyles } from '@awdlab/jig-themes/nova/paginator';
import { popoverStyles } from '@awdlab/jig-themes/nova/popover';
import { progressStyles } from '@awdlab/jig-themes/nova/progress';
import { radioStyles } from '@awdlab/jig-themes/nova/radio';
import { radioGroupStyles } from '@awdlab/jig-themes/nova/radio-group';
import { ratingStyles } from '@awdlab/jig-themes/nova/rating';
import { scrollerStyles } from '@awdlab/jig-themes/nova/scroller';
import { selectStyles } from '@awdlab/jig-themes/nova/select';
import { selectButtonStyles } from '@awdlab/jig-themes/nova/select-button';
import { skeletonStyles } from '@awdlab/jig-themes/nova/skeleton';
import { sliderStyles } from '@awdlab/jig-themes/nova/slider';
import { snackbarStyles } from '@awdlab/jig-themes/nova/snackbar';
import { spinButtonsStyles } from '@awdlab/jig-themes/nova/spin-buttons';
import { spinnerStyles } from '@awdlab/jig-themes/nova/spinner';
import { splitterStyles } from '@awdlab/jig-themes/nova/splitter';
import { stateStyles } from '@awdlab/jig-themes/nova/state';
import { stepperStyles } from '@awdlab/jig-themes/nova/stepper';
import { switchStyles } from '@awdlab/jig-themes/nova/switch';
import { tableStyles } from '@awdlab/jig-themes/nova/table';
import { tabsStyles } from '@awdlab/jig-themes/nova/tabs';
import { tagStyles } from '@awdlab/jig-themes/nova/tag';
import { tagInputStyles } from '@awdlab/jig-themes/nova/tag-input';
import { toastStyles } from '@awdlab/jig-themes/nova/toast';
import { toggleButtonStyles } from '@awdlab/jig-themes/nova/toggle-button';
import { toolbarStyles } from '@awdlab/jig-themes/nova/toolbar';
import { toolbarRegionStyles } from '@awdlab/jig-themes/nova/toolbar-region';
import { tooltipStyles } from '@awdlab/jig-themes/nova/tooltip';
import { treeStyles } from '@awdlab/jig-themes/nova/tree';
import { uploadStyles } from '@awdlab/jig-themes/nova/upload';

import type {} from './theme-types.js';

export const KINDS = {
  button: ['primary', 'secondary', 'link', 'text', 'icon'] as const,
  message: ['default', 'outlined', 'simple'] as const,
  tag: ['default', 'pill'] as const,
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

export const nova = createTheme(
  'Nova',
  [
    accordionPanelStyles,
    accordionStyles,
    animation,
    avatarGroupStyles,
    avatarStyles,
    backdrop,
    badgeStyles,
    breadcrumbStyles,
    buttonGroupStyles,
    buttonStyles,
    calendarStyles,
    checkboxStyles,
    chipStyles,
    colorPickerStyles,
    commandStyles,
    coral,
    dialogStyles,
    drawerStyles,
    dropdownListStyles,
    editInplaceStyles,
    filterBarStyles,
    filterBuilderStyles,
    filterFieldStyles,
    font,
    globalStyles,
    hintStyles,
    iconStyles,
    inplaceStyles,
    inputFieldStyles,
    inputStyles,
    itemViewStyles,
    kbdStyles,
    listBoxStyles,
    maskInputStyles,
    menuStyles,
    messageStyles,
    meterStyles,
    movableStyles,
    otpStyles,
    paginatorStyles,
    popoverStyles,
    progressStyles,
    radioGroupStyles,
    radioStyles,
    ratingStyles,
    resizableStyles,
    ring,
    scrollerStyles,
    scrollShadowStyles,
    selectButtonStyles,
    selectStyles,
    shadow,
    sizes,
    skeletonStyles,
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
    tagInputStyles,
    tagStyles,
    toastStyles,
    toggleButtonStyles,
    toolbarRegionStyles,
    toolbarStyles,
    tooltipStyles,
    treeStyles,
    uploadStyles,
  ],
  {
    kinds: KINDS,
    colors: COLORS,
  }
);
