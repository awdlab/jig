import { NgnListBoxHarness } from '@ngneers/controls-playwright';
import test from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { exampleData } from '../helper/data';

test('base', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <ngn-list-box style="width: 200px; height: 400px; display: block;" [items]="inputs().items" />
    `,
      imports: ['listBox'],
    },
    {
      inputs: {
        items: exampleData.items.flatPreformatted,
      },
    }
  );

  const listbox = new NgnListBoxHarness(page.locator('ngn-list-box').first());
  await listbox.expectItemsCount(exampleData.items.flatPreformatted.length);
});
