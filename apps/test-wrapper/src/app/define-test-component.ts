import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
  Type,
} from '@angular/core';
import '@angular/compiler';
import { TemplateType, WindowService } from './window';
import { IMPORTS } from './imports';

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
  const imports = await Promise.all(template.imports.map((x) => IMPORTS[x]()));
  @Component({
    template: template.template,
    imports,
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  class TestComponent extends TestComponentBase {}

  return TestComponent;
}
