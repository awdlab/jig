import { defineConfig } from 'awesome-publish';
import root from '../../awesome-publish.config.ts';

// tools/post-build.ts generates dist/package.json (with exports) — publish from dist/.
export default defineConfig({ ...root, publishDir: 'dist', publishFiles: ['**/*'] });
