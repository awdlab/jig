import { Service, signal } from '@angular/core';

import { IMPORTS } from './imports';

export const evalKey = '__is_eval__';

export function isEval(key: unknown): key is typeof evalKey {
  return key === evalKey;
}

export type InputsType = {
  [key: string]: any;
};

/**
 * Key value pair, where an output with `key` evals a javascript (passed as string)
 */
export type OutputsType = {
  [key: string]: string;
};

export type TemplateType = {
  template: string;
  imports: (keyof typeof IMPORTS)[];
};

@Service()
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
        this.inputs.update(i => ({ ...i, ...val }));
      },
      outputs: (val: OutputsType) => {
        console.log('Setting outputs', val);
        this.outputs.update(o => ({ ...o, ...val }));
      },
      outputLog: {},
      // Flipped once the test component is created; the harness waits on it so a cold
      // chunk import + JIT compile does not eat into per-assertion timeouts.
      ready: false,
    };
    document.body.setAttribute('data-jig-test-wrapper', 'initialized');
  }

  public handleOutput(key: string, value: any) {
    const triggeredOutput = this.outputs()?.[key];
    this.logOutput(key, value);
    if (triggeredOutput) {
      try {
        const fn = window.eval(triggeredOutput);
        return fn(value);
      } catch (err) {
        console.error('Error evaluating output:', triggeredOutput, value, err);
      }
    }
  }

  public logOutput(key: string, value: any) {
    (window as any).__ngn_test_wrapper.outputLog[key] ??= [];
    (window as any).__ngn_test_wrapper.outputLog[key].push(value);
  }
}
