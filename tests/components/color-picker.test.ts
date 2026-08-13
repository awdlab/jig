import test, { expect } from '@playwright/test';
import { JigColorPickerHarness } from '@awdlab/jig-playwright';
import { parseColor } from '@awdlab/jig/utils';
import { loadComponent } from '../helper/load-component';
import { useRtl } from '../helper/direction';
import { expectScreenshot } from '../helper/screenshot';
import { expectNoA11yViolations } from '../helper/axe';

test('inline: reflects bound value', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    {
      template: `<jig-color-picker [inline]="true" [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['color-picker'],
    },
    { inputs: { value: '#ff0000' } }
  );

  const cp = new JigColorPickerHarness(page.locator('jig-color-picker'));
  await expect(cp.panel).toBeVisible();
  await expectScreenshot(page, testInfo, 'inline-red');
});

test('clicking hue + sv updates value', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-color-picker [inline]="true" [alpha]="false" [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['color-picker'],
    },
    { inputs: { value: '#ff0000' } }
  );

  const cp = new JigColorPickerHarness(page.locator('jig-color-picker'));
  await cp.clickSv(1, 0); // full saturation, full value
  await cp.clickHue(0.33); // ~green

  const log = await handle.getOutputLog();
  const values = log['value'] as string[];
  expect(values.length).toBeGreaterThan(0);
  const last = values[values.length - 1]!;
  // last emitted value should be a valid hex
  expect(last).toMatch(/^#[0-9a-f]{6}$/i);
  // hue axis should land near green (~120deg), not be inverted
  const rgba = parseColor(last)!;
  expect(rgba.g).toBeGreaterThan(rgba.r);
  expect(rgba.g).toBeGreaterThan(rgba.b);
});

test('swatch selection sets value', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-color-picker [inline]="true" [alpha]="false" [swatches]="inputs().swatches" (valueChange)="output('value', $event)" />`,
      imports: ['color-picker'],
    },
    { inputs: { swatches: ['#123456', '#abcdef'] } }
  );

  const cp = new JigColorPickerHarness(page.locator('jig-color-picker'));
  await cp.swatches.nth(0).click();
  const log = await handle.getOutputLog();
  expect((log['value'] as string[]).at(-1)?.toLowerCase()).toBe('#123456');
});

test('trigger opens panel (non-inline)', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    {
      template: `<jig-color-picker [value]="'#00ff00'" />`,
      imports: ['color-picker'],
    },
    { inputs: {} }
  );
  const cp = new JigColorPickerHarness(page.locator('jig-color-picker'));
  await expect(cp.panel).toHaveCount(0);
  await expect(cp.trigger).toHaveAttribute('aria-expanded', 'false');
  await expectScreenshot(page, testInfo, 'trigger-closed');
  await cp.open();
  await expect(cp.trigger).toHaveAttribute('aria-expanded', 'true');
  await expectScreenshot(page, testInfo, 'trigger-open');
});

test('format toggle cycles hex -> rgb -> hsl', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<jig-color-picker [inline]="true" [value]="'#3366cc'" />`,
      imports: ['color-picker'],
    },
    { inputs: {} }
  );
  const cp = new JigColorPickerHarness(page.locator('jig-color-picker'));
  const labels = page.locator('jig-color-picker [class*="channel-label"]');
  const boxes = page.locator('jig-color-picker [class*="channel"] input');

  // hex: a single box + "Hex" label
  await expect(cp.formatToggle).toHaveText('hex');
  await expect(labels).toHaveText(['Hex']);
  await expect(boxes).toHaveValue('#3366cc');

  // rgb: R/G/B(/A) boxes with the channel values of #3366cc = rgb(51,102,204)
  await cp.formatToggle.click();
  await expect(cp.formatToggle).toHaveText('rgb');
  await expect(labels).toHaveText(['R', 'G', 'B', 'A']);
  await expect(boxes.nth(0)).toHaveValue('51');
  await expect(boxes.nth(1)).toHaveValue('102');
  await expect(boxes.nth(2)).toHaveValue('204');
  await expect(boxes.nth(3)).toHaveValue('100');

  // hsl: H/S/L(/A) boxes
  await cp.formatToggle.click();
  await expect(cp.formatToggle).toHaveText('hsl');
  await expect(labels).toHaveText(['H', 'S', 'L', 'A']);

  // back to hex
  await cp.formatToggle.click();
  await expect(cp.formatToggle).toHaveText('hex');
  await expect(labels).toHaveText(['Hex']);
  await expect(boxes).toHaveValue('#3366cc');
});

test('headless mode: opens in a popover from an external anchor', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `
        <button #anchor (click)="picker.toggle()">Pick color</button>
        <jig-color-picker #picker [popover]="true" [anchor]="anchor" [value]="'#ff0000'" />
      `,
      imports: ['color-picker'],
    },
    { inputs: {} }
  );

  const panel = page.locator('[class*="color-picker-panel"]');
  // Headless: no built-in trigger, panel closed (lazy) until opened.
  await expect(page.locator('[class*="color-picker-trigger"]')).toHaveCount(0);
  await expect(panel).toHaveCount(0);

  await page.getByRole('button', { name: 'Pick color' }).click();
  await expect(panel).toBeVisible();
});

test('editing an RGB channel updates the value', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-color-picker [inline]="true" [alpha]="false" [format]="'rgb'" [value]="'#000000'" (valueChange)="output('value', $event)" />`,
      imports: ['color-picker'],
    },
    { inputs: {} }
  );
  const boxes = page.locator('jig-color-picker [class*="channel"] input');
  await expect(boxes).toHaveCount(3); // R, G, B (no alpha)
  await boxes.nth(0).fill('255'); // R = 255
  await boxes.nth(0).blur();
  await expect
    .poll(async () => ((await handle.getOutputLog())['value'] as string[])?.at(-1))
    .toBe('rgb(255, 0, 0)');
});

test('typing a valid hex in the field updates the value', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-color-picker [inline]="true" [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['color-picker'],
    },
    { inputs: { value: '#000000' } }
  );

  const cp = new JigColorPickerHarness(page.locator('jig-color-picker'));
  await cp.hexInput.fill('#ff8800');
  // Commit (blur) — the hex is applied on change, not on every keystroke.
  await page.locator('jig-color-picker input').blur();

  const log = await handle.getOutputLog();
  const last = (log['value'] as string[]).at(-1);
  expect(last?.toLowerCase()).toBe('#ff8800');
});

test('short hex is not expanded while typing — only on commit (regression)', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-color-picker [inline]="true" [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['color-picker'],
    },
    { inputs: { value: '#000000' } }
  );

  const input = page.locator('jig-color-picker input');
  await input.click();
  await input.press('ControlOrMeta+a');
  await input.pressSequentially('#ff0');
  // Mid-typing, the short form must stay as typed, not expand to #ffff00.
  await expect(input).toHaveValue('#ff0');
  // ...yet the color updates live: the emitted value already reflects the typed color
  // (yellow) even though the field still shows the short form.
  await expect
    .poll(async () => ((await handle.getOutputLog())['value'] as string[])?.at(-1)?.toLowerCase())
    .toBe('#ffff00');

  // On commit (blur) the field itself normalizes to the canonical hex.
  await input.blur();
  await expect(input).toHaveValue('#ffff00');
  const log = await handle.getOutputLog();
  expect((log['value'] as string[]).at(-1)?.toLowerCase()).toBe('#ffff00');
});

test('SV drag to near-black and back preserves hue (regression)', async ({ page }) => {
  // Starting hue is green (#00ff00, h=120). Dragging to the near-black corner of the SV area
  // (s≈0.02, v≈0.02) rounds the committed RGB to an achromatic grey/black — if the value→hsva
  // sync effect re-parses that OWN commit, rgbaToHsva recovers h=0 and the hue is lost. Returning
  // to a saturated point afterward must still read back as green, not red, if hue was preserved.
  const handle = await loadComponent(
    page,
    {
      template: `<jig-color-picker [inline]="true" [alpha]="false" [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['color-picker'],
    },
    { inputs: { value: '#00ff00' } }
  );

  const cp = new JigColorPickerHarness(page.locator('jig-color-picker'));
  await cp.clickSv(0.02, 0.98); // near-black corner: s≈0.02, v≈0.02 → achromatic RGB
  await cp.clickSv(0.9, 0.1); // back to a saturated, bright point: s≈0.9, v≈0.9

  const log = await handle.getOutputLog();
  const values = log['value'] as string[];
  const last = values[values.length - 1]!;
  const rgba = parseColor(last)!;
  // Hue must still be green-ish — NOT collapsed to red/grey by the intermediate achromatic commit.
  expect(rgba.g).toBeGreaterThan(rgba.r);
  expect(rgba.g).toBeGreaterThan(rgba.b);
});

test('accessibility (axe): trigger mode', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<jig-color-picker [label]="'Pick a color'" />`,
      imports: ['color-picker'],
    },
    { inputs: {} }
  );
  await expectNoA11yViolations(page);
});

test('accessibility (axe): inline mode', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<jig-color-picker [inline]="true" [label]="'Pick a color'" />`,
      imports: ['color-picker'],
    },
    { inputs: {} }
  );
  await expectNoA11yViolations(page);
});

test('format toggle re-commits the value in the new format (same color)', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-color-picker [inline]="true" [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['color-picker'],
    },
    { inputs: { value: '#3366cc' } }
  );

  const cp = new JigColorPickerHarness(page.locator('jig-color-picker'));

  await cp.formatToggle.click(); // hex -> rgb
  let log = await handle.getOutputLog();
  let last = (log['value'] as string[]).at(-1)!;
  expect(last).toMatch(/^rgb\(/);
  let rgba = parseColor(last)!;
  expect(rgba).toEqual(parseColor('#3366cc'));

  await cp.formatToggle.click(); // rgb -> hsl
  log = await handle.getOutputLog();
  last = (log['value'] as string[]).at(-1)!;
  expect(last).toMatch(/^hsl\(/);
  rgba = parseColor(last)!;
  expect(rgba).toEqual(parseColor('#3366cc'));
});

test('format toggle on an untouched picker does not emit a value', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-color-picker [inline]="true" (valueChange)="output('value', $event)" />`,
      imports: ['color-picker'],
    },
    { inputs: {} }
  );

  const cp = new JigColorPickerHarness(page.locator('jig-color-picker'));
  await cp.formatToggle.click();
  expect(await handle.getOutputLog()).toEqual({});
});

test('rtl', async ({ page }, testInfo) => {
  await useRtl(page);
  await loadComponent(
    page,
    {
      template: `<jig-color-picker [inline]="true" [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['color-picker'],
    },
    { inputs: { value: '#ff0000' } }
  );
  await expectScreenshot(page, testInfo);
});
