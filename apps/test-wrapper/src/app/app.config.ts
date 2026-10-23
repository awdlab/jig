import {
  type ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideCheckNoChangesConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { customizeKinds } from '@awdlab/jig/api';
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

// `?kinds=custom` boots the wrapper with an app-customized kind list; without it the config is
// the stock one every other test relies on.
const customKindsEnabled =
  typeof location !== 'undefined' && new URLSearchParams(location.search).get('kinds') === 'custom';

const APP_KINDS = customizeKinds(nova, {
  button: { remove: ['primary'], add: ['fancy'] },
} as const);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideJigControls(
      {
        theme: { preset: nova, kinds: customKindsEnabled ? APP_KINDS : null },
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
