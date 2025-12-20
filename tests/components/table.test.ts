import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';

test.skip('base', async ({ page }) => {
  await loadComponent(page, {
    template: `<ngn-table>
      <thead>
        <tr>
          <th>Header</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Cell</td>
        </tr>
      </tbody>
    </ngn-table>`,
    imports: ['table'],
  });

  // await expect(page.locator('ngn-table')).toBeVisible();
  // await expect(page.locator('ngn-table th')).toHaveText('Header');
  // await expect(page.locator('ngn-table td')).toHaveText('Cell');
});
