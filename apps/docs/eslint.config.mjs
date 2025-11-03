import { getEslintConfig } from '../../configs/eslint.angular.mjs';
import { defineConfig } from 'eslint/config';

export default defineConfig(getEslintConfig('./tsconfig.app.json'));
