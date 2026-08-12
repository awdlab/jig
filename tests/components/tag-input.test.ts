import { JigTagInputHarness } from '@awdlab/jig-playwright';
import test, { expect } from '@playwright/test';

import { expectNoA11yViolations } from '../helper/axe';
import { loadComponent } from '../helper/load-component';
import { expectScreenshot } from '../helper/screenshot';

// The field's <label for> needs the same id the tag input puts on its text field:
// jig-input-field only auto-assigns its inputId when the projected control *is* an
// <input>, which a composite control never is.
const TEMPLATE = `
  <jig-input-field
    class="page-center"
    style="width: 24rem"
    [label]="'Labels'"
    [labelKind]="'on'"
    inputId="tags"
  >
    <jig-tag-input
      inputId="tags"
      [delimiters]="inputs().delimiters"
      [allowDuplicates]="inputs().allowDuplicates"
      [maxTags]="inputs().maxTags"
      [minTagLength]="inputs().minTagLength"
      [maxTagLength]="inputs().maxTagLength"
      [multiline]="inputs().multiline"
      [suggestions]="inputs().suggestions"
      [suggestionsDebounce]="0"
      [disabled]="inputs().disabled"
      [readonly]="inputs().readonly"
      (valueChange)="output('valueChange', $event)"
      (rejected)="output('rejected', $event)"
    />
  </jig-input-field>
`;

const BASE_INPUTS = {
  delimiters: ',',
  allowDuplicates: false,
  maxTags: undefined,
  minTagLength: undefined,
  maxTagLength: undefined,
  multiline: false,
  suggestions: undefined,
  disabled: false,
  readonly: false,
};

function load(page: Parameters<typeof loadComponent>[0], inputs: Record<string, unknown> = {}) {
  return loadComponent(
    page,
    { template: TEMPLATE, imports: ['inputField', 'tagInput'] },
    { inputs: { ...BASE_INPUTS, ...inputs } }
  );
}

test('commit pipeline', async ({ page }) => {
  const handle = await load(page);
  const tags = new JigTagInputHarness(page.locator('jig-tag-input'));

  await test.step('starts with no tags', async () => {
    await tags.expectTags([]);
    expect(await handle.getOutputLog()).toEqual({});
  });

  await test.step('Enter commits', async () => {
    await tags.type('alpha');
    await page.keyboard.press('Enter');
    await tags.expectTags(['alpha']);
    expect(await handle.getOutputLogAndClear()).toEqual({ valueChange: [['alpha']] });
  });

  await test.step('a delimiter commits and never lands in the value', async () => {
    await tags.input.pressSequentially('beta,');
    await tags.expectTags(['alpha', 'beta']);
    await tags.input.expectValue('');
    expect(await handle.getOutputLogAndClear()).toEqual({ valueChange: [['alpha', 'beta']] });
  });

  await test.step('a duplicate is refused and the text stays', async () => {
    await tags.input.pressSequentially('alpha');
    await page.keyboard.press('Enter');
    await tags.expectTags(['alpha', 'beta']);
    await tags.input.expectValue('alpha');
    await tags.expectAnnouncement('alpha is already added');
    expect(await handle.getOutputLogAndClear()).toEqual({
      rejected: [{ text: 'alpha', reason: 'duplicate' }],
    });
  });

  await test.step('Backspace on an empty field removes the last tag', async () => {
    await tags.input.clear();
    await page.keyboard.press('Backspace');
    await tags.expectTags(['alpha']);
    await tags.expectAnnouncement('beta removed');
    expect(await handle.getOutputLogAndClear()).toEqual({ valueChange: [['alpha']] });
  });

  await test.step('removing the last tag returns the value to null', async () => {
    await page.keyboard.press('Backspace');
    await tags.expectTags([]);
    expect(await handle.getOutputLogAndClear()).toEqual({ valueChange: [null] });
  });
});

test('constraints', async ({ page }) => {
  const handle = await load(page, { maxTags: 2, minTagLength: 3, maxTagLength: 6 });
  const tags = new JigTagInputHarness(page.locator('jig-tag-input'));

  await test.step('text below minTagLength is refused', async () => {
    await tags.type('ab');
    await page.keyboard.press('Enter');
    await tags.expectTags([]);
    await tags.input.expectValue('ab');
    await tags.expectAnnouncement('Tags must be at least 3 characters');
    expect(await handle.getOutputLogAndClear()).toEqual({
      rejected: [{ text: 'ab', reason: 'tooShort' }],
    });
  });

  await test.step('maxTagLength is not typeable', async () => {
    await tags.input.clear();
    await tags.input.pressSequentially('abcdefghij');
    await tags.input.expectValue('abcdef');
  });

  await test.step('the field turns readonly at maxTags', async () => {
    await page.keyboard.press('Enter');
    await tags.input.pressSequentially('second');
    await page.keyboard.press('Enter');
    await tags.expectTags(['abcdef', 'second']);
    await expect(tags.input.locator).toHaveAttribute('readonly', '');
    await expect(tags.locator).toHaveClass(/jig-tagInput-full/);
  });
});

// Firefox drops `clipboardData` from a synthesised ClipboardEvent, so the control
// never sees the payload. The handler's logic is covered in tag-input.spec.ts.
test('paste splitting', async ({ page, browserName }) => {
  test.skip(
    browserName === 'firefox',
    'Firefox ignores clipboardData on a synthesised ClipboardEvent'
  );
  await load(page);
  const tags = new JigTagInputHarness(page.locator('jig-tag-input'));

  await tags.input.locator.click();
  // Synthesised rather than using the clipboard, which needs a permission grant.
  await tags.input.locator.evaluate(input => {
    const data = new DataTransfer();
    data.setData('text', 'one,two\nthree');
    input.dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, bubbles: true }));
  });

  await tags.expectTags(['one', 'two']);
  await tags.input.expectValue('three');
});

test('layout modes', async ({ page }, testInfo) => {
  const handle = await load(page);
  const tags = new JigTagInputHarness(page.locator('jig-tag-input'));

  await tags.type('alpha,beta,gamma,delta,epsilon,zeta,');
  await tags.expectTags(['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta']);
  await page.mouse.move(0, 0);

  await test.step('single line scrolls horizontally', async () => {
    await expect(tags.tagList).toHaveClass(/jig-tagInput-single-line/);
    const overflow = await tags.field.evaluate(el => el.scrollWidth > el.clientWidth);
    expect(overflow).toBe(true);
    await expectScreenshot(page, testInfo, 'single-line');
  });

  await test.step('dragging the row scrolls it, and holding past the edge keeps it there', async () => {
    const box = (await tags.field.boundingBox())!;
    const y = box.y + box.height / 2;
    const max = await tags.field.evaluate(el => el.scrollWidth - el.clientWidth);

    await page.mouse.move(box.x + box.width - 20, y);
    await page.mouse.down();
    await page.mouse.move(box.x + 20, y, { steps: 8 });
    await expect.poll(() => tags.field.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);

    // Past the edge the browser would autoscroll a text selection back the other way.
    await page.mouse.move(box.x - 120, y, { steps: 6 });
    await page.waitForTimeout(300);
    expect(await tags.field.evaluate(el => Math.round(el.scrollLeft))).toBe(max);
    await page.mouse.up();
    await page.mouse.move(0, 0);
  });

  await test.step('multiline wraps and grows', async () => {
    const before = (await tags.locator.boundingBox())!.height;
    await handle.setInputs({ multiline: true });
    await expect(tags.tagList).toHaveClass(/jig-tagInput-multiline/);

    const after = (await tags.locator.boundingBox())!.height;
    expect(after).toBeGreaterThan(before);
    const overflow = await tags.field.evaluate(el => el.scrollWidth > el.clientWidth);
    expect(overflow).toBe(false);
    await expectScreenshot(page, testInfo, 'multiline');
  });
});

test('roving tag navigation', async ({ page }) => {
  await load(page);
  const tags = new JigTagInputHarness(page.locator('jig-tag-input'));

  await tags.type('alpha,beta,gamma,');
  await tags.expectTags(['alpha', 'beta', 'gamma']);

  await test.step('ArrowLeft from the caret start enters the row at the last tag', async () => {
    await page.keyboard.press('ArrowLeft');
    await expect(tags.removeButton(2)).toBeFocused();
  });

  await test.step('arrows move between tags', async () => {
    await page.keyboard.press('ArrowLeft');
    await expect(tags.removeButton(1)).toBeFocused();
  });

  await test.step('Delete removes the focused tag and keeps focus in the row', async () => {
    await page.keyboard.press('Delete');
    await tags.expectTags(['alpha', 'gamma']);
    await expect(tags.removeButton(1)).toBeFocused();
  });

  await test.step('Escape returns to the field', async () => {
    await page.keyboard.press('Escape');
    await expect(tags.input.locator).toBeFocused();
  });

  await test.step('clicking a remove button removes that tag', async () => {
    await tags.removeButton(0).click();
    await tags.expectTags(['gamma']);
  });
});

test('suggestions', async ({ page }, testInfo) => {
  const handle = await load(page, { suggestions: ['alpha', 'beta', 'gamma'] });
  const tags = new JigTagInputHarness(page.locator('jig-tag-input'));

  await test.step('opens on focus with an empty field', async () => {
    await tags.input.locator.click();
    await tags.dropdown.expectOpened();
    await expect(tags.input.locator).toHaveAttribute('aria-expanded', 'true');
    await expect(tags.input.locator).toHaveAttribute('aria-controls', 'tags_listbox');
    await expectScreenshot(page, testInfo, 'suggestions-open');
    await expectNoA11yViolations(page);
  });

  await test.step('matches the field width', async () => {
    const fieldBox = await page.locator('jig-input-field').boundingBox();
    const popoverBox = await tags.dropdown.popover.boundingBox();
    expect(Math.round(popoverBox!.width)).toBe(Math.round(fieldBox!.width));
  });

  await test.step('filters by the typed text', async () => {
    await tags.input.pressSequentially('bet');
    await expect(tags.dropdown.listBox.item).toHaveCount(1);
  });

  await test.step('picking keeps the list open and drops the added tag', async () => {
    await tags.dropdown.listBox.scroller.clickItemByText('beta');
    await tags.expectTags(['beta']);
    expect(await handle.getOutputLogAndClear()).toEqual({ valueChange: [['beta']] });
    await tags.dropdown.expectOpened();
    await expect(tags.dropdown.listBox.item).toHaveCount(2);
  });

  await test.step('closes when nothing matches', async () => {
    await tags.input.pressSequentially('zzz');
    await tags.dropdown.expectOpened(false);
  });

  await test.step('stays open across a full click, not just the mousedown', async () => {
    await tags.input.clear();
    await tags.input.locator.evaluate(input => input.blur());
    await tags.dropdown.expectOpened(false);

    // A click is mousedown *and* mouseup: an auto-dismissing popover would close
    // again on the second half of the very click that opened it.
    await tags.input.locator.click();
    await tags.dropdown.expectOpened();
  });

  await test.step('Escape dismisses it without giving up focus', async () => {
    await page.keyboard.press('Escape');
    await tags.dropdown.expectOpened(false);
    await expect(tags.input.locator).toBeFocused();
  });

  await test.step('stays dismissed while typing', async () => {
    await tags.input.pressSequentially('des');
    await tags.dropdown.expectOpened(false);
  });

  await test.step('returns once focus leaves and comes back', async () => {
    await tags.input.clear();
    await tags.input.locator.evaluate(input => input.blur());
    await tags.dropdown.expectOpened(false);

    await tags.input.locator.click();
    await tags.dropdown.expectOpened();
  });
});

test('states and accessibility', async ({ page }, testInfo) => {
  const handle = await load(page);
  const tags = new JigTagInputHarness(page.locator('jig-tag-input'));

  await tags.type('alpha,beta,');
  await page.mouse.move(0, 0);

  await test.step('exposes the combobox contract', async () => {
    await expect(tags.input.locator).toHaveAttribute('role', 'combobox');
    await expect(tags.input.locator).toHaveAttribute('aria-autocomplete', 'list');
    await expect(tags.input.locator).toHaveAttribute('aria-haspopup', 'listbox');
    await expect(tags.liveRegion).toHaveAttribute('aria-live', 'polite');
    await expect(tags.tagList).toHaveAttribute('role', 'list');
    await expect(tags.removeButton(0)).toHaveAttribute('aria-label', 'Remove alpha');
    await expectNoA11yViolations(page);
    await expectScreenshot(page, testInfo, 'default');
  });

  await test.step('readonly hides the remove buttons', async () => {
    await handle.setInputs({ readonly: true });
    await expect(tags.removeButton(0)).toHaveCount(0);
    await expectScreenshot(page, testInfo, 'readonly');
  });

  await test.step('disabled hides them too', async () => {
    await handle.setInputs({ readonly: false, disabled: true });
    await expect(tags.removeButton(0)).toHaveCount(0);
    await expectScreenshot(page, testInfo, 'disabled');
  });
});
