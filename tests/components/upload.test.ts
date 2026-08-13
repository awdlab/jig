import test, { expect } from '@playwright/test';
import { JigUploadHarness } from '@awdlab/jig-playwright';
import { loadComponent } from '../helper/load-component';
import { useRtl } from '../helper/direction';
import { expectNoA11yViolations } from '../helper/axe';
import { expectScreenshot } from '../helper/screenshot';

function textFile(name: string) {
  return { name, mimeType: 'text/plain', buffer: Buffer.from(`contents of ${name}`) };
}

test('keyboard: native input is the focus stop and Enter opens the picker', async ({ page }) => {
  await loadComponent(page, {
    template: `<jig-upload><input type="file" multiple /></jig-upload>`,
    imports: ['upload'],
  });

  const upload = new JigUploadHarness(page.locator('jig-upload'));
  // The projected native input carries the interactivity/focus — not the zone.
  await expect(upload.input).toHaveAttribute('tabindex', '0');
  expect(await upload.zone.getAttribute('role')).toBeNull();
  expect(await upload.zone.getAttribute('tabindex')).toBeNull();

  await upload.input.focus();
  const [chooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.keyboard.press('Enter'),
  ]);
  await chooser.setFiles([textFile('kb.txt')]);

  await upload.expectItemCount(1);
  await upload.expectItemName(0, 'kb.txt');
});

test('keyboard: drag-only input is not focusable', async ({ page }) => {
  await loadComponent(page, {
    template: `<jig-upload interaction="drag"><input type="file" multiple /></jig-upload>`,
    imports: ['upload'],
  });

  const upload = new JigUploadHarness(page.locator('jig-upload'));
  await expect(upload.input).toHaveAttribute('tabindex', '-1');
});

test('auto: selecting files adds them and marks them uploading', async ({ page }) => {
  await loadComponent(page, {
    template: `<jig-upload><input type="file" multiple /></jig-upload>`,
    imports: ['upload'],
  });

  const upload = new JigUploadHarness(page.locator('jig-upload'));
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
    template: `<jig-upload mode="confirm" confirmTrigger="all"><input type="file" multiple /></jig-upload>`,
    imports: ['upload'],
  });

  const upload = new JigUploadHarness(page.locator('jig-upload'));
  await upload.selectFiles([textFile('report.pdf')]);
  await upload.expectItemState(0, 'pending');

  await upload.uploadAllButton().click();
  await upload.expectItemState(0, 'uploading');
});

test('manual: no trigger is rendered; files stay pending', async ({ page }) => {
  await loadComponent(page, {
    template: `<jig-upload mode="manual"><input type="file" multiple /></jig-upload>`,
    imports: ['upload'],
  });

  const upload = new JigUploadHarness(page.locator('jig-upload'));
  await upload.selectFiles([textFile('report.pdf')]);
  await upload.expectItemState(0, 'pending');
  // No rendered trigger in manual mode — upload only starts from code.
  await expect(upload.uploadAllButton()).toHaveCount(0);
});

test('manual: uploadAll() resolves once files settle, with their final state', async ({ page }) => {
  await loadComponent(page, {
    template: `<jig-upload mode="manual"><input type="file" multiple /></jig-upload>`,
    imports: ['upload'],
  });

  const upload = new JigUploadHarness(page.locator('jig-upload'));
  await upload.selectFiles([textFile('a.txt'), textFile('b.txt')]);
  await upload.expectItemCount(2);

  // Drive the control directly: start the upload, settle each file, await result.
  const states = await page.evaluate(async () => {
    const el = document.querySelector('jig-upload')!;
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

test('uploading: a single dismiss button cancels the upload and removes the item', async ({
  page,
}) => {
  await loadComponent(page, {
    template: `<jig-upload><input type="file" multiple /></jig-upload>`,
    imports: ['upload'],
  });

  const upload = new JigUploadHarness(page.locator('jig-upload'));
  // Auto mode marks the file uploading immediately; the test never settles it.
  await upload.selectFiles([textFile('big.bin')]);
  await upload.expectItemState(0, 'uploading');

  // Exactly one per-item action while uploading (previously cancel + remove).
  await expect(upload.item(0).locator(upload.classes.action)).toHaveCount(1);

  // Dismissing an in-flight item emits cancelUpload AND remove, then drops it.
  await page.evaluate(() => {
    const el = document.querySelector('jig-upload')!;
    const component = (window as any).ng.getComponent(el);
    (window as any).__cancelled = false;
    (window as any).__removed = false;
    component.cancelUpload.subscribe(() => ((window as any).__cancelled = true));
    component.remove.subscribe(() => ((window as any).__removed = true));
  });

  await upload.actionButton(0, 'cancel').click();

  await upload.expectItemCount(0);
  expect(await page.evaluate(() => (window as any).__cancelled)).toBe(true);
  expect(await page.evaluate(() => (window as any).__removed)).toBe(true);
});

test('remove: removing an item drops it from the list', async ({ page }) => {
  await loadComponent(page, {
    template: `<jig-upload mode="manual"><input type="file" multiple /></jig-upload>`,
    imports: ['upload'],
  });

  const upload = new JigUploadHarness(page.locator('jig-upload'));
  // Manual mode keeps items `pending`, so the dismiss action reads as "Remove".
  await upload.selectFiles([textFile('a.txt'), textFile('b.txt')]);
  await upload.expectItemCount(2);

  await upload.actionButton(0, 'Remove').click();

  await upload.expectItemCount(1);
  await upload.expectItemName(0, 'b.txt');
});

test('accessibility (axe)', async ({ page }) => {
  // The projected native input derives its accessible name from the projected
  // placeholder text (wired via aria-labelledby by the control).
  await loadComponent(page, {
    template: `<jig-upload><input type="file" multiple />Drag files here or click to browse</jig-upload>`,
    imports: ['upload'],
  });

  const upload = new JigUploadHarness(page.locator('jig-upload'));
  // Add a pending item so the per-item action buttons are part of the scan.
  await upload.selectFiles([textFile('a.txt')]);
  await upload.expectItemCount(1);

  await expectNoA11yViolations(page);
});

test('visual', async ({ page }, testInfo) => {
  await loadComponent(page, {
    template: `
      <jig-upload class="page-center" style="width: 420px; display: block;">
        <input type="file" multiple />Drag files here or click to browse
      </jig-upload>
    `,
    imports: ['upload'],
  });

  const upload = new JigUploadHarness(page.locator('jig-upload'));
  await expect(upload.zone).toBeVisible();

  await expectScreenshot(page, testInfo, 'dropzone');
});

test('rtl', async ({ page }, testInfo) => {
  await useRtl(page);
  await loadComponent(page, {
    template: `<jig-upload><input type="file" multiple /></jig-upload>`,
    imports: ['upload'],
  });
  await expectScreenshot(page, testInfo);
});
