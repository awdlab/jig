import test, { expect, type JSHandle } from '@playwright/test';
import { JigMeterHarness } from '@awdlab/jig-playwright';
import { loadComponent } from '../helper/load-component';
import { expectScreenshot } from '../helper/screenshot';
import { expectNoA11yViolations } from '../helper/axe';

const ITEMS = [
  { label: 'Documents', value: 30 },
  { label: 'Media', value: 20 },
  { label: 'Cache', value: 10 },
];

test('base', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    {
      template: `<jig-meter label="Disk usage" [items]="inputs().items" />`,
      imports: ['meter'],
    },
    { inputs: { items: ITEMS } }
  );

  const meter = new JigMeterHarness(page.locator('jig-meter'));
  await meter.expectVisible();
  await meter.expectSegmentCount(3);
  await meter.expectLabels(['Documents', 'Media', 'Cache']);
  // Without a total the items add up to a full bar: 30/20/10 of 60.
  await meter.expectPercentages(['50%', '33%', '17%']);
  await meter.expectSegmentSize(0, 50);
  await expect(meter.locator).toHaveAttribute('role', 'group');
  await expect(meter.locator).toHaveAttribute('aria-label', 'Disk usage');
  await expect(meter.track).toHaveAttribute('aria-hidden', 'true');
  await expectScreenshot(page, testInfo, 'initial');
});

test('total leaves the remainder empty', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-meter label="Sprint capacity" [items]="inputs().items" [total]="inputs().total" />`,
      imports: ['meter'],
    },
    { inputs: { items: ITEMS, total: 100 } }
  );

  const meter = new JigMeterHarness(page.locator('jig-meter'));
  await meter.expectPercentages(['30%', '20%', '10%']);
  await meter.expectSegmentSize(0, 30);
  await expectScreenshot(page, testInfo, 'total-100');

  await handle.setInputs({ total: 60 });
  await meter.expectPercentages(['50%', '33%', '17%']);
  await expectScreenshot(page, testInfo, 'total-60');
});

test('percentages can be hidden', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-meter label="Ticket queue" [items]="inputs().items" [showPercentage]="inputs().showPercentage" />`,
      imports: ['meter'],
    },
    { inputs: { items: ITEMS, showPercentage: false } }
  );

  const meter = new JigMeterHarness(page.locator('jig-meter'));
  await meter.expectPercentagesHidden();
  // Hiding is visual only — the share stays readable for screen readers.
  await expect(meter.locator.locator(meter.classes['sr-only'])).toHaveText(['50%', '33%', '17%']);
  await expectScreenshot(page, testInfo, 'hidden');

  await handle.setInputs({ showPercentage: true });
  await meter.expectPercentages(['50%', '33%', '17%']);
});

test('vertical orientation', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    {
      template: `<jig-meter vertical style="height: 12rem" label="Cluster memory" [items]="inputs().items" [total]="inputs().total" />`,
      imports: ['meter'],
    },
    { inputs: { items: ITEMS, total: 100 } }
  );

  const meter = new JigMeterHarness(page.locator('jig-meter'));
  await meter.expectSegmentCount(3);
  await meter.expectSegmentSize(0, 30);
  await expectScreenshot(page, testInfo, 'vertical');
});

test('item colors', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    {
      template: `<jig-meter label="Build outcomes" [items]="inputs().items" />`,
      imports: ['meter'],
    },
    {
      inputs: {
        items: [
          { label: 'Passed', value: 80, color: '#16a34a' },
          { label: 'Failed', value: 20, color: '#dc2626' },
        ],
      },
    }
  );

  const meter = new JigMeterHarness(page.locator('jig-meter'));
  await expect(meter.segments.first()).toHaveAttribute('style', /--meter-color:\s*#16a34a/);
  await expectScreenshot(page, testInfo, 'colors');
});

test('a custom label template replaces the legend row', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    {
      template: `
        <jig-meter #meter label="Energy mix" [items]="inputs().items">
          <ng-template #label let-item let-percentage="percentage" [jigTemplate]="meter.templateTypes.label">
            <span class="tpl-label">{{ item.label }}</span>
            <span class="tpl-value">{{ item.value }} GW · {{ percentage.toFixed(1) }}%</span>
          </ng-template>
        </jig-meter>`,
      imports: ['meter', 'jigTemplate'],
    },
    {
      inputs: {
        items: [
          { label: 'Wind', value: 30 },
          { label: 'Solar', value: 10 },
        ],
      },
    }
  );

  const meter = new JigMeterHarness(page.locator('jig-meter'));
  // The projected template replaces the whole row — swatch and default percentage included.
  await expect(meter.locator.locator('.tpl-value')).toHaveText(['30 GW · 75.0%', '10 GW · 25.0%']);
  await meter.expectPercentagesHidden();
  await expectScreenshot(page, testInfo, 'label-template');
});

test('item icons render in the legend', async ({ page }, testInfo) => {
  // Iconify data is plain JSON, so an icon travels through the wrapper's inputs as-is.
  const icon = {
    body: '<circle cx="12" cy="12" r="9" fill="currentColor"/>',
    width: 24,
    height: 24,
  };
  await loadComponent(
    page,
    {
      template: `<jig-meter label="Energy mix" [items]="inputs().items" />`,
      imports: ['meter'],
    },
    {
      inputs: {
        items: [
          { label: 'Wind', value: 30, icon },
          { label: 'Solar', value: 10 },
        ],
      },
    }
  );

  const meter = new JigMeterHarness(page.locator('jig-meter'));
  // Only the item that carries an icon gets one.
  await expect(meter.icons).toHaveCount(1);
  await expect(meter.items.first().locator('svg')).toBeVisible();
  await expectScreenshot(page, testInfo, 'icons');
});

test('hover pairs a segment with its legend entry', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-meter label="Disk usage" [items]="inputs().items" [highlightOnHover]="inputs().highlightOnHover" />`,
      imports: ['meter'],
    },
    { inputs: { items: ITEMS, highlightOnHover: true } }
  );

  const meter = new JigMeterHarness(page.locator('jig-meter'));
  await meter.segments.nth(1).hover();
  await meter.expectHighlighted(1);
  await expectScreenshot(page, testInfo, 'segment-hovered');

  // From the legend side the segment lifts clear of the track. A middle item, so the
  // screenshot also covers the separators on both sides of a lifted segment.
  await meter.items.nth(1).hover();
  await meter.expectHighlighted(1);
  await expect(meter.segments.nth(1)).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, -3)');
  await expectScreenshot(page, testInfo, 'legend-hovered');

  await handle.setInputs({ highlightOnHover: false });
  await meter.segments.nth(1).hover();
  await meter.expectNoHighlight();
});

test('a sub-percent item still paints', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    {
      template: `<jig-meter label="Storage" [items]="inputs().items" />`,
      imports: ['meter'],
    },
    {
      inputs: {
        items: [
          { label: 'Data', value: 999 },
          { label: 'Sliver', value: 0.2 },
        ],
      },
    }
  );

  const meter = new JigMeterHarness(page.locator('jig-meter'));
  await meter.expectPercentages(['100%', '<1%']);
  // 0.02% of the track rounds to nothing; the base minimum keeps it on screen.
  const width = await meter.segments.nth(1).evaluate(el => el.getBoundingClientRect().width);
  expect(width).toBeGreaterThanOrEqual(2);
  await expectScreenshot(page, testInfo, 'sliver');
});

test('edge cases', async ({ page }, testInfo) => {
  // Firefox renders a logged Error as the bare text "Error", so read the argument itself.
  const errorArgs: JSHandle[] = [];
  page.on('console', message => {
    const arg = message.args()[0];
    if (message.type() === 'error' && arg) {
      errorArgs.push(arg);
    }
  });

  const handle = await loadComponent(
    page,
    {
      template: `<jig-meter label="Edge" [items]="inputs().items" [total]="inputs().total" />`,
      imports: ['meter'],
    },
    { inputs: { items: [{ label: 'Only', value: -5 }], total: undefined } }
  );

  const meter = new JigMeterHarness(page.locator('jig-meter'));
  // A negative value counts as 0, which also makes the total 0.
  await meter.expectPercentages(['0%']);

  // A non-zero sliver reads as "<1%" instead of rounding away to "0%".
  await handle.setInputs({
    items: [
      { label: 'Sliver', value: 0.3 },
      { label: 'Rest', value: 999 },
    ],
    total: undefined,
  });
  await meter.expectPercentages(['<1%', '100%']);

  // Items exceeding the total overflow the shown 100% but stay clipped to the track.
  await handle.setInputs({ items: [{ label: 'Over', value: 150 }], total: 100 });
  await meter.expectPercentages(['150%']);
  await expectScreenshot(page, testInfo, 'over-total');
  const errors = await Promise.all(
    errorArgs.map(arg =>
      arg.evaluate(value => (value instanceof Error ? value.message : String(value)))
    )
  );
  expect(errors.join('\n')).toContain('[meter] items add up to 150, which exceeds total 100');

  await handle.setInputs({ items: [], total: 100 });
  await meter.expectSegmentCount(0);
});

test('accessibility', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<jig-meter label="Disk usage" [items]="inputs().items" [total]="inputs().total" />`,
      imports: ['meter'],
    },
    { inputs: { items: ITEMS, total: 100 } }
  );

  await expectNoA11yViolations(page);
});
