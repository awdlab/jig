import { defineConfig } from 'awesome-publish';
import root from '../../awesome-publish.config.ts';

// ng-packagr emits a complete, ready-to-publish package (with generated
// `exports`) into dist/ — publish from there, not the source package.json.
export default defineConfig({ ...root, publishFiles: ['dist', 'README.md'] });
