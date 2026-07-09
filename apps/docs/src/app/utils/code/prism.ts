type PrismType = typeof import('prismjs');

let prismPromise: Promise<PrismType> | undefined;
let prismInstance: PrismType | undefined;

export async function loadPrism() {
  if (!prismPromise) {
    prismPromise = (async () => {
      const prismModule = await import('prismjs');
      // `@types/prismjs` models prismjs as a namespace; under esModuleInterop the
      // runtime module object exposes the namespace via `default`.
      const Prism = ((prismModule as { default?: PrismType }).default ?? prismModule) as PrismType;
      Prism.manual = true;
      await import('prismjs/components/prism-markup');
      await import('prismjs/components/prism-typescript');
      await import('prismjs/components/prism-css');
      await import('prismjs/components/prism-bash');
      await import('prismjs/components/prism-json');

      // add this after TS is loaded
      Prism.languages.insertBefore('typescript', 'string', {
        'component-inline-template': {
          // matches: template: ` ... ` (multiline)
          pattern: /template\s*:\s*`[\s\S]*?`/,
          greedy: true,
          inside: {
            // the backticks
            'template-punctuation': {
              pattern: /`/,
              alias: 'string',
            },

            'ng-control-flow': {
              // no anchors, so it works even when indented
              pattern: /@(?:for|if|switch|else|defer|placeholder|loading|error)[^{]*\{/,
              inside: {
                // only the @for / @if part → keyword
                'ng-directive-name': {
                  pattern: /@(?:for|if|switch|else|defer|placeholder|loading|error)/,
                  alias: 'token keyword control-flow',
                },
                // everything after that, up to the {
                'ng-control-expression': {
                  pattern: /[\s\S]+/,
                  inside: Prism.languages['typescript'],
                },
              },
            },

            // 'ng-binding': {
            //   // just the attribute part, not the whole tag
            //   pattern: /(?:\[(?:[^\]]+)\]|\((?:[^)]+)\))\s*=\s*(?:"[^"]*"|'[^']*')/,
            //   inside: {
            //     // [foo] or (bar)
            //     'attr-name': {
            //       pattern: /^(?:\[(?:[^\]]+)\]|\((?:[^)]+)\))/,
            //       alias: 'attr-name',
            //     },
            //     // = " ... "
            //     'attr-value': {
            //       pattern: /=\s*(?:"[^"]*"|'[^']*')/,
            //       inside: {
            //         // the = and quotes
            //         punctuation: {
            //           pattern: /^=\s*["']|["']$/g,
            //           alias: 'punctuation',
            //         },
            //         // the actual expression -> TypeScript
            //         'ts-expression': {
            //           pattern: /[\s\S]+/,
            //           inside: Prism.languages['typescript'],
            //         },
            //       },
            //     },
            //   },
            // },

            // everything that's not a backtick -> HTML
            'embedded-markup': {
              pattern: /[\s\S]+/,
              inside: Prism.languages['markup'],
            },
          },
        },
      });

      prismInstance = Prism;
      return Prism;
    })();
  }
  return prismPromise;
}

export async function style(code: string): Promise<string> {
  const Prism = await loadPrism();
  return Prism.highlight(code, Prism.languages['typescript']!, 'typescript');
}

// Fenced-block language identifiers → Prism grammar keys.
const LANG_ALIASES: Record<string, string> = {
  ts: 'typescript',
  html: 'markup',
  xml: 'markup',
  svg: 'markup',
  shell: 'bash',
  sh: 'bash',
};

function escapeHtml(code: string): string {
  return code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Synchronously highlight a fenced code block. Requires {@link loadPrism} to
 * have resolved first (marked awaits it during setup). Falls back to escaped
 * plain text when the language is unknown or omitted.
 */
export function highlightBlock(code: string, lang: string | undefined): string {
  if (!prismInstance || !lang) {
    return escapeHtml(code);
  }
  const grammarKey = LANG_ALIASES[lang] ?? lang;
  const grammar = prismInstance.languages[grammarKey] ?? prismInstance.languages[lang];
  if (!grammar) {
    return escapeHtml(code);
  }
  return prismInstance.highlight(code, grammar, grammarKey);
}
