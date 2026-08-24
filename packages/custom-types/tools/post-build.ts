import path from 'path';
import { fileURLToPath } from 'url';

import { rewriteDistSpecifiers } from '../../../tools/utils/rewrite-dist-specifiers';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

rewriteDistSpecifiers(path.join(__dirname, '../dist'));
