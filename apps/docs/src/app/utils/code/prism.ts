import Prism from 'prismjs';
Prism.manual = true;
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-typescript';

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

export function style(code: string) {
  return Prism.highlight(code, Prism.languages['typescript']!, 'typescript');
}
