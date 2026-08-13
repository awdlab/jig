import {
  type ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideCheckNoChangesConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideJigControls } from '@awdlab/jig/api/ng';
import { withDefaultIcons } from '@awdlab/jig/default-icons';
import { withSnackbars } from '@awdlab/jig/snackbar';
import { withToasts } from '@awdlab/jig/toast';
import { nova } from '@awdlab/jig-themes/nova';

import { App } from './app';
import { LeakTestComponent } from './leak-test.component';

// Tests run without animations for determinism; `?animations` keeps them for motion assertions.
const animationsEnabled =
  typeof location !== 'undefined' && new URLSearchParams(location.search).has('animations');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideJigControls(
      {
        theme: { preset: nova },
        disableAnimations: !animationsEnabled,
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
