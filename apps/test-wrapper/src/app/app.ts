import {
  Component,
  ComponentRef,
  effect,
  inject,
  OnInit,
  signal,
  TemplateRef,
  Type,
  viewChild,
  ViewContainerRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgnTemplate, templateTypeFn } from '@ngneers/controls/api/ng';
import {
  GlobalIconTemplate,
  IconTemplateContext,
} from '@ngneers/controls/icon';

import {
  defineTestComponent,
  TestComponentBase,
} from './define-test-component';
import { isEval, WindowService } from './window';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-root',
  imports: [NgnTemplate],
  template: `
    <ng-template #customIconTemplate [ngnTemplate]="iconTemplateType" let-icon>
      <svg xmlns="http://www.w3.org/2000/svg" style="width: 1em; height: 1em">
        <use [attr.href]="icon.icon + '#root'"></use>
      </svg>
    </ng-template>
  `,
})
export class App implements OnInit {
  private readonly _icon = inject(GlobalIconTemplate);
  protected readonly iconTemplateType =
    templateTypeFn<IconTemplateContext['$implicit']>();

  private readonly _iconTemplate =
    viewChild.required<TemplateRef<IconTemplateContext>>('customIconTemplate');

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

  public ngOnInit() {
    this._icon.setGlobalIconTemplate(this._iconTemplate());
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
