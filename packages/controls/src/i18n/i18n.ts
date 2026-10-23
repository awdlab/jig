import {
  DOCUMENT,
  inject,
  Injectable,
  InjectionToken,
  PendingTasks,
  type Signal,
} from '@angular/core';
import { BaseTranslateService } from '@ngneers/signal-translate';

import { availableLanguageTags, loadLanguage } from './load-language';
import type { SupportedLanguage, Translations } from './types';

export type JigI18nOptions = {
  /**
   * Initial language tag. Omit it to adopt `<html lang>`, pass `null` for the
   * browser language.
   */
  readonly language?: string | null;
  /**
   * Write the active language back to `<html lang>` on every switch.
   *
   * @default false
   */
  readonly syncDocumentLang?: boolean;
};

export const JIG_I18N_OPTIONS = new InjectionToken<JigI18nOptions>('JIG_I18N_OPTIONS');

function initialLanguage(options: JigI18nOptions | null): string | null {
  if (options?.language !== undefined) {
    return options.language;
  }
  return inject(DOCUMENT).documentElement.lang || 'en';
}

@Injectable()
export class I18n extends BaseTranslateService<Translations> {
  private readonly _pendingTasks = inject(PendingTasks);

  protected override readonly setDocumentLangTag: boolean;

  constructor() {
    const options = inject(JIG_I18N_OPTIONS, { optional: true });
    // The live tag list, so tags registered through `customTranslations` are
    // selectable no matter when they land — otherwise the base service falls
    // back to the first built-in language.
    super(availableLanguageTags(), initialLanguage(options));
    this.setDocumentLangTag = options?.syncDocumentLang ?? false;
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
