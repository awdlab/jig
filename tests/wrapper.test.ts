import test, { expect } from '@playwright/test';
import { loadComponent } from './helper/load-component';

test('Component Test Wrapper Works', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<input ngnInput [invalid]="inputs().invalid" (beforeinput)="output('input', $event.data)" />`,
      imports: ['input'],
    },
    {
      inputs: {
        invalid: false,
      },
      outputs: {
        input: 't => { console.log(t); return !t?.includes("x") }',
      },
    }
  );

  const input = page.locator('input');
  await expect(input).not.toContainClass('ngn-input-invalid');
  await handle.setInputs({ invalid: true });
  // invalidOn='touched' (default) gates the raw invalid flag: it doesn't surface
  // until the input is blurred (touched), so it never flashes on a pristine field.
  await expect(input).not.toContainClass('ngn-input-invalid');
  await input.focus();
  await input.blur();
  await expect(input).toContainClass('ngn-input-invalid');
  await input.pressSequentially('test');
  await expect(input).toHaveValue('test');
  await input.clear();
  await input.pressSequentially('123x45');
  await expect(input).toHaveValue('12345');
  expect(await handle.getOutputLog()).toEqual({
    input: ['t', 'e', 's', 't', null, '1', '2', '3', 'x', '4', '5'],
  });
});
