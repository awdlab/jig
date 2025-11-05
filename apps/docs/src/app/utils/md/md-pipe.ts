import { Pipe, PipeTransform } from '@angular/core';

import { marked } from './marked';

@Pipe({
  name: 'markdown',
})
export class MarkdownPipe implements PipeTransform {
  public async transform(value: string | null | undefined): Promise<string> {
    if (!value) {
      return '';
    }

    try {
      const result = await marked(value);
      const cleaned = result.trim();
      console.log('MarkdownPipe transform result:', value, cleaned);
      return cleaned;
    } catch (error) {
      console.error('Error parsing markdown:', error);
      return value;
    }
  }
}
