import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgDocThemeService } from '@ng-doc/app/services/theme';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor() {
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      const themeService = inject(NgDocThemeService);
      if (themeService.currentTheme === null) {
        themeService.set('auto');
      }
    }
  }
}
