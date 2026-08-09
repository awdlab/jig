import { provideHttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import {
  type ApplicationConfig,
  inject,
  PLATFORM_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideCheckNoChangesConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideNgnControls, withAutoColorScheme } from '@awdlab/jig/api/ng';
import { withDefaultIcons } from '@awdlab/jig/default-icons';
import { withSnackbars } from '@awdlab/jig/snackbar';
import { withToasts } from '@awdlab/jig/toast';

import { routes } from './app.routes';
import { MdSnapshot } from './utils/md/md-snapshot';
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
      // Skip the transition on the first (hydration) navigation — otherwise the
      // initial load cross-fades as SSR content is re-rendered, causing a flicker.
      withViewTransitions({ skipInitialTransition: true })
    ),
    provideClientHydration(),
    // Snapshot server-rendered markdown before hydration replaces it, so `Md` can
    // restore it synchronously and avoid a blank flash during its async re-render.
    provideAppInitializer(() => {
      if (isPlatformBrowser(inject(PLATFORM_ID))) {
        inject(MdSnapshot).capture();
      }
    }),
    provideNgnControls(
      { theme: { preset: resolveInitialTheme() } },
      withToasts(),
      withSnackbars(),
      withDefaultIcons(),
      withAutoColorScheme()
    ),
    provideDocsThemeInitializer(),
    ...(environment.production ? [] : [provideCheckNoChangesConfig({ exhaustive: true })]),
  ],
};
