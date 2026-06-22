import { signal, TemplateRef, type OnDestroy, Service } from '@angular/core';

import type { IconTemplateContext } from './types';

export type IconTemplateType = TemplateRef<IconTemplateContext>;

@Service()
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
