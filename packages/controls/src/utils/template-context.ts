import { TemplateRef } from '@angular/core';

export class TemplateContext {
  private readonly templates = new Map<unknown, TemplateRef<unknown>>();

  public register(key: unknown, template: TemplateRef<unknown>) {
    this.templates.set(key, template);
  }

  public get(key: unknown) {
    return this.templates.get(key);
  }
}
