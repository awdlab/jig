import { highlightBlock, loadPrism } from '../code/prism';

let markedPromise: Promise<typeof import('marked').marked> | undefined;

export function getMarked() {
  if (!markedPromise) {
    markedPromise = (async () => {
      const [{ marked: originalMarked }] = await Promise.all([import('marked'), loadPrism()]);
      const renderer = new originalMarked.Renderer();
      renderer.code = args => {
        let { text } = args;
        const { lang } = args;
        text = text.replace(/\n+$/, '').replace(/^\n+/, ''); // Remove trailing newlines
        // Syntax-highlight fenced blocks with Prism (mirrors the demo code view).
        const langClass = lang ? ` language-${lang}` : '';
        return `<pre><code class="prism${langClass}">${highlightBlock(text, lang)}</code></pre>`;
      };
      return originalMarked.use({ renderer });
    })();
  }
  return markedPromise;
}
