import {
  Component,
  ComponentRef,
  effect,
  inject,
  signal,
  Type,
  untracked,
  ViewContainerRef,
  ChangeDetectionStrategy,
} from '@angular/core';

import { defineTestComponent, TestComponentBase } from './define-test-component';
import { isEval, WindowService } from './window';

@Component({
  selector: 'ngn-root',
  imports: [],
  template: ``,
})
export class App {
  private readonly _testComponent = signal<Type<TestComponentBase> | null>(null);
  private readonly _testComponentRef = signal<ComponentRef<TestComponentBase> | null>(null);
  private readonly _win = inject(WindowService);

  constructor() {
    const viewContainerRef = inject(ViewContainerRef);

    effect(() => {
      const template = this._win.template();
      if (!template) {
        return;
      }
      void defineTestComponent(template).then(component => {
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
      // Apply inputs synchronously, before Angular's first change detection
      // renders the component. Otherwise the control becomes visible in the
      // DOM with default (empty) inputs, and the real inputs land a tick later
      // — racing any test interaction that happens in between (e.g. a fill()
      // that then gets clobbered by the late value). Read untracked so this
      // create effect does not re-run (and recreate the component) whenever the
      // inputs signal changes; the effect below handles later updates.
      untracked(() => this.setInputs(component));
      this._testComponentRef.set(component);
      (window as any).__ngn_test_wrapper.ready = true;
    });
    effect(() => {
      this.setInputs();
    });
  }

  private setInputs(componentRef?: ComponentRef<TestComponentBase>) {
    const component = componentRef ?? this._testComponentRef();
    if (!component) {
      return;
    }
    const inputs = this._win.inputs();

    function getMappedVal(val: any): any {
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        const keys = Object.keys(val);
        if (keys.length === 1 && isEval(keys[0])) {
          console.log('Converting eval input', val[keys[0]]);
          // Intentional: the test harness evaluates test-supplied input expressions.
          // eslint-disable-next-line no-eval
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
      {} as Record<string, any>
    );
    component.setInput('inputs', mappedInputs);
  }
}
