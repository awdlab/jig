import { getEslintConfig } from '../configs/eslint.common.mjs';
import { fileURLToPath } from 'node:url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default getEslintConfig(__dirname + '/tsconfig.eslint.json');
