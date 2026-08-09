import {
  type ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideCheckNoChangesConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAwdControls } from '@awdlab/jig/api/ng';
import { withDefaultIcons } from '@awdlab/jig/default-icons';
import { nova } from '@awdlab/jig-themes/nova';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideAwdControls(
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
