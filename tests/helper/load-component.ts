import test, { expect, type Page } from '@playwright/test';
import {
  evalKey,
  type InputsType,
  type OutputsType,
  type TemplateType,
} from '../../apps/test-wrapper/src/app/window.js';

type Handle = {
  setInputs: (inputs: InputsType) => Promise<void>;
  setOutputs: (outputs: OutputsType) => Promise<void>;
  getOutputLog: () => Promise<Record<string, any[]>>;
};

export function evalValue(code: string): { [evalKey]: string } {
  return {
    [evalKey]: code,
  };
}

export async function loadComponent(
  page: Page,
  template: TemplateType,
  io?: {
    inputs?: InputsType;
    outputs?: OutputsType;
  }
) {
  return await test.step('Load Component', async () => {
    await page.goto(process.env['CI'] ? 'http://localhost:4222' : 'http://hostmachine:4222');
    await expect(page.locator('body')).toHaveAttribute('data-ngn-test-wrapper');

    async function setTemplate(template: TemplateType) {
      await page.evaluate(
        ([param]) => {
          const t = (window as any).__ngn_test_wrapper.template as (val: TemplateType) => void;
          t(param);
        },
        [template]
      );
    }

    async function setInputs(inputs: InputsType) {
      await test.step('Set inputs', async () => {
        await page.evaluate(
          ([param]) => {
            const i = (window as any).__ngn_test_wrapper.inputs as (val: InputsType) => void;
            i(param);
          },
          [inputs]
        );
      });
    }

    async function setOutputs(outputs: OutputsType) {
      await test.step('Set outputs', async () => {
        await page.evaluate(
          ([param]) => {
            const o = (window as any).__ngn_test_wrapper.outputs as (val: OutputsType) => void;
            o(param);
          },
          [outputs]
        );
      });
    }

    async function getOutputLog() {
      return await test.step('Get output log', async () => {
        return await page.evaluate(() => {
          const o = (window as any).__ngn_test_wrapper.outputLog as Record<string, any[]>;
          return o;
        });
      });
    }

    async function getOutputLogAndClear() {
      return await test.step('Get and clear output log', async () => {
        return await page.evaluate(() => {
          const o = (window as any).__ngn_test_wrapper.outputLog as Record<string, any[]>;
          (window as any).__ngn_test_wrapper.outputLog = {};
          return o;
        });
      });
    }

    const promises: Promise<unknown>[] = [];
    promises.push(setTemplate(template));
    if (io?.inputs) {
      promises.push(setInputs(io.inputs));
    }
    if (io?.outputs) {
      promises.push(setOutputs(io.outputs));
    }

    await Promise.all(promises);

    // The wrapper imports the control chunk and JIT-compiles the template before it can create
    // the component; on a cold, loaded CI run that outlasts a per-assertion timeout.
    await expect
      .poll(() => page.evaluate(() => (window as any).__ngn_test_wrapper.ready), {
        timeout: 30000,
      })
      .toBe(true);

    return {
      setInputs: (inputs: InputsType) => setInputs(inputs),
      setOutputs: (outputs: OutputsType) => setOutputs(outputs),
      getOutputLog: () => getOutputLog(),
      getOutputLogAndClear: () => getOutputLogAndClear(),
    };
  });
}

export async function expectOutput(handle: Handle, key: string, value: any) {
  await expect(async () => {
    expect((await handle.getOutputLog())[key]).toEqual(value);
  }).toPass();
}
