import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { AwdSnackbarHarness } from '@awdlab/jig-playwright';
import { expectScreenshot } from '../helper/screenshot';
import { expectNoA11yViolations } from '../helper/axe';

test('features', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <jig-snackbar
        class="page-center"
        [header]="inputs().header"
        [content]="inputs().content"
        [icon]="inputs().icon"
        [closable]="inputs().closable"
        [autoHide]="false"
        (closeSnackbar)="output('closeSnackbar', $event)"
      />
    `,
      imports: ['snackbar'],
    },
    {
      inputs: {
        header: 'Notification',
        content: 'This is a basic snackbar message.',
        icon: undefined,
        closable: false,
      },
    }
  );

  const snackbar = new AwdSnackbarHarness(page.locator('jig-snackbar'));

  await test.step('default', async () => {
    await snackbar.expectHeader('Notification');
    await snackbar.expectContent('This is a basic snackbar message.');
    await snackbar.expectIcon(false);
    await snackbar.expectClosable(false);
    await expectScreenshot(page, testInfo, 'default');
  });

  await test.step('with icon', async () => {
    await handle.setInputs({
      header: 'Notification',
      content: 'This is a basic snackbar message.',
      icon: {
        body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0-8 0M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>',
        width: 24,
        height: 24,
      },
      closable: false,
    });
    await snackbar.expectIcon(true);
    await expectScreenshot(page, testInfo, 'with-icon');
  });

  await test.step('closable', async () => {
    await handle.setInputs({
      header: 'Notification',
      content: 'This is a basic snackbar message.',
      icon: undefined,
      closable: true,
    });
    await snackbar.expectClosable(true);
    await expectScreenshot(page, testInfo, 'closable');

    await snackbar.close();
    // closeSnackbar is an `output<void>`, so each emission logs `undefined` — assert it fired once.
    expect((await handle.getOutputLog())['closeSnackbar']).toHaveLength(1);
  });
});

test('colors', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    {
      template: `
      <div class="page-center">
        <div class="flex gap-2 flex-col">
          @for (color of inputs().colors; track $index) {
            <jig-snackbar
              [color]="color"
              [header]="color ?? 'default'"
              [content]="'Snackbar message'"
              [autoHide]="false"
            />
          }
        </div>
      </div>
    `,
      imports: ['snackbar'],
    },
    {
      inputs: {
        colors: [
          'surface',
          'primary',
          'secondary',
          'accent',
          'success',
          'warning',
          'error',
          'info',
        ],
      },
    }
  );

  await expectScreenshot(page, testInfo, 'colors');
});

test('actions', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <jig-snackbar
        class="page-center"
        [color]="'success'"
        [icon]="{ body: '<path fill=\\'none\\' stroke=\\'currentColor\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\' stroke-width=\\'2\\' d=\\'M5 12l5 5L20 7\\'/>', width: 24, height: 24 }"
        [header]="'Deal added'"
        [content]="'Deal successfully added'"
        [autoHide]="false"
        [closable]="true"
        [actions]="[{ label: 'UNDO', value: 'undo', color: 'success', kind: 'text' }]"
        (closeSnackbar)="output('closeSnackbar', $event)"
      />
    `,
      imports: ['snackbar'],
    },
    { inputs: {} }
  );

  await expect(page.getByRole('button', { name: 'UNDO' })).toBeVisible();
  await expectScreenshot(page, testInfo, 'actions');

  await page.getByRole('button', { name: 'UNDO' }).click();
  // Action click always dismisses the snackbar.
  expect((await handle.getOutputLog())['closeSnackbar']).toHaveLength(1);
});

test('progress bar', async ({ page }) => {
  // Note: the test harness runs with `disableAnimations: true`, which injects
  // `animation-duration: 0s !important`. Combined with the progress bar's
  // `animation-fill-mode: forwards`, that snaps the depleting bar to its empty
  // end-state (scaleX(0)) — so a screenshot is meaningless here. We instead
  // assert the bar is present and correctly styled/wired via computed styles.
  const setup = async (showProgress: boolean, autoHide: number | false) =>
    loadComponent(
      page,
      {
        template: `
        <jig-snackbar
          class="page-center"
          [header]="'Notification'"
          [content]="'Auto-hiding message'"
          [autoHide]="inputs().autoHide"
          [showProgress]="inputs().showProgress"
        />
      `,
        imports: ['snackbar'],
      },
      { inputs: { showProgress, autoHide } }
    );

  const bar = page.locator('jig-snackbar >> css=[class*="progressBar"]');

  await test.step('renders and is styled when auto-hiding', async () => {
    const handle = await setup(true, 100000);
    await expect(bar).toHaveCount(1);
    const styles = await bar.evaluate(el => {
      const cs = getComputedStyle(el);
      return {
        position: cs.position,
        height: cs.height,
        animationName: cs.animationName,
        // Duration is forced to 0s by the harness; assert the app set it inline instead.
        inlineDuration: (el as HTMLElement).style.animationDuration,
        backgroundColor: cs.backgroundColor,
      };
    });
    expect(styles.position).toBe('absolute');
    expect(styles.height).toBe('3px');
    expect(styles.animationName).toBe('jig-snackbar-progressBar');
    expect(styles.inlineDuration).toBe('100000ms');
    // Background must resolve to a visible (non-transparent) colour.
    expect(styles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(styles.backgroundColor).not.toBe('transparent');
  });

  await test.step('pauses on hover and resumes on leave when pauseOnHover is set', async () => {
    await setup(true, 100000);
    const snackbar = page.locator('jig-snackbar');
    const playState = () => bar.evaluate(el => (el as HTMLElement).style.animationPlayState);

    // Running by default while the auto-hide timer is active.
    expect(await playState()).toBe('running');

    // Hovering freezes the progress bar (and the underlying auto-hide timer).
    // Park the pointer away first so hover() always crosses the boundary and fires mouseenter.
    await page.mouse.move(0, 0);
    await snackbar.hover();
    await expect.poll(playState).toBe('paused');

    // Moving the pointer away resumes it.
    await page.mouse.move(0, 0);
    await expect.poll(playState).toBe('running');
  });

  await test.step('is absent when auto-hide is disabled', async () => {
    // loadComponent re-navigates the page, so each setup() starts fresh.
    await setup(true, false);
    await expect(bar).toHaveCount(0);
  });

  await test.step('is absent when showProgress is false', async () => {
    await setup(false, 100000);
    await expect(bar).toHaveCount(0);
  });
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `
      <jig-snackbar
        class="page-center"
        [header]="'Notification'"
        [content]="'This is a basic snackbar message.'"
        [closable]="true"
        [autoHide]="false"
      />
    `,
      imports: ['snackbar'],
    },
    { inputs: {} }
  );

  const snackbar = new AwdSnackbarHarness(page.locator('jig-snackbar'));
  await snackbar.expectClosable(true);

  await expectNoA11yViolations(page);
});
