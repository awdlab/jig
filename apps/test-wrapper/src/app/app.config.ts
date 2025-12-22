import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideCheckNoChangesConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideNgnControls } from '@ngneers/controls/api/ng';
import { novaCoral } from '@ngneers/controls-themes/nova';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideNgnControls({
      theme: { preset: novaCoral },
      disableAnimations: true,
    }),
    provideRouter([]),
    provideCheckNoChangesConfig({ exhaustive: true }),
  ],
};
