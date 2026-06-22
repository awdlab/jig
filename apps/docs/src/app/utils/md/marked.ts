let markedPromise: Promise<typeof import('marked').marked> | undefined;

export function getMarked() {
  if (!markedPromise) {
    markedPromise = (async () => {
      const { marked: originalMarked } = await import('marked');
      const renderer = new originalMarked.Renderer();
      renderer.code = args => {
        let { text } = args;
        const { lang } = args;
        text = text.replace(/\n+$/, '').replace(/^\n+/, ''); // Remove trailing newlines
        const langClass = lang ? ` class="language-${lang}"` : '';
        return `<pre><code${langClass}>${originalMarked.parseInline(text)}</code></pre>`;
      };
      return originalMarked.use({ renderer });
    })();
  }
  return markedPromise;
}
