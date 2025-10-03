import { getEslintConfig } from '../../configs/eslint.angular.mjs';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig(getEslintConfig('./tsconfig.app.json'), globalIgnores(['ng-doc/**/*']));
