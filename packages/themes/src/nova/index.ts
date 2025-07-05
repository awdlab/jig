import { createTheme } from '@ngneers/controls-themes/api';
import { coral } from '@ngneers/controls-themes/nova/base';
import { buttonStyles } from '@ngneers/controls-themes/nova/button';
import { listBoxStyles } from '@ngneers/controls-themes/nova/list-box';

export const novaCoral = createTheme('Nova Coral', [coral, buttonStyles, listBoxStyles]);
