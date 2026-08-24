import { defineConfig } from 'awesome-publish';
import root from '../../awesome-publish.config.ts';

// The source package.json is the publish manifest (main/exports point into dist/).
export default defineConfig({ ...root, publishFiles: ['dist', 'README.md'] });
