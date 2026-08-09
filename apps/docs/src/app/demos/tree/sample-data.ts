import type { AwdTreeItem } from '@awdlab/jig/api';

/** A small file-system style tree reused across the tree demos. */
export const fileTree: AwdTreeItem[] = [
  {
    label: 'src',
    value: 'src',
    items: [
      {
        label: 'app',
        value: 'app',
        items: [
          { label: 'app.component.ts', value: 'app.ts' },
          { label: 'app.routes.ts', value: 'routes.ts' },
        ],
      },
      {
        label: 'lib',
        value: 'lib',
        items: [
          { label: 'utils.ts', value: 'utils.ts' },
          { label: 'http.ts', value: 'http.ts' },
        ],
      },
      { label: 'main.ts', value: 'main.ts' },
    ],
  },
  {
    label: 'assets',
    value: 'assets',
    items: [
      { label: 'logo.svg', value: 'logo.svg' },
      { label: 'styles.css', value: 'styles.css' },
    ],
  },
  { label: 'package.json', value: 'package.json' },
  { label: 'README.md', value: 'readme.md' },
];
