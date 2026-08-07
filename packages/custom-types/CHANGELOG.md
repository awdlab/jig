# Changelog

## @ngneers/controls-custom-types 0.0.1-next.1 (2026-08-07)

- `kind` and `color` resolve to the active theme's literal unions again, and importing a theme is all it takes to get there. Two separate defects kept the custom-type mechanic from ever working.

`CustomKind` and `CustomColor` collapsed to `unknown` whenever no augmentation was loaded. `never extends readonly (infer A)[]` matches with no inference candidate, so `A` widened to `unknown`, and the `extends never` guard written to catch that could never fire — a bare `X extends never` does not match `never`. Every `kind`/`color` binding was therefore checked against `unknown`, so `kind="nonsense"` passed anywhere. Both types now guard with `[X] extends [never]` and fall back to `string`.

The theme augmentations were also unreachable. `<theme>/theme-types.d.ts` shipped in the package but nothing pulled it into a consumer's program: no reference from the theme barrel, no `exports` entry to import or reference it by, and it lives under `node_modules`, so app `include` globs miss it. Each theme now ships a `typed.d.ts` barrel that references it, and `@ngneers/controls-themes/<theme>` resolves its types there.

Apps that pull in more than one theme have to opt out for the extra ones via the new `@ngneers/controls-themes/<theme>/untyped` entry point — two augmentations of `NgnThemeTypes` clash, and the first one loaded silently wins. Both entry points resolve to the same runtime module; only the types differ.

Bindings that leaned on the old `unknown` may now fail to compile. `[kind]="null"` is the common one: the input accepts `undefined`, not `null`.

## @ngneers/controls-custom-types 0.0.1-next.0 (2026-07-16)

- Release readiness set up
