import { marked as originalMarked } from 'marked';

const renderer = new originalMarked.Renderer();
renderer.code = args => {
  let { text, lang } = args;
  text = text.replace(/\n+$/, '').replace(/^\n+/, ''); // Remove trailing newlines
  const langClass = lang ? ` class="language-${lang}"` : '';
  return `<pre><code${langClass}>${originalMarked.parseInline(text)}</code></pre>`;
};

export const marked = originalMarked.use({ renderer });
