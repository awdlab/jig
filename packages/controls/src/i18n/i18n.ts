import { inject, Injectable, PendingTasks, type Signal } from '@angular/core';
import { BaseTranslateService } from '@ngneers/signal-translate';

import { customLanguageTags, loadLanguage } from './load-language';
import { type SupportedLanguage, supportedLanguages, type Translations } from './types';

@Injectable()
export class I18n extends BaseTranslateService<Translations> {
  private readonly _pendingTasks = inject(PendingTasks);

  constructor() {
    // Custom tags registered through `customTranslations` count as available,
    // otherwise the base service falls back to the first built-in language.
    super([...supportedLanguages, ...customLanguageTags()], 'en');
  }

  protected loadTranslations(lang: string): Promise<Translations> {
    // Tracked, so SSR waits for the locale instead of serializing raw key paths.
    const done = this._pendingTasks.add();
    return loadLanguage(lang as SupportedLanguage).finally(done);
  }

  public unsafe(key: string): Signal<string> {
    return this.translations._unsafe[key] as unknown as Signal<string>;
  }
}
