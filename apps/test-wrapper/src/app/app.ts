import {
  Component,
  ComponentRef,
  createComponent,
  effect,
  ElementRef,
  EnvironmentInjector,
  inject,
  Injector,
  OutputRefSubscription,
  runInInjectionContext,
  signal,
  Type,
  untracked,
  ViewContainerRef,
} from '@angular/core';
import {
  defineTestComponent,
  TestComponentBase,
} from './define-test-component';
import { WindowService } from './window';

@Component({
  selector: 'app-root',
  template: '',
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
      this.setInputs();
    });
  }

  private setInputs() {
    const component = this._testComponentRef();
    if (!component) {
      return;
    }
    component.setInput('inputs', this._win.inputs());
  }
}
