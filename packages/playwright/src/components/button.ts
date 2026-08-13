import { buttonControlTemplate } from '@awdlab/jig-themes/templates/button';
import { themeClasses } from '../utils/theme.js';
import { JigHarness } from '../harness.js';

/**
 * `jigButton` sits on a native `<button>`, so the base harness covers it: `click()`,
 * `expectDisabled()`, `expectText()`, `expectFocused()`. `classes` is here for the theme
 * modifiers (`kind-*`, `color-*`) that have no behavioural equivalent.
 */
export class JigButtonHarness extends JigHarness {
  public readonly classes = themeClasses(buttonControlTemplate);
}
