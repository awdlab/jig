import { createTheme } from '@ngneers/controls-themes/api';

import { accordionStyles } from '@ngneers/controls-themes/shade/accordion';
import { accordionPanelStyles } from '@ngneers/controls-themes/shade/accordion-panel';
import {
  movableStyles,
  resizableStyles,
  scrollShadowStyles,
} from '@ngneers/controls-themes/shade/api';
import { avatarGroupStyles, avatarStyles } from '@ngneers/controls-themes/shade/avatar';
import {
  animation,
  font,
  PUBLIC_COLOR_SLOTS,
  shadow,
  sizes,
  zinc,
} from '@ngneers/controls-themes/shade/base';
import { breadcrumbStyles } from '@ngneers/controls-themes/shade/breadcrumb';
import { buttonStyles } from '@ngneers/controls-themes/shade/button';
import { buttonGroupStyles } from '@ngneers/controls-themes/shade/button-group';
import { calendarStyles } from '@ngneers/controls-themes/shade/calendar';
import { checkboxStyles } from '@ngneers/controls-themes/shade/checkbox';
import { chipStyles } from '@ngneers/controls-themes/shade/chip';
import { dialogStyles } from '@ngneers/controls-themes/shade/dialog';
import { drawerStyles } from '@ngneers/controls-themes/shade/drawer';
import { editInplaceStyles } from '@ngneers/controls-themes/shade/edit-inplace';
import { filterStyles } from '@ngneers/controls-themes/shade/filter';
import { hintStyles } from '@ngneers/controls-themes/shade/hint';
import { iconStyles } from '@ngneers/controls-themes/shade/icon';
import { inplaceStyles } from '@ngneers/controls-themes/shade/inplace';
import { inputStyles } from '@ngneers/controls-themes/shade/input';
import { inputFieldStyles } from '@ngneers/controls-themes/shade/input-field';
import { itemViewStyles } from '@ngneers/controls-themes/shade/item-view';
import { listBoxStyles } from '@ngneers/controls-themes/shade/list-box';
import { maskInputStyles } from '@ngneers/controls-themes/shade/mask-input';
import { menuStyles } from '@ngneers/controls-themes/shade/menu';
import { messageStyles } from '@ngneers/controls-themes/shade/message';
import { otpStyles } from '@ngneers/controls-themes/shade/otp';
import { paginatorStyles } from '@ngneers/controls-themes/shade/paginator';
import { popoverStyles } from '@ngneers/controls-themes/shade/popover';
import { progressStyles } from '@ngneers/controls-themes/shade/progress';
import { radioStyles } from '@ngneers/controls-themes/shade/radio';
import { radioGroupStyles } from '@ngneers/controls-themes/shade/radio-group';
import { scrollerStyles } from '@ngneers/controls-themes/shade/scroller';
import { selectStyles } from '@ngneers/controls-themes/shade/select';
import { selectButtonStyles } from '@ngneers/controls-themes/shade/select-button';
import { sliderStyles } from '@ngneers/controls-themes/shade/slider';
import { snackbarStyles } from '@ngneers/controls-themes/shade/snackbar';
import { spinButtonsStyles } from '@ngneers/controls-themes/shade/spin-buttons';
import { spinnerStyles } from '@ngneers/controls-themes/shade/spinner';
import { splitterStyles } from '@ngneers/controls-themes/shade/splitter';
import { stateStyles } from '@ngneers/controls-themes/shade/state';
import { switchStyles } from '@ngneers/controls-themes/shade/switch';
import { tableStyles } from '@ngneers/controls-themes/shade/table';
import { tabsStyles } from '@ngneers/controls-themes/shade/tabs';
import { tagStyles } from '@ngneers/controls-themes/shade/tag';
import { toastStyles } from '@ngneers/controls-themes/shade/toast';
import { toggleButtonStyles } from '@ngneers/controls-themes/shade/toggle-button';
import { tooltipStyles } from '@ngneers/controls-themes/shade/tooltip';
import { treeStyles } from '@ngneers/controls-themes/shade/tree';
import { uploadStyles } from '@ngneers/controls-themes/shade/upload';

import type {} from './theme-types';

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
    breadcrumbStyles,
    buttonStyles,
    buttonGroupStyles,
    calendarStyles,
    checkboxStyles,
    chipStyles,
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
    resizableStyles,
    scrollShadowStyles,
    scrollerStyles,
    selectStyles,
    selectButtonStyles,
    shadow,
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
    zinc,
  ],
  {
    kinds: KINDS,
    colors: COLORS,
  }
);

// Re-export the color-part factory so consumers can theme shade from any base color.
export { createShadeColorPart } from '@ngneers/controls-themes/shade/base';
