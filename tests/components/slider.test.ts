import test, { expect } from '@playwright/test';
import { JigSliderHarness } from '@awdlab/jig-playwright';
import { evalValue, loadComponent } from '../helper/load-component';
import { expectScreenshot } from '../helper/screenshot';
import { expectNoA11yViolations } from '../helper/axe';

test('base', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-slider [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['slider'],
    },
    {
      inputs: {
        value: 50,
      },
    }
  );

  const slider = new JigSliderHarness(page.locator('jig-slider'));
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
      template: `<jig-slider [value]="inputs().value" [step]="inputs().step" (valueChange)="output('value', $event)" />`,
      imports: ['slider'],
    },
    {
      inputs: {
        value: 50,
        step: 5,
      },
    }
  );

  const slider = new JigSliderHarness(page.locator('jig-slider'));
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
      template: `<jig-slider style="width: 300px;" [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['slider'],
    },
    {
      inputs: {
        value: 50,
      },
    }
  );

  const slider = new JigSliderHarness(page.locator('jig-slider'));
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
      template: `<jig-slider [value]="inputs().value" [min]="inputs().min" [max]="inputs().max" [step]="inputs().step" (valueChange)="output('value', $event)" />`,
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

  const slider = new JigSliderHarness(page.locator('jig-slider'));
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
      template: `<jig-slider style="height: 200px;" [vertical]="true" [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['slider'],
    },
    {
      inputs: {
        value: 50,
      },
    }
  );

  const slider = new JigSliderHarness(page.locator('jig-slider'));
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
      template: `<jig-slider [value]="inputs().value" [readonly]="inputs().readonly" [disabled]="inputs().disabled" (valueChange)="output('value', $event)" />`,
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

  const slider = new JigSliderHarness(page.locator('jig-slider'));
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
      template: `<jig-slider [value]="inputs().value" [invalid]="inputs().invalid" [touched]="inputs().touched" />`,
      imports: ['slider'],
    },
    {
      inputs: {
        value: 50,
        invalid: true,
        touched: true,
      },
    }
  );

  const slider = new JigSliderHarness(page.locator('jig-slider'));
  await expectScreenshot(page, testInfo, 'invalid');
});

test('value updates', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-slider [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['slider'],
    },
    {
      inputs: {
        value: 25,
      },
    }
  );

  const slider = new JigSliderHarness(page.locator('jig-slider'));
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
      template: `<jig-slider 
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

  const slider = new JigSliderHarness(page.locator('jig-slider'));

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
      template: `<jig-slider 
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

  const slider = new JigSliderHarness(page.locator('jig-slider'));

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
      template: `<jig-slider [value]="inputs().value" [label]="inputs().label" />`,
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

test('range base', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-slider style="width: 300px;" [range]="true" [value]="inputs().value" [label]="inputs().label" (valueChange)="output('value', $event)" />`,
      imports: ['slider'],
    },
    {
      inputs: {
        value: [20, 60],
        label: 'Price',
      },
    }
  );

  const slider = new JigSliderHarness(page.locator('jig-slider'));
  await expect(slider.thumbs).toHaveCount(2);
  await slider.expectRangeValue([20, 60]);
  await expectScreenshot(page, testInfo, 'initial');

  // Host degrades to a group; the value ARIA lives on the thumbs.
  await expect(slider.locator).toHaveAttribute('role', 'group');
  await expect(slider.locator).toHaveAttribute('aria-label', 'Price');
  await expect(slider.locator).not.toHaveAttribute('aria-valuenow');
  await expect(slider.locator).not.toHaveAttribute('aria-valuemin');
  await expect(slider.locator).not.toHaveAttribute('aria-orientation');
  await expect(slider.locator).not.toHaveAttribute('tabindex');

  for (const thumb of [slider.thumbStart, slider.thumbEnd]) {
    await expect(thumb).toHaveAttribute('role', 'slider');
    await expect(thumb).toHaveAttribute('tabindex', '0');
    await expect(thumb).toHaveAttribute('aria-orientation', 'horizontal');
    await expect(thumb).not.toHaveAttribute('aria-label', '');
  }

  // Each handle reports its own legal window, not the whole track.
  await expect(slider.thumbStart).toHaveAttribute('aria-valuemin', '0');
  await expect(slider.thumbStart).toHaveAttribute('aria-valuemax', '60');
  await expect(slider.thumbEnd).toHaveAttribute('aria-valuemin', '20');
  await expect(slider.thumbEnd).toHaveAttribute('aria-valuemax', '100');

  // Value changes propagate back into the ARIA window.
  await handle.setInputs({ value: [10, 90] });
  await slider.expectRangeValue([10, 90]);
  await expect(slider.thumbStart).toHaveAttribute('aria-valuemax', '90');
  await expect(slider.thumbEnd).toHaveAttribute('aria-valuemin', '10');
});

test('range normalizes an unsorted value', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    {
      template: `<jig-slider [range]="true" [value]="inputs().value" />`,
      imports: ['slider'],
    },
    {
      inputs: {
        value: [80, 30],
      },
    }
  );

  const slider = new JigSliderHarness(page.locator('jig-slider'));
  await slider.expectRangeValue([30, 80]);
});

test('range vertical', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    {
      template: `<jig-slider style="height: 200px;" [range]="true" [vertical]="true" [value]="inputs().value" />`,
      imports: ['slider'],
    },
    {
      inputs: {
        value: [25, 75],
      },
    }
  );

  const slider = new JigSliderHarness(page.locator('jig-slider'));
  await slider.expectRangeValue([25, 75]);
  await expect(slider.thumbStart).toHaveAttribute('aria-orientation', 'vertical');
  await expectScreenshot(page, testInfo, 'initial');
});

test('range accessibility (axe)', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<jig-slider [range]="true" [value]="inputs().value" [label]="inputs().label" />`,
      imports: ['slider'],
    },
    {
      inputs: {
        value: [20, 60],
        label: 'Price range',
      },
    }
  );

  await expectNoA11yViolations(page);
});

test('range keyboard moves only the focused handle', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-slider [range]="true" [value]="inputs().value" [step]="inputs().step" (valueChange)="output('value', $event)" />`,
      imports: ['slider'],
    },
    {
      inputs: {
        value: [20, 60],
        step: 5,
      },
    }
  );

  const slider = new JigSliderHarness(page.locator('jig-slider'));

  await slider.focus('start');
  await slider.pressKey('ArrowRight', 'start');
  await slider.expectRangeValue([25, 60]);

  await slider.pressKey('ArrowLeft', 'start');
  await slider.expectRangeValue([20, 60]);

  await slider.focus('end');
  await slider.pressKey('ArrowUp', 'end');
  await slider.expectRangeValue([20, 65]);

  await slider.pressKey('ArrowDown', 'end');
  await slider.expectRangeValue([20, 60]);

  // Home/End land on each handle's own bound, not the track's.
  await slider.pressKey('Home', 'end');
  await slider.expectRangeValue([20, 20]);

  await slider.pressKey('End', 'end');
  await slider.expectRangeValue([20, 100]);

  await slider.pressKey('End', 'start');
  await slider.expectRangeValue([100, 100]);

  await slider.pressKey('Home', 'start');
  await slider.expectRangeValue([0, 100]);

  const outputs = await handle.getOutputLog();
  expect(outputs['value']).toEqual([
    [25, 60],
    [20, 60],
    [20, 65],
    [20, 60],
    [20, 20],
    [20, 100],
    [100, 100],
    [0, 100],
  ]);
});

test('range drag moves only the dragged handle', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<jig-slider style="width: 300px;" [range]="true" [value]="inputs().value" />`,
      imports: ['slider'],
    },
    {
      inputs: {
        value: [20, 60],
      },
    }
  );

  const slider = new JigSliderHarness(page.locator('jig-slider'));

  await slider.dragThumb({ x: 30 }, 'start');
  await expect(async () => {
    const start = Number(await slider.thumbStart.getAttribute('aria-valuenow'));
    const end = Number(await slider.thumbEnd.getAttribute('aria-valuenow'));
    expect(start).toBeGreaterThan(20);
    expect(end).toBe(60);
  }).toPass();

  await slider.dragThumb({ x: -30 }, 'end');
  await expect(async () => {
    const end = Number(await slider.thumbEnd.getAttribute('aria-valuenow'));
    expect(end).toBeLessThan(60);
  }).toPass();
});

test('range track click moves the nearest handle', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<jig-slider style="width: 300px;" [range]="true" [value]="inputs().value" />`,
      imports: ['slider'],
    },
    {
      inputs: {
        value: [40, 60],
      },
    }
  );

  const slider = new JigSliderHarness(page.locator('jig-slider'));

  // Far left of the track: nearer the start handle.
  await slider.clickTrack({ x: 10 });
  await expect(async () => {
    const start = Number(await slider.thumbStart.getAttribute('aria-valuenow'));
    const end = Number(await slider.thumbEnd.getAttribute('aria-valuenow'));
    expect(start).toBeLessThan(20);
    expect(end).toBe(60);
  }).toPass();

  // Far right: nearer the end handle.
  await slider.clickTrack({ x: 270 });
  await expect(async () => {
    const end = Number(await slider.thumbEnd.getAttribute('aria-valuenow'));
    expect(end).toBeGreaterThan(80);
  }).toPass();
});

test('range readonly & disabled', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-slider style="width: 300px;" [range]="true" [value]="inputs().value" [readonly]="inputs().readonly" [disabled]="inputs().disabled" (valueChange)="output('value', $event)" />`,
      imports: ['slider'],
    },
    {
      inputs: {
        value: [20, 60],
        readonly: true,
        disabled: false,
      },
    }
  );

  const slider = new JigSliderHarness(page.locator('jig-slider'));
  await expect(slider.thumbStart).toHaveAttribute('aria-readonly', 'true');
  await expect(slider.thumbStart).toHaveAttribute('tabindex', '0');
  await expectScreenshot(page, testInfo, 'readonly');

  async function expectFrozen() {
    await slider.pressKey('ArrowRight', 'start');
    await slider.pressKey('ArrowRight', 'end');
    await slider.clickTrack({ x: 10 });
    await slider.dragThumb({ x: 40 }, 'start');
    await slider.expectRangeValue([20, 60]);
    expect(await handle.getOutputLog()).toEqual({});
  }

  await expectFrozen();

  await handle.setInputs({ readonly: false, disabled: true });
  await expect(slider.locator).toHaveAttribute('disabled');
  await expect(slider.thumbStart).toHaveAttribute('tabindex', '-1');
  await expect(slider.thumbEnd).toHaveAttribute('tabindex', '-1');
  await expectScreenshot(page, testInfo, 'disabled');

  await expectFrozen();

  await handle.setInputs({ disabled: false });
  await slider.pressKey('ArrowRight', 'start');
  await slider.expectRangeValue([21, 60]);
});

test('minRangeDistance clamps the moved handle', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-slider style="width: 300px;" [range]="true" [minRangeDistance]="inputs().minRangeDistance" [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['slider'],
    },
    {
      inputs: {
        value: [30, 70],
        minRangeDistance: 10,
      },
    }
  );

  const slider = new JigSliderHarness(page.locator('jig-slider'));

  // The gap shows up in each handle's announced window.
  await expect(slider.thumbStart).toHaveAttribute('aria-valuemax', '60');
  await expect(slider.thumbEnd).toHaveAttribute('aria-valuemin', '40');

  // End into start: stops at start + 10, start does not move.
  await slider.pressKey('Home', 'end');
  await slider.expectRangeValue([30, 40]);

  // Start into end: stops at end - 10.
  await slider.pressKey('End', 'start');
  await slider.expectRangeValue([30, 40]);

  // Stepping toward the other handle stops at the gap rather than crossing.
  await slider.pressKey('End', 'end');
  await slider.expectRangeValue([30, 100]);
  await handle.setInputs({ value: [30, 41] });
  await slider.pressKey('ArrowRight', 'start');
  await slider.expectRangeValue([31, 41]);
  await slider.pressKey('ArrowRight', 'start');
  await slider.expectRangeValue([31, 41]);

  // Dragging respects it too.
  await handle.setInputs({ value: [30, 70] });
  await slider.dragThumb({ x: 200 }, 'start');
  await expect(async () => {
    const start = Number(await slider.thumbStart.getAttribute('aria-valuenow'));
    const end = Number(await slider.thumbEnd.getAttribute('aria-valuenow'));
    expect(end).toBe(70);
    expect(start).toBeLessThanOrEqual(60);
  }).toPass();
});

test('minRangeDistance larger than the span throws', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', async msg => {
    if (msg.type() !== 'error') return;
    const parts = await Promise.all(
      msg.args().map(arg => arg.evaluate(e => (e instanceof Error ? e.message : String(e))))
    );
    errors.push(parts.join(' '));
  });
  page.on('pageerror', err => errors.push(err.message));

  await loadComponent(
    page,
    {
      template: `<jig-slider [range]="true" [min]="0" [max]="10" [minRangeDistance]="20" [value]="inputs().value" />`,
      imports: ['slider'],
    },
    {
      inputs: {
        value: [0, 10],
      },
    }
  );

  await expect(async () => {
    expect(errors.join('\n')).toContain('[slider]');
    expect(errors.join('\n')).toContain('minRangeDistance');
  }).toPass();
});

test('negative minRangeDistance throws', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', async msg => {
    if (msg.type() !== 'error') return;
    const parts = await Promise.all(
      msg.args().map(arg => arg.evaluate(e => (e instanceof Error ? e.message : String(e))))
    );
    errors.push(parts.join(' '));
  });
  page.on('pageerror', err => errors.push(err.message));

  await loadComponent(
    page,
    {
      template: `<jig-slider [range]="true" [minRangeDistance]="-5" [value]="inputs().value" />`,
      imports: ['slider'],
    },
    {
      inputs: {
        value: [0, 10],
      },
    }
  );

  await expect(async () => {
    expect(errors.join('\n')).toContain('minRangeDistance cannot be negative');
  }).toPass();
});
