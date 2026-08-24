// Default entry point for the theme. Loading it also loads the theme's type augmentation,
// so `kind` / `color` inputs resolve to the theme's literal unions.
// Import from '@awdlab/jig-themes/<theme>/untyped' to opt out (e.g. when an app pulls
// in more than one theme, where conflicting augmentations would otherwise silently clash).
import './theme-types.js';

export * from './index.js';
