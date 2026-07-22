import { createTheme } from '@ngneers/controls-themes/api';

import { accordionStyles } from '@ngneers/controls-themes/base/accordion';
import { accordionPanelStyles } from '@ngneers/controls-themes/base/accordion-panel';
import {
  movableStyles,
  resizableStyles,
  scrollShadowStyles,
} from '@ngneers/controls-themes/base/api';
import { avatarGroupStyles, avatarStyles } from '@ngneers/controls-themes/base/avatar';
import { badgeStyles } from '@ngneers/controls-themes/base/badge';
import { breadcrumbStyles } from '@ngneers/controls-themes/base/breadcrumb';
import { buttonStyles } from '@ngneers/controls-themes/base/button';
import { buttonGroupStyles } from '@ngneers/controls-themes/base/button-group';
import { calendarStyles } from '@ngneers/controls-themes/base/calendar';
import { checkboxStyles } from '@ngneers/controls-themes/base/checkbox';
import { chipStyles } from '@ngneers/controls-themes/base/chip';
import { colorPickerStyles } from '@ngneers/controls-themes/base/color-picker';
import { dialogStyles } from '@ngneers/controls-themes/base/dialog';
import { drawerStyles } from '@ngneers/controls-themes/base/drawer';
import { editInplaceStyles } from '@ngneers/controls-themes/base/edit-inplace';
import { filterStyles } from '@ngneers/controls-themes/base/filter';
import { globalStyles } from '@ngneers/controls-themes/base/global';
import { hintStyles } from '@ngneers/controls-themes/base/hint';
import { iconStyles } from '@ngneers/controls-themes/base/icon';
import { inplaceStyles } from '@ngneers/controls-themes/base/inplace';
import { inputStyles } from '@ngneers/controls-themes/base/input';
import { inputFieldStyles } from '@ngneers/controls-themes/base/input-field';
import { itemViewStyles } from '@ngneers/controls-themes/base/item-view';
import { listBoxStyles } from '@ngneers/controls-themes/base/list-box';
import { maskInputStyles } from '@ngneers/controls-themes/base/mask-input';
import { menuStyles } from '@ngneers/controls-themes/base/menu';
import { messageStyles } from '@ngneers/controls-themes/base/message';
import { otpStyles } from '@ngneers/controls-themes/base/otp';
import { paginatorStyles } from '@ngneers/controls-themes/base/paginator';
import { popoverStyles } from '@ngneers/controls-themes/base/popover';
import { progressStyles } from '@ngneers/controls-themes/base/progress';
import { radioStyles } from '@ngneers/controls-themes/base/radio';
import { radioGroupStyles } from '@ngneers/controls-themes/base/radio-group';
import { ratingStyles } from '@ngneers/controls-themes/base/rating';
import { scrollerStyles } from '@ngneers/controls-themes/base/scroller';
import { selectStyles } from '@ngneers/controls-themes/base/select';
import { selectButtonStyles } from '@ngneers/controls-themes/base/select-button';
import { sliderStyles } from '@ngneers/controls-themes/base/slider';
import { snackbarStyles } from '@ngneers/controls-themes/base/snackbar';
import { spinButtonsStyles } from '@ngneers/controls-themes/base/spin-buttons';
import { spinnerStyles } from '@ngneers/controls-themes/base/spinner';
import { splitterStyles } from '@ngneers/controls-themes/base/splitter';
import { stateStyles } from '@ngneers/controls-themes/base/state';
import { stepperStyles } from '@ngneers/controls-themes/base/stepper';
import { switchStyles } from '@ngneers/controls-themes/base/switch';
import { tabsStyles } from '@ngneers/controls-themes/base/tabs';
import { tagStyles } from '@ngneers/controls-themes/base/tag';
import { toastStyles } from '@ngneers/controls-themes/base/toast';
import { toggleButtonStyles } from '@ngneers/controls-themes/base/toggle-button';
import { tooltipStyles } from '@ngneers/controls-themes/base/tooltip';
import { treeStyles } from '@ngneers/controls-themes/base/tree';
import { uploadStyles } from '@ngneers/controls-themes/base/upload';

import { tableStyles } from './table';

export const baseStyles = {
  accordion: accordionStyles,
  accordionPanel: accordionPanelStyles,
  movable: movableStyles,
  resizable: resizableStyles,
  scrollShadow: scrollShadowStyles,
  avatarGroup: avatarGroupStyles,
  avatar: avatarStyles,
  badge: badgeStyles,
  breadcrumb: breadcrumbStyles,
  button: buttonStyles,
  buttonGroup: buttonGroupStyles,
  calendar: calendarStyles,
  checkbox: checkboxStyles,
  chip: chipStyles,
  'color-picker': colorPickerStyles,
  dialog: dialogStyles,
  drawer: drawerStyles,
  filter: filterStyles,
  editInplace: editInplaceStyles,
  global: globalStyles,
  hint: hintStyles,
  icon: iconStyles,
  inplace: inplaceStyles,
  input: inputStyles,
  inputField: inputFieldStyles,
  maskInput: maskInputStyles,
  itemView: itemViewStyles,
  listBox: listBoxStyles,
  menu: menuStyles,
  message: messageStyles,
  otp: otpStyles,
  paginator: paginatorStyles,
  popover: popoverStyles,
  progress: progressStyles,
  radioGroup: radioGroupStyles,
  radio: radioStyles,
  rating: ratingStyles,
  scroller: scrollerStyles,
  select: selectStyles,
  selectButton: selectButtonStyles,
  slider: sliderStyles,
  snackbar: snackbarStyles,
  spinButtons: spinButtonsStyles,
  spinner: spinnerStyles,
  splitter: splitterStyles,
  state: stateStyles,
  stepper: stepperStyles,
  switch: switchStyles,
  table: tableStyles,
  tabs: tabsStyles,
  tag: tagStyles,
  toast: toastStyles,
  toggleButton: toggleButtonStyles,
  tooltip: tooltipStyles,
  tree: treeStyles,
  upload: uploadStyles,
};

export const unstyledBase = createTheme('Nova Coral', Object.values(baseStyles));
