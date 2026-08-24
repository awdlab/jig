import { createTheme } from '@awdlab/jig-themes/api';

import { accordionStyles } from '@awdlab/jig-themes/shade/accordion';
import { accordionPanelStyles } from '@awdlab/jig-themes/shade/accordion-panel';
import { movableStyles, resizableStyles, scrollShadowStyles } from '@awdlab/jig-themes/shade/api';
import { avatarGroupStyles, avatarStyles } from '@awdlab/jig-themes/shade/avatar';
import { badgeStyles } from '@awdlab/jig-themes/shade/badge';
import {
  animation,
  backdrop,
  font,
  PUBLIC_COLOR_SLOTS,
  shadow,
  sizes,
  zinc,
} from '@awdlab/jig-themes/shade/base';
import { breadcrumbStyles } from '@awdlab/jig-themes/shade/breadcrumb';
import { buttonStyles } from '@awdlab/jig-themes/shade/button';
import { buttonGroupStyles } from '@awdlab/jig-themes/shade/button-group';
import { calendarStyles } from '@awdlab/jig-themes/shade/calendar';
import { checkboxStyles } from '@awdlab/jig-themes/shade/checkbox';
import { chipStyles } from '@awdlab/jig-themes/shade/chip';
import { colorPickerStyles } from '@awdlab/jig-themes/shade/color-picker';
import { commandStyles } from '@awdlab/jig-themes/shade/command';
import { dialogStyles } from '@awdlab/jig-themes/shade/dialog';
import { drawerStyles } from '@awdlab/jig-themes/shade/drawer';
import { editInplaceStyles } from '@awdlab/jig-themes/shade/edit-inplace';
import { filterStyles } from '@awdlab/jig-themes/shade/filter';
import { hintStyles } from '@awdlab/jig-themes/shade/hint';
import { iconStyles } from '@awdlab/jig-themes/shade/icon';
import { inplaceStyles } from '@awdlab/jig-themes/shade/inplace';
import { inputStyles } from '@awdlab/jig-themes/shade/input';
import { inputFieldStyles } from '@awdlab/jig-themes/shade/input-field';
import { itemViewStyles } from '@awdlab/jig-themes/shade/item-view';
import { kbdStyles } from '@awdlab/jig-themes/shade/kbd';
import { listBoxStyles } from '@awdlab/jig-themes/shade/list-box';
import { maskInputStyles } from '@awdlab/jig-themes/shade/mask-input';
import { menuStyles } from '@awdlab/jig-themes/shade/menu';
import { messageStyles } from '@awdlab/jig-themes/shade/message';
import { meterStyles } from '@awdlab/jig-themes/shade/meter';
import { otpStyles } from '@awdlab/jig-themes/shade/otp';
import { paginatorStyles } from '@awdlab/jig-themes/shade/paginator';
import { popoverStyles } from '@awdlab/jig-themes/shade/popover';
import { progressStyles } from '@awdlab/jig-themes/shade/progress';
import { radioStyles } from '@awdlab/jig-themes/shade/radio';
import { radioGroupStyles } from '@awdlab/jig-themes/shade/radio-group';
import { ratingStyles } from '@awdlab/jig-themes/shade/rating';
import { scrollerStyles } from '@awdlab/jig-themes/shade/scroller';
import { selectStyles } from '@awdlab/jig-themes/shade/select';
import { selectButtonStyles } from '@awdlab/jig-themes/shade/select-button';
import { skeletonStyles } from '@awdlab/jig-themes/shade/skeleton';
import { sliderStyles } from '@awdlab/jig-themes/shade/slider';
import { snackbarStyles } from '@awdlab/jig-themes/shade/snackbar';
import { spinButtonsStyles } from '@awdlab/jig-themes/shade/spin-buttons';
import { spinnerStyles } from '@awdlab/jig-themes/shade/spinner';
import { splitterStyles } from '@awdlab/jig-themes/shade/splitter';
import { stateStyles } from '@awdlab/jig-themes/shade/state';
import { stepperStyles } from '@awdlab/jig-themes/shade/stepper';
import { switchStyles } from '@awdlab/jig-themes/shade/switch';
import { tableStyles } from '@awdlab/jig-themes/shade/table';
import { tabsStyles } from '@awdlab/jig-themes/shade/tabs';
import { tagStyles } from '@awdlab/jig-themes/shade/tag';
import { tagInputStyles } from '@awdlab/jig-themes/shade/tag-input';
import { toastStyles } from '@awdlab/jig-themes/shade/toast';
import { toolbarStyles } from '@awdlab/jig-themes/shade/toolbar';
import { toolbarRegionStyles } from '@awdlab/jig-themes/shade/toolbar-region';
import { toggleButtonStyles } from '@awdlab/jig-themes/shade/toggle-button';
import { tooltipStyles } from '@awdlab/jig-themes/shade/tooltip';
import { treeStyles } from '@awdlab/jig-themes/shade/tree';
import { uploadStyles } from '@awdlab/jig-themes/shade/upload';

import type {} from './theme-types.js';

// Shared button vocabulary — identical to nova (primary | secondary | link | text | icon), so
// themes are kind-compatible and no per-theme kind translation is needed. `primary`, `secondary`
// and `icon` are the kinds the built-in controls hardcode internally (dialog/toast close,
// paginator/calendar nav, input-field clear, filter actions). `destructive` is a color slot, not
// a kind: a destructive button is `kind="primary" color="destructive"`.
export const KINDS = {
  button: ['primary', 'secondary', 'link', 'text', 'icon'] as const,
  message: ['default', 'destructive'] as const,
  tag: ['default', 'secondary', 'outline', 'destructive'] as const,
  inputFieldLabel: ['in', 'on', 'over', 'floatIn', 'floatOn', 'floatOver', 'hidden'] as const,
  hint: ['default', 'info', 'success', 'warning', 'error'] as const,
  state: ['loading', 'cancelled', 'success', 'warning', 'error'] as const,
  splitter: ['default', 'thin', 'invisible'] as const,
};

// Public, user-selectable colors: neutral light (surface), neutral dark (primary), destructive.
// The theme still defines secondary/muted/accent as internal styling tokens (hover states, muted
// text, chip/tag backgrounds) — they are just not offered as `color="…"` options.
export const COLORS = PUBLIC_COLOR_SLOTS;

export const shade = createTheme(
  'Shade',
  [
    accordionStyles,
    accordionPanelStyles,
    animation,
    avatarGroupStyles,
    avatarStyles,
    backdrop,
    badgeStyles,
    breadcrumbStyles,
    buttonStyles,
    buttonGroupStyles,
    calendarStyles,
    checkboxStyles,
    chipStyles,
    colorPickerStyles,
    commandStyles,
    dialogStyles,
    drawerStyles,
    editInplaceStyles,
    filterStyles,
    font,
    hintStyles,
    iconStyles,
    inplaceStyles,
    inputStyles,
    inputFieldStyles,
    maskInputStyles,
    itemViewStyles,
    kbdStyles,
    listBoxStyles,
    menuStyles,
    messageStyles,
    meterStyles,
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
    tagStyles,
    tagInputStyles,
    toastStyles,
    toolbarStyles,
    toolbarRegionStyles,
    toggleButtonStyles,
    tooltipStyles,
    treeStyles,
    uploadStyles,
    zinc,
  ],
  {
    kinds: KINDS,
    colors: COLORS,
  }
);

// Re-export the color-part factory so consumers can theme shade from any base color.
export { createShadeColorPart } from '@awdlab/jig-themes/shade/base';
