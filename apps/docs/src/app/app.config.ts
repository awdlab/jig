import { provideHttpClient } from '@angular/common/http';
import {
  type ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideCheckNoChangesConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideClientHydration, withNoIncrementalHydration } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideNgnControls, withAutoColorScheme } from '@ngneers/controls/api/ng';
import { withDefaultIcons } from '@ngneers/controls/default-icons';
import { withSnackbars } from '@ngneers/controls/snackbar';
import { withToasts } from '@ngneers/controls/toast';

import { routes } from './app.routes';
import { provideDocsThemeInitializer, resolveInitialTheme } from './utils/theme-picker';
import { environment } from '../environment/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
      withViewTransitions()
    ),
    provideClientHydration(withNoIncrementalHydration()),
    provideNgnControls(
      { theme: { preset: resolveInitialTheme() } },
      withToasts(),
      withSnackbars(),
      withDefaultIcons(),
      withAutoColorScheme()
    ),
    provideDocsThemeInitializer(),
    ...[environment.production ? [] : [provideCheckNoChangesConfig({ exhaustive: true })]],
  ],
};
