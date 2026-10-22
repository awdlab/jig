# Changelog

Release times are Central European Time (CET/CEST), the project's local time zone.

## @awdlab/jig-custom-types 0.0.1 (2026-08-24 23:47 CEST)

First stable release.

### Fixed

- The package is installable again — it shipped two manifests, and the root one pointed at an `./index.js` one directory down with no `exports` at all.
- Re-exports carry explicit `.js` extensions (`module: nodenext`), so `node16`/`nodenext` resolution works. The package was never covered by the old post-build rewrite script.

## @awdlab/jig-custom-types 0.0.1-next.1 (2026-08-08 01:35 CEST)

### Breaking

- Bindings that leaned on the old `unknown` may stop compiling. `[kind]="null"` is the common one — the input accepts `undefined`, not `null`.

### Fixed

- `CustomKind` and `CustomColor` no longer collapse to `unknown` without an augmentation. `never extends readonly (infer A)[]` matched with no inference candidate and the `extends never` guard could never fire; both now guard with `[X] extends [never]` and fall back to `string`.

## @awdlab/jig-custom-types 0.0.1-next.0 (2026-07-17 01:31 CEST)

- First prerelease: release readiness set up.
