import test, { expect } from '@playwright/test';
import { NgnSliderHarness } from '@ngneers/controls-playwright';
import { evalValue, loadComponent } from '../helper/load-component';
import { expectScreenshot } from '../helper/screenshot';
import { expectNoA11yViolations } from '../helper/axe';

test('base', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<ngn-slider [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['slider'],
    },
    {
      inputs: {
        value: 50,
      },
    }
  );

  const slider = new NgnSliderHarness(page.locator('ngn-slider'));
  await slider.expectValue(50);
  await slider.expectMin(0);
  await slider.expectMax(100);
  await slider.expectOrientation('horizontal');
  await expectScreenshot(page, testInfo, 'initial');

  // Test output events
  const expectedOutputs: number[] = [50];
  async function expectOutput(withNewValue?: number) {
    if (withNewValue !== undefined) {
      expectedOutputs.push(withNewValue);
    }
    expect(await handle.getOutputLog()).toEqual({});
  }

  await expectOutput();
});

test('keyboard navigation', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<ngn-slider [value]="inputs().value" [step]="inputs().step" (valueChange)="output('value', $event)" />`,
      imports: ['slider'],
    },
    {
      inputs: {
        value: 50,
        step: 5,
      },
    }
  );

  const slider = new NgnSliderHarness(page.locator('ngn-slider'));
  await slider.focus();
  await slider.expectValue(50);

  // Test arrow right increases value
  await slider.pressKey('ArrowRight');
  await slider.expectValue(55);
  await expectScreenshot(page, testInfo, 'arrow-right');

  // Test arrow up increases value
  await slider.pressKey('ArrowUp');
  await slider.expectValue(60);

  // Test arrow left decreases value
  await slider.pressKey('ArrowLeft');
  await slider.expectValue(55);

  // Test arrow down decreases value
  await slider.pressKey('ArrowDown');
  await slider.expectValue(50);

  // Test Home key sets to min
  await slider.pressKey('Home');
  await slider.expectValue(0);

  // Test End key sets to max
  await slider.pressKey('End');
  await slider.expectValue(100);

  // Verify outputs
  const outputs = await handle.getOutputLog();
  expect(outputs['value']).toEqual([55, 60, 55, 50, 0, 100]);
});

test('track click', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<ngn-slider style="width: 300px;" [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['slider'],
    },
    {
      inputs: {
        value: 50,
      },
    }
  );

  const slider = new NgnSliderHarness(page.locator('ngn-slider'));
  await slider.expectValue(50);

  // Click at the beginning of the track
  await slider.clickTrack({ x: 10 });
  await expect(async () => {
    const value = await slider.locator.getAttribute('aria-valuenow');
    expect(Number(value)).toBeLessThan(20);
  }).toPass();

  // Click at the end of the track
  await slider.clickTrack({ x: 270 });
  await expect(async () => {
    const value = await slider.locator.getAttribute('aria-valuenow');
    expect(Number(value)).toBeGreaterThan(80);
  }).toPass();
  await expectScreenshot(page, testInfo, 'track-click-end');
});

test('min max step', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<ngn-slider [value]="inputs().value" [min]="inputs().min" [max]="inputs().max" [step]="inputs().step" (valueChange)="output('value', $event)" />`,
      imports: ['slider'],
    },
    {
      inputs: {
        value: 10,
        min: 0,
        max: 20,
        step: 2,
      },
    }
  );

  const slider = new NgnSliderHarness(page.locator('ngn-slider'));
  await slider.expectValue(10);
  await slider.expectMin(0);
  await slider.expectMax(20);

  // Arrow keys should respect step
  await slider.focus();
  await slider.pressKey('ArrowRight');
  await slider.expectValue(12);

  await slider.pressKey('ArrowRight');
  await slider.expectValue(14);

  await slider.pressKey('ArrowLeft');
  await slider.expectValue(12);

  // Home and End should work with custom min/max
  await slider.pressKey('Home');
  await slider.expectValue(0);

  await slider.pressKey('End');
  await slider.expectValue(20);
});

test('vertical', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<ngn-slider style="height: 200px;" [vertical]="true" [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['slider'],
    },
    {
      inputs: {
        value: 50,
      },
    }
  );

  const slider = new NgnSliderHarness(page.locator('ngn-slider'));
  await slider.expectValue(50);
  await slider.expectOrientation('vertical');
  await expectScreenshot(page, testInfo, 'initial');

  // Test keyboard navigation in vertical mode
  await slider.focus();
  await slider.pressKey('ArrowUp');
  await slider.expectValue(51);

  await slider.pressKey('ArrowDown');
  await slider.expectValue(50);

  await slider.pressKey('Home');
  await slider.expectValue(0);

  await slider.pressKey('End');
  await slider.expectValue(100);
});

test('readonly & disabled', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<ngn-slider [value]="inputs().value" [readonly]="inputs().readonly" [disabled]="inputs().disabled" (valueChange)="output('value', $event)" />`,
      imports: ['slider'],
    },
    {
      inputs: {
        value: 50,
        readonly: true,
        disabled: false,
      },
    }
  );

  const slider = new NgnSliderHarness(page.locator('ngn-slider'));
  await slider.expectValue(50);
  await slider.expectReadonly(true);
  await slider.expectDisabled(false);
  await expectScreenshot(page, testInfo, 'readonly');

  async function testNotInteractable() {
    // Keyboard navigation should not work when readonly
    await slider.focus();
    await slider.pressKey('ArrowRight');
    await slider.expectValue(50); // Value should not change

    await slider.pressKey('Home');
    await slider.expectValue(50); // Value should not change

    // Track click should not work when readonly
    await slider.clickTrack({ x: 10 });
    await slider.expectValue(50); // Value should not change

    // Verify no outputs were emitted
    expect(await handle.getOutputLog()).toEqual({});
  }

  await testNotInteractable();

  // Test changing disabled state
  await handle.setInputs({ readonly: false, disabled: true });
  await slider.expectDisabled(true);
  await slider.expectReadonly(false);
  await expectScreenshot(page, testInfo, 'disabled');

  await testNotInteractable();

  // Test changing readonly state
  await handle.setInputs({ disabled: false });
  await slider.expectReadonly(false);
  await slider.expectDisabled(false);

  // Now keyboard navigation should work
  await slider.pressKey('ArrowRight');
  await slider.expectValue(51);
});

test('invalid', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<ngn-slider [value]="inputs().value" [invalid]="inputs().invalid" />`,
      imports: ['slider'],
    },
    {
      inputs: {
        value: 50,
        invalid: true,
      },
    }
  );

  const slider = new NgnSliderHarness(page.locator('ngn-slider'));
  await expectScreenshot(page, testInfo, 'invalid');
});

test('value updates', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<ngn-slider [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['slider'],
    },
    {
      inputs: {
        value: 25,
      },
    }
  );

  const slider = new NgnSliderHarness(page.locator('ngn-slider'));
  await slider.expectValue(25);
  await expectScreenshot(page, testInfo, 'value-25');

  // Update value via input
  await handle.setInputs({ value: 75 });
  await slider.expectValue(75);
  await expectScreenshot(page, testInfo, 'value-75');

  // Update value via interaction
  await slider.focus();
  await slider.pressKey('Home');
  await slider.expectValue(0);

  await slider.pressKey('End');
  await slider.expectValue(100);
});

test('accessibility', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<ngn-slider 
        [value]="inputs().value" 
        [min]="inputs().min" 
        [max]="inputs().max"
        [label]="inputs().label"
        [valueText]="inputs().valueText"
      />`,
      imports: ['slider'],
    },
    {
      inputs: {
        value: 50,
        min: 0,
        max: 100,
        label: 'Volume',
        valueText: '50%',
      },
    }
  );

  const slider = new NgnSliderHarness(page.locator('ngn-slider'));

  // Check ARIA attributes
  await expect(slider.locator).toHaveAttribute('role', 'slider');
  await expect(slider.locator).toHaveAttribute('aria-valuenow', '50');
  await expect(slider.locator).toHaveAttribute('aria-valuemin', '0');
  await expect(slider.locator).toHaveAttribute('aria-valuemax', '100');
  await expect(slider.locator).toHaveAttribute('aria-label', 'Volume');
  await expect(slider.locator).toHaveAttribute('aria-valuetext', '50%');
  await expect(slider.locator).toHaveAttribute('tabindex', '0');
});

test('value text function', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<ngn-slider 
        [value]="inputs().value" 
        [valueTextFn]="inputs().valueTextFn"
      />`,
      imports: ['slider'],
    },
    {
      inputs: {
        value: 50,
        valueTextFn: evalValue('value => `${value} units`'),
      },
    }
  );

  const slider = new NgnSliderHarness(page.locator('ngn-slider'));

  await expect(slider.locator).toBeVisible();

  await expect(slider.locator).toHaveAttribute('aria-valuetext', '50 units');

  // Update value and check valueText updates
  await handle.setInputs({ value: 75 });
  await expect(slider.locator).toHaveAttribute('aria-valuetext', '75 units');
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<ngn-slider [value]="inputs().value" [label]="inputs().label" />`,
      imports: ['slider'],
    },
    {
      inputs: {
        value: 50,
        label: 'Volume',
      },
    }
  );

  await expectNoA11yViolations(page);
});
