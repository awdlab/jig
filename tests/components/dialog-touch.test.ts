import test, { expect } from '@playwright/test';

import { JigDialogHarness } from '@awdlab/jig-playwright';

import { expectOutput, loadComponent } from '../helper/load-component';

test.use({ hasTouch: true, isMobile: true });

const MODAL_TEMPLATE = `
  <jig-dialog
    [title]="inputs().title"
    [open]="inputs().open"
    [modal]="true"
    [closeBy]="inputs().closeBy"
    (openChange)="output('open', $event)"
    (closed)="output('closed', true)"
    [size]="{ width: '400px', maxWidth: '90vw' }"
  >
    Content
    <button id="dialog-btn">Focus me</button>
  </jig-dialog>
`;

test('a backdrop tap closes the modal and never reaches the page behind', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <button style="position:fixed;bottom:20px;left:20px;width:200px;height:60px"
                (click)="output('behind', true)">Behind</button>
        ${MODAL_TEMPLATE}
      `,
      imports: ['dialog'],
    },
    { inputs: { title: 'My Dialog', open: true, closeBy: 'any' } }
  );
  const dialog = new JigDialogHarness(page.locator('jig-dialog'));
  await dialog.expectOpened();

  const box = (await page.locator('button', { hasText: 'Behind' }).boundingBox())!;
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);

  await dialog.expectOpened(false);
  await expectOutput(handle, 'open', [false]);
  expect((await handle.getOutputLog())['behind']).toBeUndefined();
});
