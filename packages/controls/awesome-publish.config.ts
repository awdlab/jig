import { defineConfig } from 'awesome-publish';
import root from '../../awesome-publish.config.ts';

// ng-packagr generates everything in the dist folder, including the required package.json. Publishing from there.
export default defineConfig({ ...root, publishDir: 'dist' });
