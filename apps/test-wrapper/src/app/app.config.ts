import {
  type ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideCheckNoChangesConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideNgnControls } from '@ngneers/controls/api/ng';
import { withDefaultIcons } from '@ngneers/controls/default-icons';
import { withSnackbars } from '@ngneers/controls/snackbar';
import { withToasts } from '@ngneers/controls/toast';
import { novaCoral } from '@ngneers/controls-themes/nova';

import { App } from './app';
import { LeakTestComponent } from './leak-test.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideNgnControls(
      {
        theme: { preset: novaCoral },
        disableAnimations: true,
      },
      withToasts(),
      withSnackbars(),
      withDefaultIcons()
    ),
    provideRouter([
      { path: '', pathMatch: 'full', component: App },
      { path: 'leaks', component: LeakTestComponent },
    ]),
    provideCheckNoChangesConfig({ exhaustive: true }),
  ],
};
