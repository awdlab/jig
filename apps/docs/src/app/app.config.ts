import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  type ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideCheckNoChangesConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideNgnControls } from '@ngneers/controls/api/ng';
import { withDefaultIcons } from '@ngneers/controls/default-icons';
import { withToasts } from '@ngneers/controls/toast';
import { novaCoral } from '@ngneers/controls-themes/nova';

import { routes } from './app.routes';
import { environment } from '../environment/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withFetch()),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
      withViewTransitions()
    ),
    provideClientHydration(),
    provideNgnControls({ theme: { preset: novaCoral } }, withToasts(), withDefaultIcons()),
    ...[environment.production ? [] : [provideCheckNoChangesConfig({ exhaustive: true })]],
  ],
};
