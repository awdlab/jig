import { Injectable, signal, TemplateRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GlobalIconTemplate {
  private readonly _globalIconTemplate = signal<TemplateRef<unknown> | null>(null);

  public readonly globalIconTemplate = this._globalIconTemplate.asReadonly();

  public setGlobalIconTemplate(template: TemplateRef<unknown>) {
    this._globalIconTemplate.set(template);
  }
}
