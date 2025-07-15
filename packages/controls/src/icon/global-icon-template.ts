import { Injectable, signal, TemplateRef } from '@angular/core';

import { IconTemplateContext } from './types';

export type IconTemplateType = TemplateRef<IconTemplateContext>;

@Injectable({ providedIn: 'root' })
export class GlobalIconTemplate {
  private readonly _globalIconTemplate = signal<IconTemplateType | null>(null);

  public readonly globalIconTemplate = this._globalIconTemplate.asReadonly();

  public setGlobalIconTemplate(template: IconTemplateType) {
    this._globalIconTemplate.set(template);
  }
}
