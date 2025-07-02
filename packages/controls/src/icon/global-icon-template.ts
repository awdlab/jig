import { Injectable, signal, TemplateRef } from '@angular/core';
import { IconType } from '@ngneers/controls/custom-types';

export type IconTemplateData = { $implicit: IconType };
export type IconTemplateType = TemplateRef<IconTemplateData>;

@Injectable({ providedIn: 'root' })
export class GlobalIconTemplate {
  private readonly _globalIconTemplate = signal<IconTemplateType | null>(null);

  public readonly globalIconTemplate = this._globalIconTemplate.asReadonly();

  public setGlobalIconTemplate(template: IconTemplateType) {
    this._globalIconTemplate.set(template);
  }
}
