import { assertType, describe, it } from 'vitest';

import type { AppliedThemeClassCfg } from '@ngneers/controls/api/ng';
import type { DepClass, NgnPassthrough } from '@ngneers/controls/base';

/**
 * Compile-time regression tests for the passthrough type surface. These assert
 * that valid keys type-check and invalid keys are compile errors — for the
 * public `[pt]` input (`NgnPassthrough`) and the internal `[ptClass]` /
 * `[ptDep]` directive inputs (`AppliedThemeClassCfg` / `DepClass`). They run
 * under the spec typecheck (`ng test` / tsconfig.spec.json); a `@ts-expect-error`
 * that stops being an error fails the build.
 */
describe('passthrough typing', () => {
  describe('public API — NgnPassthrough (the [pt] input)', () => {
    it('accepts own scope classes and per-instance dependency slots', () => {
      assertType<NgnPassthrough<'calendar'>>({
        root: { $classes: 'rounded-xl' }, // own scope class
        day: { $styles: { color: 'red' } }, // own scope class
        'current-month': { root: { $classes: 'ring-1' } }, // a select instance slot
        previous: { root: { $styles: { color: 'red' } } }, // a button instance slot
      });
    });

    it('is recursive — a slot carries the child control own slots (grandchild)', () => {
      // `current-month` is a select; a select exposes a `list-box` slot.
      assertType<NgnPassthrough<'calendar'>>({
        'current-month': { 'list-box': { root: { $classes: 'x' } } },
      });
    });

    it('rejects an unknown top-level key', () => {
      // @ts-expect-error 'bogus' is neither a calendar scope class nor a slot
      assertType<NgnPassthrough<'calendar'>>({ bogus: { $classes: 'x' } });
    });

    it('rejects an unknown key nested inside a slot', () => {
      // @ts-expect-error 'bogus' is not a scope class of the nested select
      assertType<NgnPassthrough<'calendar'>>({ 'current-month': { bogus: {} } });
    });

    it('rejects an invalid PassthroughValue key', () => {
      // @ts-expect-error '$nope' is not one of $styles/$attributes/$classes/$listeners
      assertType<NgnPassthrough<'calendar'>>({ root: { $nope: 'x' } });
    });

    it('excludes projected slots from [pt]', () => {
      // own classes are accepted
      assertType<NgnPassthrough<'inputField'>>({ root: { $classes: 'x' } });
      // input-field projects its <input> via <ng-content>, so the `input` slot
      // has no host to forward to and is excluded from the pt type.
      // @ts-expect-error 'input' is a projected dependency, not a pt key
      assertType<NgnPassthrough<'inputField'>>({ input: { root: {} } });
    });
  });

  describe('internal — [ptClass] (AppliedThemeClassCfg): only the parent (ptInt) control classes', () => {
    it('accepts the parent own scope classes, as string or object form', () => {
      assertType<AppliedThemeClassCfg<'calendar'>>('root');
      assertType<AppliedThemeClassCfg<'calendar'>>('day');
      assertType<AppliedThemeClassCfg<'calendar'>>({ root: true, invalid: () => true });
    });

    it('rejects a class that does not belong to the parent control', () => {
      // @ts-expect-error 'nope' is not a calendar class
      assertType<AppliedThemeClassCfg<'calendar'>>('nope');
      // @ts-expect-error 'list-box' belongs to select, not calendar
      assertType<AppliedThemeClassCfg<'calendar'>>('list-box');
    });
  });

  describe('internal — [ptDep] (DepClass): only the parent dependency-slot names', () => {
    it('accepts declared, non-projected dependency slot names', () => {
      assertType<DepClass<'calendar'>>('current-month');
      assertType<DepClass<'calendar'>>('previous');
      assertType<DepClass<'calendar'>>('trigger-icon');
    });

    it('rejects the parent own (non-dependency) scope classes', () => {
      // @ts-expect-error 'root' is an own scope class, not a dependency slot
      assertType<DepClass<'calendar'>>('root');
      // @ts-expect-error 'day' is an own scope class, not a dependency slot
      assertType<DepClass<'calendar'>>('day');
    });

    it('rejects an unknown name', () => {
      // @ts-expect-error not a calendar dependency
      assertType<DepClass<'calendar'>>('bogus');
    });

    it('excludes projected dependencies from [ptDep]', () => {
      // input-field only dependency (input) is projected — no valid [ptDep] target.
      // @ts-expect-error 'input' is a projected dependency, not a [ptDep] target
      assertType<DepClass<'inputField'>>('input');
    });
  });
});
