import test, { expect } from '@playwright/test';
import { NgnUploadHarness } from '@ngneers/controls-playwright';
import { loadComponent } from '../helper/load-component';

function textFile(name: string) {
  return { name, mimeType: 'text/plain', buffer: Buffer.from(`contents of ${name}`) };
}

test('keyboard: zone is a focusable button and Enter opens the picker', async ({ page }) => {
  await loadComponent(page, {
    template: `<ngn-upload><input type="file" multiple /></ngn-upload>`,
    imports: ['upload'],
  });

  const upload = new NgnUploadHarness(page.locator('ngn-upload'));
  await expect(upload.zone).toHaveAttribute('role', 'button');
  await expect(upload.zone).toHaveAttribute('tabindex', '0');

  await upload.zone.focus();
  const [chooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.keyboard.press('Enter'),
  ]);
  await chooser.setFiles([textFile('kb.txt')]);

  await upload.expectItemCount(1);
  await upload.expectItemName(0, 'kb.txt');
});

test('keyboard: drag-only zone is not focusable', async ({ page }) => {
  await loadComponent(page, {
    template: `<ngn-upload interaction="drag"><input type="file" multiple /></ngn-upload>`,
    imports: ['upload'],
  });

  const upload = new NgnUploadHarness(page.locator('ngn-upload'));
  expect(await upload.zone.getAttribute('role')).toBeNull();
  expect(await upload.zone.getAttribute('tabindex')).toBeNull();
});

test('auto: selecting files adds them and marks them uploading', async ({ page }) => {
  await loadComponent(page, {
    template: `<ngn-upload><input type="file" multiple /></ngn-upload>`,
    imports: ['upload'],
  });

  const upload = new NgnUploadHarness(page.locator('ngn-upload'));
  await upload.expectItemCount(0);

  await upload.selectFiles([textFile('a.txt'), textFile('b.txt')]);

  await upload.expectItemCount(2);
  await upload.expectItemName(0, 'a.txt');
  await upload.expectItemName(1, 'b.txt');
  // In auto mode the control emits immediately and marks the files uploading.
  await upload.expectItemState(0, 'uploading');
});

test('confirm: files queue as pending until the upload button is pressed', async ({ page }) => {
  await loadComponent(page, {
    template: `<ngn-upload mode="confirm" confirmTrigger="all"><input type="file" multiple /></ngn-upload>`,
    imports: ['upload'],
  });

  const upload = new NgnUploadHarness(page.locator('ngn-upload'));
  await upload.selectFiles([textFile('report.pdf')]);
  await upload.expectItemState(0, 'pending');

  await upload.uploadAllButton().click();
  await upload.expectItemState(0, 'uploading');
});

test('manual: no trigger is rendered; files stay pending', async ({ page }) => {
  await loadComponent(page, {
    template: `<ngn-upload mode="manual"><input type="file" multiple /></ngn-upload>`,
    imports: ['upload'],
  });

  const upload = new NgnUploadHarness(page.locator('ngn-upload'));
  await upload.selectFiles([textFile('report.pdf')]);
  await upload.expectItemState(0, 'pending');
  // No rendered trigger in manual mode — upload only starts from code.
  await expect(upload.uploadAllButton()).toHaveCount(0);
});

test('manual: uploadAll() resolves once files settle, with their final state', async ({ page }) => {
  await loadComponent(page, {
    template: `<ngn-upload mode="manual"><input type="file" multiple /></ngn-upload>`,
    imports: ['upload'],
  });

  const upload = new NgnUploadHarness(page.locator('ngn-upload'));
  await upload.selectFiles([textFile('a.txt'), textFile('b.txt')]);
  await upload.expectItemCount(2);

  // Drive the control directly: start the upload, settle each file, await result.
  const states = await page.evaluate(async () => {
    const el = document.querySelector('ngn-upload')!;
    const component = (window as any).ng.getComponent(el);
    const promise = component.uploadAll();
    const files = component.files();
    component.markDone(files[0].id);
    component.markFailed(files[1].id, 'boom');
    const result = await promise;
    return result.map((f: { state: string }) => f.state);
  });

  expect([...states].sort()).toEqual(['done', 'failed']);
});

test('remove: removing an item drops it from the list', async ({ page }) => {
  await loadComponent(page, {
    template: `<ngn-upload><input type="file" multiple /></ngn-upload>`,
    imports: ['upload'],
  });

  const upload = new NgnUploadHarness(page.locator('ngn-upload'));
  await upload.selectFiles([textFile('a.txt'), textFile('b.txt')]);
  await upload.expectItemCount(2);

  await upload.actionButton(0, 'Remove').click();

  await upload.expectItemCount(1);
  await upload.expectItemName(0, 'b.txt');
});
