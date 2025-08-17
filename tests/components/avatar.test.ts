import test, { expect } from '@playwright/test';
import { loadComponent } from '../load-component';

test('base', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<ngn-avatar [initials]="inputs().initials" (click)="output.emit({click: 'test'})" />`,
      imports: ['avatar'],
    },
    {
      inputs: {
        initials: 'CD',
      },
    }
  );

  await expect(page.locator('ngn-avatar')).toHaveText('CD');
  await page.locator('ngn-avatar').click();
  await page.waitForTimeout(1000);
  await handle.setInputs({ initials: 'EF' });
  await expect(page.locator('ngn-avatar')).toHaveText('EF');
  expect(await handle.getOutputLog()).toEqual({ click: ['test'] });
});
