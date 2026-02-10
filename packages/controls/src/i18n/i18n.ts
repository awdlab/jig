import { Injectable, type Signal } from '@angular/core';
import { BaseTranslateService } from '@ngneers/signal-translate';

import { loadLanguage } from './load-language';
import { type SupportedLanguage, supportedLanguages, type Translations } from './types';

@Injectable()
export class I18n extends BaseTranslateService<Translations> {
  constructor() {
    super(supportedLanguages, 'en');
  }

  protected loadTranslations(lang: string): Promise<Translations> {
    return loadLanguage(lang as SupportedLanguage);
  }

  public unsafe(key: string): Signal<string> {
    return this.translations._unsafe[key] as Signal<string>;
  }
}
