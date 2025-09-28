import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { novaCoral } from '@ngneers/controls-themes/nova';

import { provideNgnControls } from '@ngneers/controls/api/ng';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideNgnControls({ theme: { preset: novaCoral } }),
    provideRouter([]),
  ],
};
