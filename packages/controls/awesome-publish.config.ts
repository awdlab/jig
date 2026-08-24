import { defineConfig } from 'awesome-publish';
import root from '../../awesome-publish.config.ts';

// ng-packagr generates everything in the dist folder, including the required package.json.
// Publishing from there, so publishFiles is a copy filter inside dist — not root's ['dist'].
export default defineConfig({ ...root, publishDir: 'dist', publishFiles: ['**/*'] });
