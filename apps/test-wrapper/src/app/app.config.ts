import {
  type ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideCheckNoChangesConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAwdControls } from '@awdlab/jig/api/ng';
import { withDefaultIcons } from '@awdlab/jig/default-icons';
import { withSnackbars } from '@awdlab/jig/snackbar';
import { withToasts } from '@awdlab/jig/toast';
import { nova } from '@awdlab/jig-themes/nova';

import { App } from './app';
import { LeakTestComponent } from './leak-test.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideAwdControls(
      {
        theme: { preset: nova },
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
