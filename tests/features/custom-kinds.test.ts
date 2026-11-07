import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';

test('app-defined kinds', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  const handle = await loadComponent(
    page,
    {
      template: `<button jigButton class="page-center" [kind]="inputs().kind">Hi</button>`,
      imports: ['button'],
    },
    { inputs: { kind: 'fancy' as string | undefined } },
    { search: '?kinds=custom' }
  );

  const button = page.locator('button');

  await test.step('added kind lands and the app styles it', async () => {
    await expect(button).toContainClass('jig-button-kind-fancy');
    await expect(button).toHaveCSS('background-color', 'rgb(255, 0, 255)');
  });

  await test.step('a kind the theme still ships keeps working', async () => {
    await handle.setInputs({ kind: 'link' });
    await expect(button).toContainClass('jig-button-kind-link');
    await expect(button).not.toContainClass('jig-button-kind-fancy');
  });

  await test.step('an unbound kind falls back past the removed default', async () => {
    await handle.setInputs({ kind: undefined });
    await expect(button).toContainClass('jig-button-kind-secondary');
    await expect(button).not.toContainClass('jig-button-kind-primary');
  });

  await test.step('a kind nothing styles still renders a usable button', async () => {
    await handle.setInputs({ kind: 'nocss' });
    await expect(button).toContainClass('jig-button-kind-nocss');
    await button.click();
    await expect(button).toBeVisible();
    expect(consoleErrors).toEqual([]);
  });
});
