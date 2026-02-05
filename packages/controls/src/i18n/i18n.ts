import { Injectable } from '@angular/core';
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
}
