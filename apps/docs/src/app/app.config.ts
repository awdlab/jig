import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, TitleStrategy, withInMemoryScrolling } from '@angular/router';
import {
  provideNgDocApp,
  provideSearchEngine,
  NgDocDefaultSearchEngine,
  providePageSkeleton,
  NG_DOC_DEFAULT_PAGE_SKELETON,
  provideMainPageProcessor,
  NG_DOC_DEFAULT_PAGE_PROCESSORS,
} from '@ng-doc/app';
import { provideNgDocContext } from '@ng-doc/generated';
import { provideNgnControls } from '@ngneers/controls/api/ng';
import { novaCoral } from '@ngneers/controls-themes/nova';

import { routes } from './app.routes';
import { CustomTitleStrategy } from './title';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(
      [
        {
          path: '',
          pathMatch: 'full',
          loadComponent: () => import('./start/start').then(m => m.StartPage),
        },
        {
          path: 'docs',
          loadChildren: () => import('./docs/docs'),
        },
      ],
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      })
    ),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    provideNgDocContext(),
    provideNgDocApp(),
    provideSearchEngine(NgDocDefaultSearchEngine),
    providePageSkeleton(NG_DOC_DEFAULT_PAGE_SKELETON),
    provideMainPageProcessor(NG_DOC_DEFAULT_PAGE_PROCESSORS),
    provideNgnControls({ theme: { preset: novaCoral } }),
    { provide: TitleStrategy, useClass: CustomTitleStrategy },
  ],
};
