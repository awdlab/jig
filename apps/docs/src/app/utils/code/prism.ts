import Prism from 'prismjs';
// Import TypeScript language support directly
import 'prismjs/components/prism-typescript';

export function style(code: string) {
  // No need to load languages dynamically - they're imported above
  return Prism.highlight(code, Prism.languages['typescript'], 'typescript');
}
