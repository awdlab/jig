import { createTheme } from '@ngneers/controls-themes/api';
import { coral, sizes } from '@ngneers/controls-themes/nova/base';
import { buttonStyles } from '@ngneers/controls-themes/nova/button';
import { inputFieldStyles } from '@ngneers/controls-themes/nova/input-field';
import { listBoxStyles } from '@ngneers/controls-themes/nova/list-box';
import { popoverStyles } from '@ngneers/controls-themes/nova/popover';
import { selectStyles } from '@ngneers/controls-themes/nova/select';

export const novaCoral = createTheme('Nova Coral', [
  coral,
  sizes,
  buttonStyles,
  listBoxStyles,
  popoverStyles,
  selectStyles,
  inputFieldStyles,
]);
