import { createTheme } from '@ngneers/controls-themes/api';
import { accordionStyles } from '@ngneers/controls-themes/nova/accordion';
import { avatarGroupStyles, avatarStyles } from '@ngneers/controls-themes/nova/avatar';
import { animation, coral, font, sizes } from '@ngneers/controls-themes/nova/base';
import { buttonStyles } from '@ngneers/controls-themes/nova/button';
import { calendarStyles } from '@ngneers/controls-themes/nova/calendar';
import { checkboxStyles } from '@ngneers/controls-themes/nova/checkbox';
import { inputStyles } from '@ngneers/controls-themes/nova/input';
import { inputFieldStyles } from '@ngneers/controls-themes/nova/input-field';
import { inputMaskStyles } from '@ngneers/controls-themes/nova/input-mask';
import { itemViewStyles } from '@ngneers/controls-themes/nova/item-view';
import { listBoxStyles } from '@ngneers/controls-themes/nova/list-box';
import { popoverStyles } from '@ngneers/controls-themes/nova/popover';
import { scrollerStyles } from '@ngneers/controls-themes/nova/scroller';
import { selectStyles } from '@ngneers/controls-themes/nova/select';
import { splitterStyles } from '@ngneers/controls-themes/nova/splitter';
import { tabsStyles } from '@ngneers/controls-themes/nova/tabs';
import { tooltipStyles } from '@ngneers/controls-themes/nova/tooltip';

export const novaCoral = createTheme('Nova Coral', [
  accordionStyles,
  animation,
  avatarGroupStyles,
  avatarStyles,
  buttonStyles,
  calendarStyles,
  checkboxStyles,
  coral,
  font,
  inputFieldStyles,
  inputMaskStyles,
  inputStyles,
  itemViewStyles,
  listBoxStyles,
  popoverStyles,
  scrollerStyles,
  selectStyles,
  sizes,
  splitterStyles,
  tabsStyles,
  tooltipStyles,
]);
