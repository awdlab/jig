import '@angular/compiler';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  Type,
} from '@angular/core';

import { IMPORTS } from './imports';
import { type TemplateType, WindowService } from './window';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestComponentBase {
  public readonly inputs = input<any>({});
  private readonly _window = inject(WindowService);

  public output(key: string, value: any) {
    return this._window.handleOutput(key, value);
  }
}

export async function defineTestComponent(
  template: TemplateType,
): Promise<Type<TestComponentBase>> {
  const imports = await Promise.all(
    template.imports.flatMap((x) => {
      const imp = IMPORTS[x];
      if (Array.isArray(imp)) {
        return imp.map((y) => y());
      }
      const result = imp();
      return Array.isArray(result) ? result : [result];
    }),
  );

  @Component({
    template: template.template,
    imports,
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  class TestComponent extends TestComponentBase {}

  return TestComponent;
}
