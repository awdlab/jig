import type { ControlTemplate, ThemeClasses } from '@awdlab/jig-themes';

export function themeClasses<CT extends ControlTemplate>(template: CT): ThemeClasses<CT> {
  const result = {} as Record<string, unknown>;
  for (const className of template.classNames) {
    result[className] = `.jig-${template.scope}-${className}`;
  }
  for (const dep of template.dependencies ?? []) {
    const childClasses = themeClasses(dep.template);
    // Non-projected deps get a `[ptDep]` marker class (`.jig-{scope}-{depClass}`) applied to
    // the child's host element (see `JigPt`/`apply-theme.ts`'s `d()`). Whether a given child
    // class then lives on that SAME host element or on an element nested inside the child's own
    // template depends on which classNames the child passes as `hostClass` to
    // `injectThemeTemplate` (e.g. list-box binds its own 'root' straight to its host, so marker
    // and 'root' land on one element; input-field reserves a separate 'host' key for its host
    // binding and keeps 'root' on an inner div, so marker and 'root' land on two elements).
    // The theme package has no visibility into that per-component choice, so instead of guessing
    // we match BOTH shapes via `:is()`: compound (same element) or descendant (nested element).
    // Projected deps have no marker (no host the parent controls), so their classes stay raw,
    // matching how `apply-theme.ts` resolves `projected: true` deps directly off the child's own
    // scope.
    result[dep.class] = dep.projected
      ? childClasses
      : scopeByMarker(childClasses, `.jig-${template.scope}-${dep.class}`);
  }
  return result as ThemeClasses<CT>;
}

/**
 * Scopes every selector string in a (possibly nested) theme-classes object to `marker`, matching
 * either a compound (same-element) or descendant (nested-element) relationship — see the
 * `dep.projected` branch above for why both shapes are needed. Recurses into nested dependency
 * objects so grandchild slots are scoped transitively through every ancestor marker.
 */
function scopeByMarker<T>(classes: T, marker: string): T {
  const scoped = {} as Record<string, unknown>;
  for (const [key, value] of Object.entries(classes as Record<string, unknown>)) {
    scoped[key] =
      typeof value === 'string'
        ? `:is(${marker}${value}, ${marker} ${value})`
        : scopeByMarker(value, marker);
  }
  return scoped as T;
}
