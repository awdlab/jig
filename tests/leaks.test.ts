import test, { expect } from '@playwright/test';
import { enableHeapProfiler, forceGcAndCheckForLeaks } from './helper/find-memory-leaks';

const ITERATIONS = 10; // Number of times to load and destroy components

// This test suite relies on the Chrome DevTools Protocol (CDP), which is only available in Chromium.
test.skip(({ browserName }) => browserName !== 'chromium', 'CDP only available in Chromium');

/**
 * Memory leak detection test for all components.
 *
 * This test loads and destroys all jig components multiple times, then uses
 * Chrome DevTools Protocol to force garbage collection and check for memory leaks.
 *
 * Implementation:
 * - Loads all components via the /leaks route
 * - Toggles component visibility multiple times (controlled by ITERATIONS const)
 * - Forces garbage collection via CDP
 * - Takes a heap snapshot via CDP
 * - Parses the heap snapshot to detect component class instances still in memory
 * - Fails the test if any component class instances are found after GC
 *
 * How it works:
 * - Uses CDP HeapProfiler.addHeapSnapshotChunk events to collect snapshot data
 * - Parses the snapshot JSON structure to iterate through all heap nodes
 * - Searches for component class names in the strings array
 * - Reports any found component instances as potential memory leaks
 *
 * Note: This test only runs on Chromium since CDP is required.
 */
test('Memory leak detection for all components', async ({ page }) => {
  // Increase test timeout for heap snapshot operations
  test.setTimeout(120000); // 2 minutes

  // Navigate to the leaks test page
  const url = process.env['CI'] ? 'http://localhost:4222/leaks' : 'http://hostmachine:4222/leaks';
  await page.goto(url);

  // Wait for the page to be ready
  await expect(page.locator('awd-leak-test')).toBeAttached();

  const client = await enableHeapProfiler(page);

  // Component class names to check for leaks
  const componentClassNames = [
    'NgnAccordion',
    'NgnAccordionPanel',
    'NgnAvatar',
    'NgnAvatarGroup',
    'NgnBreadcrumb',
    'NgnButton',
    'NgnButtonGroup',
    'NgnCalendar',
    'NgnCheckbox',
    'NgnChip',
    'NgnDefer',
    'NgnDialog',
    'NgnEditInplace',
    'NgnFilter',
    'NgnIcon',
    'NgnInplace',
    'NgnInput',
    'NgnInputField',
    'NgnMaskInput',
    'NgnItemView',
    'NgnListBox',
    'NgnMessage',
    'NgnPopover',
    'NgnProgress',
    'NgnScroller',
    'NgnScrollerItem',
    'NgnSelect',
    'NgnSlider',
    'NgnSpinner',
    'NgnSplitter',
    'NgnTab',
    'NgnTabs',
    'NgnTable',
    'NgnTag',
    'NgnTooltip',
  ];

  // Load and destroy components multiple times
  for (let i = 0; i < ITERATIONS; i++) {
    await test.step(`Iteration ${i + 1}/${ITERATIONS}: Load and destroy components`, async () => {
      // Show components
      await page.evaluate(() => {
        const component = (window as any).__leak_test_component;
        if (component && component.setShow) {
          component.setShow(true);
        }
      });

      // Wait for components to render
      await page.waitForTimeout(100);

      // Hide/destroy components
      await page.evaluate(() => {
        const component = (window as any).__leak_test_component;
        if (component && component.setShow) {
          component.setShow(false);
        }
      });

      // Wait for components to be destroyed
      await page.waitForTimeout(100);
    });
  }

  const leakResult = await forceGcAndCheckForLeaks({
    client,
    page,
    componentClassNames,
  });

  // Log results
  console.log(`Completed ${ITERATIONS} iterations of component load/destroy cycles`);
  console.log(`Total nodes in heap: ${leakResult.totalNodes}`);
  console.log(`Component instances found in heap: ${leakResult.foundComponents.length}`);

  // Report which components were found (potential leaks)
  if (leakResult.foundComponents.length > 0) {
    const uniqueComponents = [...new Set(leakResult.foundComponents)];
    console.warn(
      `⚠️  Potential memory leaks detected! Found ${leakResult.foundComponents.length} instances of component classes still in memory:`
    );
    console.warn(`Unique component classes: ${uniqueComponents.join(', ')}`);
    console.warn(`Total instances: ${leakResult.foundComponents.length}`);

    // Fail the test if components are still in memory
    expect(
      leakResult.foundComponents.length,
      `Expected 0 component instances in memory after GC, but found ${leakResult.foundComponents.length}. ` +
        `Components found: ${uniqueComponents.join(', ')}`
    ).toBe(0);
  } else {
    console.log('✅ No component class instances found in heap after GC');
  }

  // Cleanup
  await client.detach();
});
