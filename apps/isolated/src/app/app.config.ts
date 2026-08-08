import {
  type ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideCheckNoChangesConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideNgnControls } from '@ngneers/controls/api/ng';
import { withDefaultIcons } from '@ngneers/controls/default-icons';
import { nova } from '@ngneers/controls-themes/nova';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideNgnControls(
      {
        theme: { preset: nova },
        disableAnimations: true,
      },
      withDefaultIcons()
    ),
    provideRouter([]),
    provideCheckNoChangesConfig({ exhaustive: true }),
  ],
};
