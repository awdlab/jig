import { createTheme } from '@ngneers/controls-themes/api';
import { avatarGroupStyles, avatarStyles } from '@ngneers/controls-themes/nova/avatar';
import { coral, font, sizes } from '@ngneers/controls-themes/nova/base';
import { buttonStyles } from '@ngneers/controls-themes/nova/button';
import { calendarStyles } from '@ngneers/controls-themes/nova/calendar';
import { checkboxStyles } from '@ngneers/controls-themes/nova/checkbox';
import { inputStyles } from '@ngneers/controls-themes/nova/input';
import { inputFieldStyles } from '@ngneers/controls-themes/nova/input-field';
import { inputMaskStyles } from '@ngneers/controls-themes/nova/input-mask';
import { listBoxStyles } from '@ngneers/controls-themes/nova/list-box';
import { popoverStyles } from '@ngneers/controls-themes/nova/popover';
import { scrollerStyles } from '@ngneers/controls-themes/nova/scroller';
import { selectStyles } from '@ngneers/controls-themes/nova/select';
import { splitterStyles } from '@ngneers/controls-themes/nova/splitter';

export const novaCoral = createTheme('Nova Coral', [
  coral,
  sizes,
  font,
  avatarStyles,
  avatarGroupStyles,
  buttonStyles,
  listBoxStyles,
  popoverStyles,
  selectStyles,
  inputFieldStyles,
  inputStyles,
  inputMaskStyles,
  calendarStyles,
  scrollerStyles,
  splitterStyles,
  checkboxStyles,
]);
