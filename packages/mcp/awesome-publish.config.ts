import { defineConfig } from 'awesome-publish';
import root from '../../awesome-publish.config.ts';

// Source package.json is the manifest (bin: dist/index.js). Ship the compiled
// server plus its runtime data/skills, matching the source `files` field.
export default defineConfig({ ...root, publishFiles: ['dist', 'data', 'skills', 'README.md'] });
