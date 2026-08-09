import test, { expect } from '@playwright/test';
import { NgnStepperHarness } from '@awdlab/jig-playwright';
import { loadComponent } from '../helper/load-component';
import { expectNoA11yViolations } from '../helper/axe';
import { expectScreenshot } from '../helper/screenshot';

const TEMPLATE = `
  <awd-stepper [active]="inputs().active" [linear]="inputs().linear"
    (activeChange)="output('active', $event)">
    <awd-step [label]="'One'" [completed]="inputs().c0">
      <ng-template #content>Step one content</ng-template>
    </awd-step>
    <awd-step [label]="'Two'">
      <ng-template #content>Step two content</ng-template>
    </awd-step>
    <awd-step [label]="'Three'">
      <ng-template #content>Step three content</ng-template>
    </awd-step>
  </awd-stepper>
`;

test('non-linear: any step selectable', async ({ page }) => {
  await loadComponent(
    page,
    { template: TEMPLATE, imports: ['stepper', 'step'] },
    { inputs: { active: 0, linear: false, c0: false } }
  );

  const stepper = new NgnStepperHarness(page.locator('awd-stepper'));
  await stepper.expectActive(0);
  await expect(page.getByText('Step one content')).toBeVisible();

  await stepper.selectStep(2);
  await stepper.expectActive(2);
  await expect(page.getByText('Step three content')).toBeVisible();
});

test('linear: unreachable steps are visually disabled (greyed) and un-dim when reachable', async ({
  page,
}) => {
  const handle = await loadComponent(
    page,
    { template: TEMPLATE, imports: ['stepper', 'step'] },
    { inputs: { active: 0, linear: true, c0: false } }
  );

  const stepper = new NgnStepperHarness(page.locator('awd-stepper'));
  const opacity = (i: number) =>
    stepper.steps.nth(i).evaluate(el => getComputedStyle(el as HTMLElement).opacity);

  // Step 0 is active/reachable → full opacity; steps 1 & 2 are gated → dimmed.
  expect(await opacity(0)).toBe('1');
  expect(Number(await opacity(1))).toBeLessThan(1);
  expect(Number(await opacity(2))).toBeLessThan(1);
  await expect(stepper.steps.nth(1)).toHaveAttribute('aria-disabled', 'true');

  // Completing step 0 makes step 1 reachable → it un-dims; step 2 stays gated.
  await handle.setInputs({ c0: true });
  await expect(stepper.steps.nth(1)).not.toHaveAttribute('aria-disabled', 'true');
  expect(await opacity(1)).toBe('1');
  expect(Number(await opacity(2))).toBeLessThan(1);
});

test('linear: forward gated until completed', async ({ page }) => {
  const handle = await loadComponent(
    page,
    { template: TEMPLATE, imports: ['stepper', 'step'] },
    { inputs: { active: 0, linear: true, c0: false } }
  );

  const stepper = new NgnStepperHarness(page.locator('awd-stepper'));
  await stepper.expectActive(0);

  // Step 2 is not reachable while step 0 is incomplete.
  await stepper.selectStep(2);
  await stepper.expectActive(0);

  // Complete step 0 → step 1 becomes reachable.
  await handle.setInputs({ c0: true });
  await stepper.selectStep(1);
  await stepper.expectActive(1);
});

test('linear: incomplete optional step does not block forward navigation', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `
        <awd-stepper [linear]="true">
          <awd-step [label]="'One'" [completed]="true"><ng-template #content>One</ng-template></awd-step>
          <awd-step [label]="'Two'" [optional]="true"><ng-template #content>Two</ng-template></awd-step>
          <awd-step [label]="'Three'"><ng-template #content>Three</ng-template></awd-step>
        </awd-stepper>`,
      imports: ['stepper', 'step'],
    },
    { inputs: {} }
  );

  const stepper = new NgnStepperHarness(page.locator('awd-stepper'));
  await stepper.expectActive(0);

  // Step 1 (index 1) is optional and incomplete — it must not gate reaching step 2 (index 2).
  await stepper.selectStep(2);
  await stepper.expectActive(2);
});

test('keyboard: arrow navigation skips a disabled step header', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `
        <awd-stepper>
          <awd-step [label]="'A'"><ng-template #content>A</ng-template></awd-step>
          <awd-step [label]="'B'" [disabled]="true"><ng-template #content>B</ng-template></awd-step>
          <awd-step [label]="'C'"><ng-template #content>C</ng-template></awd-step>
        </awd-stepper>`,
      imports: ['stepper', 'step'],
    },
    { inputs: {} }
  );

  const stepper = new NgnStepperHarness(page.locator('awd-stepper'));
  await stepper.steps.nth(0).focus();
  await page.keyboard.press('ArrowRight');

  // Disabled step B (index 1) must be skipped by arrow-key roving focus, landing on C (index 2).
  await expect(stepper.steps.nth(2)).toBeFocused();
  await expect(stepper.steps.nth(1)).not.toBeFocused();
});

test('disabled step not selectable', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `
        <awd-stepper>
          <awd-step [label]="'A'"><ng-template #content>A</ng-template></awd-step>
          <awd-step [label]="'B'" [disabled]="true"><ng-template #content>B</ng-template></awd-step>
        </awd-stepper>`,
      imports: ['stepper', 'step'],
    },
    { inputs: {} }
  );
  const stepper = new NgnStepperHarness(page.locator('awd-stepper'));
  await stepper.expectStepDisabled(1, true);
});

test('visual: active + completed markers', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    { template: TEMPLATE, imports: ['stepper', 'step'] },
    { inputs: { active: 1, linear: false, c0: true } }
  );

  const stepper = new NgnStepperHarness(page.locator('awd-stepper'));
  await stepper.expectActive(1);

  await expectScreenshot(page.locator('awd-stepper'), testInfo);
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(
    page,
    { template: TEMPLATE, imports: ['stepper', 'step'] },
    { inputs: { active: 0 } }
  );
  await expectNoA11yViolations(page);
});
