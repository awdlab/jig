import { Injectable, signal, TemplateRef, type OnDestroy } from '@angular/core';

import type { IconTemplateContext } from './types';

export type IconTemplateType = TemplateRef<IconTemplateContext>;

@Injectable({ providedIn: 'root' })
export class GlobalIconTemplate implements OnDestroy {
  private readonly _globalIconTemplate = signal<IconTemplateType | null>(null);

  public readonly globalIconTemplate = this._globalIconTemplate.asReadonly();

  public setGlobalIconTemplate(template: IconTemplateType) {
    this._globalIconTemplate.set(template);
  }

  public ngOnDestroy() {
    this._globalIconTemplate.set(null);
  }
}
