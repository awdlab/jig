import { expect, type Locator } from '@playwright/test';
import { themeClasses } from '../utils/theme';
import { treeControlTemplate } from '@ngneers/controls-themes/templates/tree';
import { NgnScrollerHarness } from './scroller';

export class NgnTreeHarness {
  public readonly classes = themeClasses(treeControlTemplate);
  /** All currently rendered nodes (branches and leaves). */
  public readonly node: Locator;
  /** Leaf rows. */
  public readonly item: Locator;
  /** Branch rows (nodes with children). */
  public readonly group: Locator;
  public readonly toggle: Locator;
  public readonly itemSelected: Locator;
  public readonly itemHighlighted: Locator;
  public readonly itemDisabled: Locator;
  public readonly itemExpanded: Locator;
  public readonly checkbox: Locator;
  public readonly empty: Locator;
  public readonly spinner: Locator;
  public readonly scroller: NgnScrollerHarness;

  constructor(public locator: Locator) {
    this.node = locator.locator('[role="treeitem"]');
    this.item = locator.locator(this.classes['item']);
    this.group = locator.locator(this.classes['group']);
    this.toggle = locator.locator(this.classes['toggle']);
    this.itemSelected = locator.locator(this.classes['item-selected']);
    this.itemHighlighted = locator.locator(this.classes['item-highlighted']);
    this.itemDisabled = locator.locator(this.classes['item-disabled']);
    this.itemExpanded = locator.locator(this.classes['item-expanded']);
    this.checkbox = locator.locator(this.classes['item-checkbox']);
    this.empty = locator.locator(this.classes['empty']);
    this.spinner = locator.locator('ngn-spinner');
    this.scroller = new NgnScrollerHarness(locator.locator(this.classes['scroller']));
  }

  /** A single node located by its exact (trimmed, case-insensitive) label. */
  public getNode(text: string): Locator {
    return this.node.filter({ hasText: new RegExp(`^\\s*${text}\\s*$`, 'i') });
  }

  /** A single node located by the `testId` of its item. */
  public getNodeByTestId(testId: string): Locator {
    return this.node.filter({ has: this.locator.locator(`[data-testid="${testId}"]`) });
  }

  public expectNodeCount(count: number): Promise<void> {
    return expect(this.node).toHaveCount(count);
  }

  public expectItemCount(count: number): Promise<void> {
    return expect(this.item).toHaveCount(count);
  }

  public expectGroupCount(count: number): Promise<void> {
    return expect(this.group).toHaveCount(count);
  }

  public expectNodeTexts(texts: string[]): Promise<void> {
    return expect(this.node).toHaveText(texts.map(t => new RegExp(`^\\s*${t}\\s*$`)));
  }

  /** Click a node's row (selects / checks it when selectable). */
  public clickNode(text: string): Promise<void> {
    return this.getNode(text).click();
  }

  /** Click a branch node's expand/collapse toggle. */
  public toggleNode(text: string): Promise<void> {
    return this.getNode(text).locator(this.classes['toggle']).click();
  }

  public expectExpanded(text: string, expanded = true): Promise<void> {
    return expect(this.getNode(text)).toHaveAttribute('aria-expanded', String(expanded));
  }

  public expectSelected(text: string, selected = true): Promise<void> {
    return expect(this.getNode(text)).toHaveAttribute('aria-selected', String(selected));
  }

  public expectChecked(text: string, state: 'true' | 'false' | 'mixed'): Promise<void> {
    return expect(this.getNode(text)).toHaveAttribute('aria-checked', state);
  }

  public expectDisabled(text: string, disabled = true): Promise<void> {
    return disabled
      ? expect(this.getNode(text)).toHaveAttribute('aria-disabled', 'true')
      : expect(this.getNode(text)).not.toHaveAttribute('aria-disabled', 'true');
  }

  /** Assert the tree's `aria-activedescendant` points at the given node. */
  public async expectActiveDescendant(text: string): Promise<void> {
    const id = await this.getNode(text).getAttribute('id');
    await expect(this.locator).toHaveAttribute('aria-activedescendant', id ?? '');
  }
}
