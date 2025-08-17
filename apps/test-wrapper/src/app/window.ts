import { Injectable, signal } from '@angular/core';
import { IMPORTS } from './imports';

export type InputsType = {
  [key: string]: any;
};

export type OutputsType = {
  [key: string]: (val: any) => void;
};

export type TemplateType = {
  template: string;
  imports: (keyof typeof IMPORTS)[];
};

@Injectable({ providedIn: 'root' })
export class WindowService {
  public readonly template = signal<TemplateType | null>(null);
  public readonly inputs = signal<InputsType>({});
  public readonly outputs = signal<OutputsType>({});

  constructor() {
    (window as any).__ngn_test_wrapper = {
      template: (val: TemplateType) => {
        console.log('Setting template', val);
        this.template.set(val);
      },
      inputs: (val: InputsType) => {
        console.log('Setting inputs', val);
        this.inputs.update((i) => ({ ...i, ...val }));
      },
      outputs: (val: OutputsType) => {
        console.log('Setting outputs', val);
        this.outputs.update((o) => ({ ...o, ...val }));
      },
      outputLog: {},
    };
    document.body.setAttribute('data-ngn-test-wrapper', 'initialized');
  }

  public logOutput(key: string, value: any) {
    (window as any).__ngn_test_wrapper.outputLog[key] ??= [];
    (window as any).__ngn_test_wrapper.outputLog[key].push(value);
  }
}
