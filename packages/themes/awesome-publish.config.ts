import { defineConfig } from 'awesome-publish';
import root from '../../awesome-publish.config.ts';

// tools/post-build.ts generates dist/package.json (with exports) — publish from dist/.
// `publishDir` makes publishFiles a copy filter *relative to* dist/, so the root
// config's `publishFiles: ['dist']` must not be inherited here — spread in, it looks
// for dist/dist and matches nothing, and the package would publish empty. '**/*' is
// the whole built directory, which is what this package ships.
export default defineConfig({ ...root, publishDir: 'dist', publishFiles: ['**/*'] });
