import {
  Component,
  ComponentRef,
  effect,
  inject,
  signal,
  Type,
  ViewContainerRef,
  ChangeDetectionStrategy,
} from '@angular/core';

import {
  defineTestComponent,
  TestComponentBase,
} from './define-test-component';
import { isEval, WindowService } from './window';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-root',
  imports: [],
  template: ``,
})
export class App {
  private readonly _testComponent = signal<Type<TestComponentBase> | null>(
    null,
  );
  private readonly _testComponentRef =
    signal<ComponentRef<TestComponentBase> | null>(null);
  private readonly _win = inject(WindowService);

  constructor() {
    const viewContainerRef = inject(ViewContainerRef);

    effect(() => {
      const template = this._win.template();
      if (!template) {
        return;
      }
      defineTestComponent(template).then((component) => {
        this._testComponent.set(component);
      });
    });
    effect(() => {
      const com = this._testComponent();
      viewContainerRef.clear();
      if (!com) {
        return;
      }
      const component = viewContainerRef.createComponent(com);
      this._testComponentRef.set(component);
    });
    effect(() => {
      this.setInputs();
    });
  }

  private setInputs() {
    const component = this._testComponentRef();
    if (!component) {
      return;
    }
    const inputs = this._win.inputs();

    function getMappedVal(val: any): any {
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        const keys = Object.keys(val);
        if (keys.length === 1 && isEval(keys[0])) {
          console.log('Converting eval input', val[keys[0]]);
          // eval case
          return eval(val[keys[0]]);
        }
      }
      return val;
    }

    const mappedInputs = Object.entries(inputs).reduce(
      (acc, [key, val]) => {
        return {
          ...acc,
          [key]: getMappedVal(val),
        };
      },
      {} as Record<string, any>,
    );
    component.setInput('inputs', mappedInputs);
  }
}
