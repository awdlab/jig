import { Pipe, type PipeTransform } from '@angular/core';

import { getMarked } from './marked';

@Pipe({
  name: 'markdown',
})
export class MarkdownPipe implements PipeTransform {
  public async transform(value: string | null | undefined): Promise<string> {
    if (!value) {
      return '';
    }

    try {
      const marked = await getMarked();
      const result = await marked(value);
      const cleaned = result.trim();
      return cleaned;
    } catch (error) {
      console.error('Error parsing markdown:', error);
      return value;
    }
  }
}
