import test, { expect, Page } from '@playwright/test';
import type { InputsType, OutputsType, TemplateType } from 'apps/test-wrapper/src/app/window';

export async function loadComponent(
  page: Page,
  template: TemplateType,
  io?: {
    inputs?: InputsType;
    outputs?: OutputsType;
  }
) {
  return await test.step('Load Component', async () => {
    await page.goto(process.env['CI'] ? 'http://localhost:4200' : 'http://hostmachine:4200');
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

    setTemplate(template);
    if (io?.inputs) {
      setInputs(io.inputs);
    }
    if (io?.outputs) {
      setOutputs(io.outputs);
    }

    return {
      setInputs: (inputs: InputsType) => setInputs(inputs),
      setOutputs: (outputs: OutputsType) => setOutputs(outputs),
      getOutputLog: () => getOutputLog(),
    };
  });
}
