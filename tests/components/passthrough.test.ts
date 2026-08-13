import test, { expect } from '@playwright/test';
import { evalValue, loadComponent } from '../helper/load-component';
import { useRtl } from '../helper/direction';
import { expectScreenshot } from '../helper/screenshot';

/**
 * Passthrough (`pt`) `$listeners` must not leak: when the element carrying the
 * listener is destroyed, the engine has to detach it with `removeEventListener`.
 *
 * We probe this by patching `add/removeEventListener` for a custom event type
 * (`jigleakprobe`) that nothing else in the app uses, so the counts are fully
 * isolated. The handler lives on `window` as a stable reference, so re-setting
 * inputs never re-registers it.
 */

const PROBE_INIT = () => {
  const w = window as any;
  w.__ptProbe = { added: 0, removed: 0, fired: 0, el: null as EventTarget | null };
  // A stable pt fixture: same object + same handler identity across evals, so
  // toggling `show` does not churn the listener registration.
  w.__ptFixture = {
    root: {
      $listeners: {
        jigleakprobe: () => {
          w.__ptProbe.fired++;
        },
      },
    },
  };

  const proto = EventTarget.prototype;
  const origAdd = proto.addEventListener;
  const origRemove = proto.removeEventListener;
  proto.addEventListener = function (type, handler, opts) {
    if (type === 'jigleakprobe') {
      w.__ptProbe.added++;
      w.__ptProbe.el = this;
    }
    return origAdd.call(this, type, handler as EventListener, opts);
  };
  proto.removeEventListener = function (type, handler, opts) {
    if (type === 'jigleakprobe') {
      w.__ptProbe.removed++;
    }
    return origRemove.call(this, type, handler as EventListener, opts);
  };
};

test('pt $listeners are removed when the element carrying them is destroyed', async ({ page }) => {
  // Patch before Angular bootstraps so the probe sees the very first registration.
  await page.addInitScript(PROBE_INIT);

  const handle = await loadComponent(
    page,
    {
      // The calendar sits behind an @if so we can destroy *part* of the component
      // (the element with the listener) without tearing down the whole test host.
      template: `@if (inputs().show) {
        <jig-calendar [inline]="true" [pt]="inputs().pt" />
      }`,
      imports: ['calendar'],
    },
    {
      inputs: {
        show: true,
        pt: evalValue('window.__ptFixture'),
      },
    }
  );

  const calendar = page.locator('jig-calendar');
  await expect(calendar).toBeAttached();

  // The listener is attached exactly once, and nothing has been removed yet.
  await expect.poll(() => page.evaluate(() => (window as any).__ptProbe.added)).toBe(1);
  expect(await page.evaluate(() => (window as any).__ptProbe.removed)).toBe(0);

  // The listener is genuinely live: dispatching the event on its element fires it.
  await page.evaluate(() => {
    (window as any).__ptProbe.el?.dispatchEvent(new Event('jigleakprobe'));
  });
  expect(await page.evaluate(() => (window as any).__ptProbe.fired)).toBe(1);

  // Destroy the part of the component that holds the listener.
  await handle.setInputs({ show: false });
  await expect(calendar).toHaveCount(0);

  // The engine must have detached the listener on destroy — no leak.
  await expect.poll(() => page.evaluate(() => (window as any).__ptProbe.removed)).toBe(1);

  // And the added/removed counts are balanced.
  const probe = await page.evaluate(() => {
    const p = (window as any).__ptProbe;
    return { added: p.added, removed: p.removed };
  });
  expect(probe).toEqual({ added: 1, removed: 1 });
});

test('pt dependency slot forwards to ONE nested instance', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<jig-calendar [inline]="true" [pt]="inputs().pt" />`,
      imports: ['calendar'],
    },
    {
      inputs: {
        // The 'current-month' slot is typed JigPassthrough<select>; its 'root'
        // key lands on the month select host, forwarded via that select's own
        // engine. The year select uses a different slot and stays untouched.
        pt: { 'current-month': { root: { $classes: 'probe-month' } } },
      },
    }
  );

  // Only the month select carries the class; the year select does not.
  await expect(page.locator('jig-calendar jig-select.probe-month')).toHaveCount(1);
});

test('dependency marker class is auto-applied without pt', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<jig-calendar [inline]="true" />`,
      imports: ['calendar'],
    },
    {}
  );

  // The current-month select host carries the calendar marker class
  // (`{namePrefix}{scope}-{depClass}` = `jig-calendar-current-month`) even
  // when no pt is provided.
  await expect(page.locator('jig-calendar jig-select.jig-calendar-current-month')).toHaveCount(1);
});

test('rtl', async ({ page }, testInfo) => {
  await useRtl(page);
  await loadComponent(
    page,
    {
      // The calendar sits behind an @if so we can destroy *part* of the component
      // (the element with the listener) without tearing down the whole test host.
      template: `@if (inputs().show) {
        <jig-calendar [inline]="true" [pt]="inputs().pt" />
      }`,
      imports: ['calendar'],
    },
    {
      inputs: {
        show: true,
        pt: evalValue('window.__ptFixture'),
      },
    }
  );
  await expectScreenshot(page, testInfo);
});
