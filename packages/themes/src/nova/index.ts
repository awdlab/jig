import { createTheme } from '@ngneers/controls-themes/api';
import { coral, font, sizes } from '@ngneers/controls-themes/nova/base';
import { buttonStyles } from '@ngneers/controls-themes/nova/button';
import { calendarStyles } from '@ngneers/controls-themes/nova/calendar';
import { inputFieldStyles } from '@ngneers/controls-themes/nova/input-field';
import { listBoxStyles } from '@ngneers/controls-themes/nova/list-box';
import { popoverStyles } from '@ngneers/controls-themes/nova/popover';
import { selectStyles } from '@ngneers/controls-themes/nova/select';
import { textFieldStyles } from '@ngneers/controls-themes/nova/text-field';

export const novaCoral = createTheme('Nova Coral', [
  coral,
  sizes,
  font,
  buttonStyles,
  listBoxStyles,
  popoverStyles,
  selectStyles,
  inputFieldStyles,
  textFieldStyles,
  calendarStyles,
]);
