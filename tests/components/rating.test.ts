import test, { expect } from '@playwright/test';
import { AwdRatingHarness } from '@awdlab/jig-playwright';
import { loadComponent } from '../helper/load-component';
import { expectScreenshot } from '../helper/screenshot';
import { expectNoA11yViolations } from '../helper/axe';

test('base: click to set, clear on repeat', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-rating [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['rating'],
    },
    { inputs: { value: null } }
  );

  const rating = new AwdRatingHarness(page.locator('jig-rating'));
  await rating.expectMax(5);
  // Default is null (no rating) — no aria-valuenow, 0 is not a valid value.
  await expect(rating.locator).not.toHaveAttribute('aria-valuenow');

  await rating.clickSymbol(2, 'right'); // third symbol → value 3
  await rating.expectValue(3);
  await expectScreenshot(page, testInfo, 'value-3');

  // clearable: clicking the current value clears back to null (not 0)
  await rating.clickSymbol(2, 'right');
  await expect(rating.locator).not.toHaveAttribute('aria-valuenow');

  expect(await handle.getOutputLog()).toEqual({ value: [3, null] });
});

test('whole-step: entering a symbol area fills it (click anywhere in the symbol)', async ({
  page,
}) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-rating [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['rating'],
    },
    { inputs: { value: null } }
  );

  const rating = new AwdRatingHarness(page.locator('jig-rating'));
  // Clicking the LEFT edge of the 3rd symbol must still set 3 — with a whole step,
  // entering the symbol's area fills it (no need to reach the 50% mark).
  await rating.clickSymbol(2, 'left');
  await rating.expectValue(3);

  // The 1st symbol's left edge sets 1, not 0.
  await rating.clickSymbol(0, 'left');
  await rating.expectValue(1);
});

test('gap between symbols is clickable and previews the same value', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<jig-rating [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['rating'],
    },
    { inputs: { value: null } }
  );

  const rating = new AwdRatingHarness(page.locator('jig-rating'));
  const first = await rating.symbols.nth(0).boundingBox();
  const second = await rating.symbols.nth(1).boundingBox();
  if (!first || !second) {
    throw new Error('symbols not laid out');
  }
  // Midpoint of the flex gap: cursor is pointer there, so it must hover-preview and click alike.
  const x = (first.x + first.width + second.x) / 2;
  const y = first.y + first.height / 2;

  await page.mouse.move(x, y);
  await expect(rating.symbols.nth(1)).toHaveCSS('--fillRatio', '1');
  await page.mouse.click(x, y);
  await rating.expectValue(2);
});

test('dead space right of the last symbol sets nothing', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<jig-rating
        style="width: 400px"
        [value]="inputs().value"
        (valueChange)="output('value', $event)"
      />`,
      imports: ['rating'],
    },
    { inputs: { value: null } }
  );

  const rating = new AwdRatingHarness(page.locator('jig-rating'));
  const root = (await rating.locator.boundingBox())!;
  const last = (await rating.symbols.last().boundingBox())!;
  const y = last.y + last.height / 2;
  expect(root.x + root.width).toBeGreaterThan(last.x + last.width + 10);

  await page.mouse.move(root.x + root.width - 5, y);
  await expect(rating.symbols.last()).toHaveCSS('--fillRatio', '0');
  await page.mouse.click(root.x + root.width - 5, y);
  await expect(rating.locator).not.toHaveAttribute('aria-valuenow');
});

test('half-step: left half sets .5, right half sets whole', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-rating [step]="0.5" [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['rating'],
    },
    { inputs: { value: null } }
  );

  const rating = new AwdRatingHarness(page.locator('jig-rating'));
  await rating.clickSymbol(2, 'left'); // left half of 3rd symbol → 2.5
  await rating.expectValue(2.5);
  await rating.clickSymbol(2, 'right'); // right half of 3rd symbol → 3
  await rating.expectValue(3);
});

test('keyboard navigation with step', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<jig-rating [value]="inputs().value" [step]="inputs().step" (valueChange)="output('value', $event)" />`,
      imports: ['rating'],
    },
    { inputs: { value: 2, step: 0.5 } }
  );

  const rating = new AwdRatingHarness(page.locator('jig-rating'));
  await rating.focus();
  await rating.pressKey('ArrowRight');
  await rating.expectValue(2.5);
  await rating.pressKey('ArrowLeft');
  await rating.expectValue(2);
  await rating.pressKey('End');
  await rating.expectValue(5);
  // Home clears (0 is not a valid rating value).
  await rating.pressKey('Home');
  await expect(rating.locator).not.toHaveAttribute('aria-valuenow');
  // Decrementing below the first step also clears.
  await rating.pressKey('ArrowRight');
  await rating.expectValue(0.5);
  await rating.pressKey('ArrowLeft');
  await expect(rating.locator).not.toHaveAttribute('aria-valuenow');
});

test('readonly does not change value', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-rating [value]="inputs().value" [readonly]="true" (valueChange)="output('value', $event)" />`,
      imports: ['rating'],
    },
    { inputs: { value: 3 } }
  );
  const rating = new AwdRatingHarness(page.locator('jig-rating'));
  await rating.clickSymbol(0, 'center');
  await rating.expectValue(3);
  expect(await handle.getOutputLog()).toEqual({});
});

test('disabled: reflects aria-disabled', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<jig-rating [value]="3" [disabled]="true" />`,
      imports: ['rating'],
    },
    { inputs: {} }
  );
  await expect(page.locator('jig-rating')).toHaveAttribute('aria-disabled', 'true');
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<jig-rating [value]="3" [label]="'Rating'" />`,
      imports: ['rating'],
    },
    { inputs: {} }
  );
  await expectNoA11yViolations(page);
});

test('indicatorTemplate receives fillRatio and index, replaces default icons', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<jig-rating [value]="2.5">
        <ng-template #indicator let-ratio let-index="index">
          <span class="ind" [attr.data-ratio]="ratio" [attr.data-index]="index"></span>
        </ng-template>
      </jig-rating>`,
      imports: ['rating'],
    },
    { inputs: {} }
  );

  const indicators = page.locator('jig-rating .ind');
  await expect(indicators).toHaveCount(5);

  const ratios = await indicators.evaluateAll(els => els.map(el => el.getAttribute('data-ratio')));
  const indices = await indicators.evaluateAll(els => els.map(el => el.getAttribute('data-index')));
  expect(ratios).toEqual(['1', '1', '0.5', '0', '0']);
  expect(indices).toEqual(['0', '1', '2', '3', '4']);

  // default full/empty icon rendering is bypassed while a custom template is active
  await expect(page.locator('jig-rating jig-icon')).toHaveCount(0);
});

test('content-child #indicator takes precedence over the indicatorTemplate input', async ({
  page,
}) => {
  await loadComponent(
    page,
    {
      template: `
        <ng-template #alt let-ratio><span class="alt-ind" [attr.data-ratio]="ratio"></span></ng-template>
        <jig-rating [value]="2.5" [indicatorTemplate]="alt">
          <ng-template #indicator let-ratio><span class="ind" [attr.data-ratio]="ratio"></span></ng-template>
        </jig-rating>
      `,
      imports: ['rating'],
    },
    { inputs: {} }
  );

  await expect(page.locator('jig-rating .ind')).toHaveCount(5);
  await expect(page.locator('jig-rating .alt-ind')).toHaveCount(0);
});
