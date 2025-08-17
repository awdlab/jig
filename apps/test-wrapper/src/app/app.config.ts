import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { novaCoral } from '@ngneers/controls-themes/nova';

import { provideNgnControls } from '@ngneers/controls/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideNgnControls({ theme: { preset: novaCoral } }),
  ],
};
