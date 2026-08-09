import { defineConfig } from 'awesome-publish';
import root from '../../awesome-publish.config.ts';

// Source package.json is already the publish manifest (main: ./dist/index.js);
// ship the compiled dist/ folder.
export default defineConfig({ ...root, publishFiles: ['dist', 'README.md'] });
