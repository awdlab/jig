import {
  type ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideCheckNoChangesConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { novaCoral } from '@ngneers/controls-themes/nova';

import { provideNgnControls } from '@ngneers/controls/api/ng';
import { provideNgnDefaultIcons } from '@ngneers/controls/default-icons';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideNgnControls({
      theme: { preset: novaCoral },
      disableAnimations: true,
    }),
    provideNgnDefaultIcons(),
    provideRouter([]),
    provideCheckNoChangesConfig({ exhaustive: true }),
  ],
};
