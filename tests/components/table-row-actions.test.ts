import test, { expect } from '@playwright/test';
import { expectNoA11yViolations } from '../helper/axe';
import { loadComponent, evalValue } from '../helper/load-component';

const ROWS = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

const TEMPLATE = `
  <ngn-table #table style="height: 300px" [rows]="inputs().rows" [fieldId]="'id'">
    <ng-template #header>
      <tr ngnTableHeadTr>
        <th [ngnTableTh]="table.column('id')">ID</th>
        <th [ngnTableTh]="table.column('name')">Name</th>
      </tr>
    </ng-template>
    <ng-template #body let-row [ngnTemplate]="table.templateTypes.body">
      <tr
        [ngnTableBodyTr]="row"
        [ngnTableRowActions]="inputs().actions"
        [ngnTableRowActionsInline]="false"
      >
        <td ngnTableTd>{{ row.data.id }}</td>
        <td ngnTableTd>{{ row.data.name }}</td>
      </tr>
    </ng-template>
  </ngn-table>
`;

const INLINE_TEMPLATE = TEMPLATE.replace('[ngnTableRowActionsInline]="false"', '');

const BAR_TEMPLATE = `
  <ngn-table-row-actions-bar [actions]="inputs().actions" />
`;

const SELECTION_TEMPLATE = `
  <ngn-table
    #table
    style="height: 300px"
    [rows]="inputs().rows"
    [fieldId]="'id'"
    [selectionMode]="inputs().selectionMode"
  >
    <ng-template #header>
      <tr ngnTableHeadTr>
        <th [ngnTableTh]="table.column('id')">ID</th>
        <th [ngnTableTh]="table.column('name')">Name</th>
      </tr>
    </ng-template>
    <ng-template #body let-row [ngnTemplate]="table.templateTypes.body">
      <tr [ngnTableBodyTr]="row" [ngnTableRowActions]="inputs().actions">
        <td ngnTableTd>{{ row.data.id }}</td>
        <td ngnTableTd>{{ row.data.name }}</td>
      </tr>
    </ng-template>
  </ngn-table>
`;

/** Reads the callback log recorded by action callbacks in the page. */
function calls(page: import('@playwright/test').Page) {
  return page.evaluate(() => (window as unknown as { __calls?: string[] }).__calls ?? []);
}

test('mouse: context menu, inline bar, and disabling inline', async ({ page }) => {
  await test.step('right-click opens the menu and activating an item runs its callback', async () => {
    await loadComponent(
      page,
      { template: TEMPLATE, imports: ['tableModule', 'ngnTemplate'] },
      {
        inputs: {
          rows: ROWS,
          actions: evalValue(
            "[{ id: 'edit', label: 'Edit', testId: 'act-edit', callback: () => { (window.__calls ??= []).push('edit'); } }]"
          ),
        },
      }
    );

    const firstRow = page.locator('tbody tr[role="row"]').nth(0);
    // Dispatch the `contextmenu` event directly rather than
    // `click({ button: 'right' })`: WebKit under Playwright does not reliably
    // fire `contextmenu` from a synthetic right-click, which is a test-harness
    // quirk, not a product difference.
    await firstRow.dispatchEvent('contextmenu', { button: 2, clientX: 40, clientY: 40 });

    const menuItem = page.getByText('Edit').first();
    await expect(menuItem).toBeVisible();

    await menuItem.click();
    expect(await calls(page)).toContain('edit');
  });

  await test.step('inline bar renders, reveals on hover, and clicking an action runs its callback', async () => {
    await loadComponent(
      page,
      { template: INLINE_TEMPLATE, imports: ['tableModule', 'ngnTemplate'] },
      {
        inputs: {
          rows: ROWS,
          actions: evalValue(
            "[{ id: 'edit', label: 'Edit', icon: 'edit', testId: 'inline-edit', callback: () => { (window.__calls ??= []).push('edit'); } }]"
          ),
        },
      }
    );

    const firstRow = page.locator('tbody tr[role="row"]').nth(0);
    await firstRow.hover();
    const btn = firstRow.locator('[data-test-id="inline-edit"]');
    await expect(btn).toBeVisible();
    await btn.click();

    // Callback ran and the bar stays mounted after the action.
    expect(await calls(page)).toContain('edit');
    await expect(firstRow.locator('ngn-table-row-actions-bar')).toHaveCount(1);
  });

  await test.step('inline can be disabled without affecting the context menu', async () => {
    await loadComponent(
      page,
      { template: TEMPLATE, imports: ['tableModule', 'ngnTemplate'] },
      { inputs: { rows: ROWS, actions: [{ id: 'edit', label: 'Edit', testId: 'x' }] } }
    );
    await expect(page.locator('ngn-table-row-actions-bar')).toHaveCount(0);
  });
});

test('inline bar component: rendering, accessible names, and submenus', async ({ page }) => {
  await test.step('renders one button per action with an accessible name', async () => {
    await loadComponent(
      page,
      { template: BAR_TEMPLATE, imports: ['tableModule'] },
      {
        inputs: {
          actions: [
            { id: 'edit', label: 'Edit', icon: 'edit', testId: 'bar-edit' },
            { id: 'del', label: 'Delete', icon: 'delete', testId: 'bar-del' },
          ],
        },
      }
    );

    await expect(page.locator('ngn-table-row-actions-bar button')).toHaveCount(2);
    await expect(page.locator('[data-test-id="bar-edit"]')).toHaveAttribute('aria-label', 'Edit');
  });

  await test.step('an action with children opens a submenu anchored to its button', async () => {
    await loadComponent(
      page,
      { template: BAR_TEMPLATE, imports: ['tableModule'] },
      {
        inputs: {
          actions: [
            {
              id: 'more',
              label: 'More',
              icon: 'more',
              testId: 'bar-more',
              children: [{ id: 'child', label: 'Child action', testId: 'bar-child' }],
            },
          ],
        },
      }
    );

    await page.locator('[data-test-id="bar-more"]').click();
    const menuItem = page
      .locator('[data-test-id="bar-child"]')
      .or(page.getByText('Child action'))
      .first();
    await expect(menuItem).toBeVisible();
  });
});

test('keyboard: roving focus, activation, and menu triggers (no selection mode)', async ({
  page,
}) => {
  const twoActions = [
    { id: 'edit', label: 'Edit', icon: 'edit', testId: 'kb-edit' },
    { id: 'del', label: 'Delete', icon: 'delete', testId: 'kb-del' },
  ];

  await test.step('arrows enter/move/exit the action bar and Escape backs out', async () => {
    await loadComponent(
      page,
      { template: INLINE_TEMPLATE, imports: ['tableModule', 'ngnTemplate'] },
      { inputs: { rows: ROWS, actions: twoActions } }
    );

    const table = page.locator('ngn-table table[role="grid"]');
    const firstRow = page.locator('tbody tr[role="row"]').nth(0);
    await table.focus();

    // ArrowDown highlights the row (focused-row), but not yet in the actions.
    await page.keyboard.press('ArrowDown');
    await expect(firstRow).toHaveClass(/focused-row|table-focused-row/);
    await expect(firstRow).not.toHaveClass(/active-row|table-active-row/);

    // ArrowRight enters the bar → first action focused, active-row set.
    await page.keyboard.press('ArrowRight');
    await expect(firstRow.locator('[data-test-id="kb-edit"]')).toBeFocused();
    await expect(firstRow).toHaveClass(/active-row|table-active-row/);

    // ArrowRight/ArrowLeft move between actions.
    await page.keyboard.press('ArrowRight');
    await expect(firstRow.locator('[data-test-id="kb-del"]')).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(firstRow.locator('[data-test-id="kb-edit"]')).toBeFocused();

    // ArrowLeft off the first action returns to row navigation (table focused).
    await page.keyboard.press('ArrowLeft');
    await expect(table).toBeFocused();

    // Re-enter, then Escape backs out to the row.
    await page.keyboard.press('ArrowRight');
    await expect(firstRow.locator('[data-test-id="kb-edit"]')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(firstRow.locator('[data-test-id="kb-edit"]')).not.toBeFocused();
    await expect(firstRow).not.toHaveClass(/active-row|table-active-row/);
  });

  await test.step('Enter on a focused action activates it without opening the context menu', async () => {
    await loadComponent(
      page,
      { template: INLINE_TEMPLATE, imports: ['tableModule', 'ngnTemplate'] },
      {
        inputs: {
          rows: ROWS,
          actions: [{ id: 'edit', label: 'Edit', icon: 'edit', testId: 'kb-enter-edit' }],
        },
      }
    );

    const table = page.locator('ngn-table table[role="grid"]');
    const firstRow = page.locator('tbody tr[role="row"]').nth(0);
    await table.focus();
    await page.keyboard.press('ArrowDown');
    // Wait for the row to become active (which reveals its inline bar) before
    // entering the actions — otherwise ArrowRight can run focusFirst() while the
    // bar is still hidden/unfocusable.
    await expect(firstRow).toHaveClass(/focused-row|table-focused-row/);
    await page.keyboard.press('ArrowRight');
    const btn = firstRow.locator('[data-test-id="kb-enter-edit"]');
    await expect(btn).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(page.locator('[role="menu"]')).toHaveCount(0);
    await expect(btn).toBeVisible();
  });

  await test.step('ContextMenu and Shift+F10 open the menu on the active row', async () => {
    for (const key of ['ContextMenu', 'Shift+F10']) {
      await loadComponent(
        page,
        { template: TEMPLATE, imports: ['tableModule', 'ngnTemplate'] },
        { inputs: { rows: ROWS, actions: [{ id: 'edit', label: 'Edit', testId: 'kb-menu' }] } }
      );
      await page.locator('ngn-table table[role="grid"]').focus();
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press(key);
      await expect(page.getByText('Edit').first()).toBeVisible();
    }
  });

  await test.step('the keyboard menu trigger works even when right-click (context) is disabled', async () => {
    await loadComponent(
      page,
      {
        template: TEMPLATE.replace(
          '[ngnTableRowActionsInline]="false"',
          '[ngnTableRowActionsInline]="false" [ngnTableRowActionsContext]="false"'
        ),
        imports: ['tableModule', 'ngnTemplate'],
      },
      { inputs: { rows: ROWS, actions: [{ id: 'edit', label: 'Edit', testId: 'kb-ctx-off' }] } }
    );
    await page.locator('ngn-table table[role="grid"]').focus();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ContextMenu');
    await expect(page.getByText('Edit').first()).toBeVisible();
  });
});

test('keyboard: row actions coexist with selection mode', async ({ page }) => {
  const oneAction = [{ id: 'edit', label: 'Edit', icon: 'edit', testId: 'sel-edit' }];

  await test.step('single mode — arrows select + move rows, and entering the bar never corrupts selection', async () => {
    await loadComponent(
      page,
      { template: SELECTION_TEMPLATE, imports: ['tableModule', 'ngnTemplate'] },
      { inputs: { rows: ROWS, selectionMode: 'single', actions: oneAction } }
    );

    const table = page.locator('ngn-table table[role="grid"]');
    const rows = page.locator('tbody tr[role="row"]');
    await table.focus();

    // ArrowDown moves to row 0 and, in single mode, selects it.
    await page.keyboard.press('ArrowDown');
    await expect(rows.nth(0)).toHaveClass(/focused-row/);
    await expect(rows.nth(0)).toHaveAttribute('aria-selected', 'true');

    // ArrowRight enters the action bar.
    await page.keyboard.press('ArrowRight');
    const btn = rows.nth(0).locator('[data-test-id="sel-edit"]');
    await expect(btn).toBeFocused();
    await expect(rows.nth(0)).toHaveClass(/active-row/);

    // ArrowDown while in the bar must NOT fall through to selection: the
    // selected row stays row 0 and focus stays on the action button.
    await page.keyboard.press('ArrowDown');
    await expect(rows.nth(0)).toHaveAttribute('aria-selected', 'true');
    await expect(rows.nth(1)).not.toHaveAttribute('aria-selected', 'true');
    await expect(btn).toBeFocused();

    // ArrowLeft exits the bar back to the table, then ArrowDown advances the
    // selection to row 1 (row navigation resumes and still drives selection).
    await page.keyboard.press('ArrowLeft');
    await expect(table).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(rows.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(rows.nth(0)).toHaveAttribute('aria-selected', 'false');
  });

  await test.step('single mode — mouse-click select then ArrowDown advances from the clicked row', async () => {
    // Regression (Task 9 review): a mouse click resets focusedRowIndex to null
    // (TableSelectionModel.handleRowClick). In single mode, selection's onKeyDown
    // resolves that null back to the selected row before moving; the row-actions
    // nav model must delegate ArrowUp/Down to it (rather than recomputing the
    // start index) so ArrowDown advances past the clicked row instead of jumping
    // to row 0.
    const fourRows = [
      { id: 1, name: 'Row 0' },
      { id: 2, name: 'Row 1' },
      { id: 3, name: 'Row 2' },
      { id: 4, name: 'Row 3' },
    ];
    await loadComponent(
      page,
      { template: SELECTION_TEMPLATE, imports: ['tableModule', 'ngnTemplate'] },
      {
        inputs: {
          rows: fourRows,
          selectionMode: 'single',
          actions: [{ id: 'edit', label: 'Edit', icon: 'edit', testId: 'click-arrow-edit' }],
        },
      }
    );

    const rows = page.locator('tbody tr[role="row"]');
    await rows.nth(2).click();
    await expect(rows.nth(2)).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('ArrowDown');
    await expect(rows.nth(3)).toHaveAttribute('aria-selected', 'true');
    await expect(rows.nth(2)).toHaveAttribute('aria-selected', 'false');
    await expect(rows.nth(0)).toHaveAttribute('aria-selected', 'false');
  });

  await test.step('multi mode — ArrowDown moves focus only, Space toggles, and Space inside the bar activates the action instead of toggling', async () => {
    await loadComponent(
      page,
      { template: SELECTION_TEMPLATE, imports: ['tableModule', 'ngnTemplate'] },
      { inputs: { rows: ROWS, selectionMode: 'multi', actions: oneAction } }
    );

    const table = page.locator('ngn-table table[role="grid"]');
    const rows = page.locator('tbody tr[role="row"]');
    await table.focus();

    // In multi mode ArrowDown moves focus without auto-selecting.
    await page.keyboard.press('ArrowDown');
    await expect(rows.nth(0)).toHaveClass(/focused-row/);
    await expect(rows.nth(0)).toHaveAttribute('aria-selected', 'false');

    // Space toggles selection of the current row.
    await page.keyboard.press(' ');
    await expect(rows.nth(0)).toHaveAttribute('aria-selected', 'true');

    // Enter the bar; Space now activates the focused button, not selection —
    // the row's selected state must remain unchanged and no menu opens.
    await page.keyboard.press('ArrowRight');
    await expect(rows.nth(0).locator('[data-test-id="sel-edit"]')).toBeFocused();
    await page.keyboard.press(' ');
    await expect(rows.nth(0)).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('[role="menu"]')).toHaveCount(0);
  });
});

test('inline actions bound to a fresh array each change-detection do not trigger NG0103', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(String(err)));

  // A METHOD CALL in the template returns a NEW array on every change-detection
  // pass (unlike an inline `[...]` literal, which Angular memoizes via
  // pureFunction). This mirrors a real consumer binding
  // `[ngnTableRowActions]="actionsFor(row.data)"`. Inline bar is ON (default),
  // so the directive reacts to actions() changes. `mk` is an eval-provided
  // function that returns a fresh array each call.
  const template = `
    <ngn-table #table style="height: 300px" [rows]="inputs().rows" [fieldId]="'id'">
      <ng-template #header>
        <tr ngnTableHeadTr>
          <th [ngnTableTh]="table.column('id')">ID</th>
          <th [ngnTableTh]="table.column('name')">Name</th>
        </tr>
      </ng-template>
      <ng-template #body let-row [ngnTemplate]="table.templateTypes.body">
        <tr [ngnTableBodyTr]="row" [ngnTableRowActions]="inputs().mk(row.data)">
          <td ngnTableTd>{{ row.data.id }}</td>
          <td ngnTableTd>{{ row.data.name }}</td>
        </tr>
      </ng-template>
    </ngn-table>
  `;

  await loadComponent(
    page,
    { template, imports: ['tableModule', 'ngnTemplate'] },
    {
      inputs: {
        rows: ROWS,
        mk: evalValue("(d) => [{ id: 'edit', label: 'Edit ' + d.name }]"),
      },
    }
  );

  await expect(page.locator('tbody tr[role="row"]')).toHaveCount(ROWS.length);
  expect(errors.join('\n')).not.toContain('NG0103');
});

test('keyboard: tabbing out of the action bar does not freeze row navigation', async ({ page }) => {
  await loadComponent(
    page,
    { template: INLINE_TEMPLATE, imports: ['tableModule', 'ngnTemplate'] },
    { inputs: { rows: ROWS, actions: [{ id: 'edit', label: 'Edit', icon: 'edit' }] } }
  );

  const grid = page.locator('ngn-table table[role="grid"]');
  const rows = page.locator('tbody tr[role="row"]');
  await grid.focus();

  // Enter the first row's action bar, then leave it with Tab instead of Escape.
  await page.keyboard.press('ArrowDown');
  await expect(rows.nth(0)).toHaveClass(/focused-row/);
  await page.keyboard.press('ArrowRight');
  await expect(rows.nth(0)).toHaveClass(/active-row/);
  // Same reason as above: Tab must start from the action button, not the grid.
  await expect(rows.nth(0).locator('ngn-table-row-actions-bar button').first()).toBeFocused();
  await page.keyboard.press('Tab');

  // Back on the grid, the arrows must still move the current row.
  await grid.focus();
  await expect(rows.nth(0)).not.toHaveClass(/active-row/);
  await page.keyboard.press('ArrowDown');
  await expect(rows.nth(1)).toHaveClass(/focused-row/);
  await expect(rows.nth(0)).not.toHaveClass(/focused-row/);
});

test('keyboard: tabbing into an action bar adopts its row as the current one', async ({ page }) => {
  await loadComponent(
    page,
    { template: INLINE_TEMPLATE, imports: ['tableModule', 'ngnTemplate'] },
    { inputs: { rows: ROWS, actions: [{ id: 'edit', label: 'Edit', icon: 'edit' }] } }
  );

  const rows = page.locator('tbody tr[role="row"]');
  // Hover reveals the second row's bar, then focus its button directly.
  await rows.nth(1).hover();
  await rows.nth(1).locator('button').first().focus();
  await expect(rows.nth(1)).toHaveClass(/active-row/);

  // Escape leaves the bar and navigation continues from that row.
  await page.keyboard.press('Escape');
  await page.keyboard.press('ArrowUp');
  await expect(rows.nth(0)).toHaveClass(/focused-row/);
});

test('keyboard: leaving the table forward hides the action bar', async ({ page }) => {
  await loadComponent(
    page,
    {
      // A focusable element after the table, so Tab has somewhere to go.
      template: `${INLINE_TEMPLATE}<button type="button" data-testid="after">after</button>`,
      imports: ['tableModule', 'ngnTemplate'],
    },
    { inputs: { rows: ROWS, actions: [{ id: 'edit', label: 'Edit', icon: 'edit' }] } }
  );

  const rows = page.locator('tbody tr[role="row"]');
  const bar = rows.nth(0).locator('ngn-table-row-actions-bar');
  await page.locator('ngn-table table[role="grid"]').focus();
  await page.keyboard.press('ArrowDown');
  await expect(rows.nth(0)).toHaveClass(/focused-row/);
  await page.keyboard.press('ArrowRight');
  await expect(bar).toBeVisible();
  // Focus has to be inside the bar before tabbing: a visible bar alone does not
  // mean focusFirst() has run, and Tab from the grid would land on the action
  // button instead of leaving the table.
  await expect(bar.locator('button').first()).toBeFocused();

  // Tab forward past the bar and out of the table.
  await page.keyboard.press('Tab');
  await expect(page.getByTestId('after')).toBeFocused();
  await expect(bar).toBeHidden();
  await expect(rows.nth(0)).not.toHaveClass(/active-row/);
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(
    page,
    { template: INLINE_TEMPLATE, imports: ['tableModule', 'ngnTemplate'] },
    {
      inputs: {
        rows: ROWS,
        actions: evalValue(
          "[{ id: 'edit', label: 'Edit', testId: 'act-edit', callback: () => {} }]"
        ),
      },
    }
  );

  await expect(page.locator('tbody tr[role="row"]')).toHaveCount(ROWS.length);
  await expectNoA11yViolations(page);
});
