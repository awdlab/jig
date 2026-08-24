import { createTheme } from '@awdlab/jig-themes/api';

import { accordionStyles } from '@awdlab/jig-themes/base/accordion';
import { accordionPanelStyles } from '@awdlab/jig-themes/base/accordion-panel';
import { movableStyles, resizableStyles, scrollShadowStyles } from '@awdlab/jig-themes/base/api';
import { avatarGroupStyles, avatarStyles } from '@awdlab/jig-themes/base/avatar';
import { badgeStyles } from '@awdlab/jig-themes/base/badge';
import { breadcrumbStyles } from '@awdlab/jig-themes/base/breadcrumb';
import { buttonStyles } from '@awdlab/jig-themes/base/button';
import { buttonGroupStyles } from '@awdlab/jig-themes/base/button-group';
import { calendarStyles } from '@awdlab/jig-themes/base/calendar';
import { checkboxStyles } from '@awdlab/jig-themes/base/checkbox';
import { chipStyles } from '@awdlab/jig-themes/base/chip';
import { colorPickerStyles } from '@awdlab/jig-themes/base/color-picker';
import { commandStyles } from '@awdlab/jig-themes/base/command';
import { dialogStyles } from '@awdlab/jig-themes/base/dialog';
import { drawerStyles } from '@awdlab/jig-themes/base/drawer';
import { dropdownListStyles } from '@awdlab/jig-themes/base/dropdown-list';
import { editInplaceStyles } from '@awdlab/jig-themes/base/edit-inplace';
import { filterStyles } from '@awdlab/jig-themes/base/filter';
import { globalStyles } from '@awdlab/jig-themes/base/global';
import { hintStyles } from '@awdlab/jig-themes/base/hint';
import { iconStyles } from '@awdlab/jig-themes/base/icon';
import { inplaceStyles } from '@awdlab/jig-themes/base/inplace';
import { inputStyles } from '@awdlab/jig-themes/base/input';
import { inputFieldStyles } from '@awdlab/jig-themes/base/input-field';
import { itemViewStyles } from '@awdlab/jig-themes/base/item-view';
import { kbdStyles } from '@awdlab/jig-themes/base/kbd';
import { listBoxStyles } from '@awdlab/jig-themes/base/list-box';
import { maskInputStyles } from '@awdlab/jig-themes/base/mask-input';
import { menuStyles } from '@awdlab/jig-themes/base/menu';
import { messageStyles } from '@awdlab/jig-themes/base/message';
import { meterStyles } from '@awdlab/jig-themes/base/meter';
import { otpStyles } from '@awdlab/jig-themes/base/otp';
import { paginatorStyles } from '@awdlab/jig-themes/base/paginator';
import { popoverStyles } from '@awdlab/jig-themes/base/popover';
import { progressStyles } from '@awdlab/jig-themes/base/progress';
import { radioStyles } from '@awdlab/jig-themes/base/radio';
import { radioGroupStyles } from '@awdlab/jig-themes/base/radio-group';
import { ratingStyles } from '@awdlab/jig-themes/base/rating';
import { scrollerStyles } from '@awdlab/jig-themes/base/scroller';
import { selectStyles } from '@awdlab/jig-themes/base/select';
import { selectButtonStyles } from '@awdlab/jig-themes/base/select-button';
import { skeletonStyles } from '@awdlab/jig-themes/base/skeleton';
import { sliderStyles } from '@awdlab/jig-themes/base/slider';
import { snackbarStyles } from '@awdlab/jig-themes/base/snackbar';
import { spinButtonsStyles } from '@awdlab/jig-themes/base/spin-buttons';
import { spinnerStyles } from '@awdlab/jig-themes/base/spinner';
import { splitterStyles } from '@awdlab/jig-themes/base/splitter';
import { stateStyles } from '@awdlab/jig-themes/base/state';
import { stepperStyles } from '@awdlab/jig-themes/base/stepper';
import { switchStyles } from '@awdlab/jig-themes/base/switch';
import { tabsStyles } from '@awdlab/jig-themes/base/tabs';
import { tagStyles } from '@awdlab/jig-themes/base/tag';
import { tagInputStyles } from '@awdlab/jig-themes/base/tag-input';
import { toastStyles } from '@awdlab/jig-themes/base/toast';
import { toolbarStyles } from '@awdlab/jig-themes/base/toolbar';
import { toolbarRegionStyles } from '@awdlab/jig-themes/base/toolbar-region';
import { toggleButtonStyles } from '@awdlab/jig-themes/base/toggle-button';
import { tooltipStyles } from '@awdlab/jig-themes/base/tooltip';
import { treeStyles } from '@awdlab/jig-themes/base/tree';
import { uploadStyles } from '@awdlab/jig-themes/base/upload';

import { tableStyles } from './table/index.js';

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
  command: commandStyles,
  dialog: dialogStyles,
  drawer: drawerStyles,
  dropdownList: dropdownListStyles,
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
  kbd: kbdStyles,
  listBox: listBoxStyles,
  menu: menuStyles,
  message: messageStyles,
  meter: meterStyles,
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
  skeleton: skeletonStyles,
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
  tagInput: tagInputStyles,
  toast: toastStyles,
  toolbar: toolbarStyles,
  toolbarRegion: toolbarRegionStyles,
  toggleButton: toggleButtonStyles,
  tooltip: tooltipStyles,
  tree: treeStyles,
  upload: uploadStyles,
};

export const unstyledBase = createTheme('Nova', Object.values(baseStyles));
