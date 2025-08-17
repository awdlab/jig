import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  output,
  signal,
  Type,
} from '@angular/core';
import '@angular/compiler';
import { TemplateType } from './window';
import { IMPORTS } from './imports';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestComponentBase {
  public readonly output = output<Record<string, any>>();
  public readonly inputs = input<any>({});
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
