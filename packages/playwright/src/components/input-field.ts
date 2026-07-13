import type { Locator } from '@playwright/test';
import { themeClasses } from '../utils/theme';
import { inputFieldControlTemplate } from '@ngneers/controls-themes/templates/input-field';

export class NgnInputFieldHarness<T extends Record<string, any> = Record<string, any>> {
  public readonly classes = themeClasses(inputFieldControlTemplate);

  public readonly children: T;

  constructor(
    public locator: Locator,
    children?: (locator: Locator) => T
  ) {
    this.children = children?.(locator) ?? ({} as T);
  }
}
