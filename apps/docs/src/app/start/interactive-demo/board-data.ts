import tablerBug from '@iconify/icons-tabler/bug';

import type { NgnTreeItem } from '@awdlab/jig/api';

import type { PaletteColorName } from './data';

/** Board columns, left to right. */
export type ColumnId = 'backlog' | 'in-progress' | 'review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Member {
  readonly id: string;
  readonly name: string;
  readonly initials: string;
  /** Theme CSS variable string for the avatar background. */
  readonly color: string;
}

export interface Subtask {
  readonly id: string;
  readonly label: string;
  done: boolean;
}

export interface Attachment {
  readonly id: string;
  readonly name: string;
  readonly size: string;
}

export interface TaskLabel {
  readonly text: string;
  readonly color: PaletteColorName;
}

export interface Task {
  readonly id: string;
  title: string;
  readonly description: string;
  columnId: ColumnId;
  readonly priority: TaskPriority;
  readonly labels: readonly TaskLabel[];
  assigneeId: string;
  subtasks: Subtask[];
  attachments: Attachment[];
  /** 0-100, editable via the detail slider. */
  progress: number;
  readonly due: string;
  readonly overdue?: boolean;
}

export interface Column {
  readonly id: ColumnId;
  readonly title: string;
  readonly color: PaletteColorName;
}

export const COLUMNS: readonly Column[] = [
  { id: 'backlog', title: 'Backlog', color: 'surface' },
  { id: 'in-progress', title: 'In Progress', color: 'info' },
  { id: 'review', title: 'Review', color: 'warning' },
  { id: 'done', title: 'Done', color: 'success' },
];

// Soft pastel (200) backgrounds keep dark avatar initials readable across themes.
export const MEMBERS: readonly Member[] = [
  { id: 'yo', name: 'You', initials: 'YO', color: 'var(--awd-color-primary-200)' },
  { id: 'jc', name: 'Jane Cooper', initials: 'JC', color: 'var(--awd-color-info-200)' },
  { id: 'bw', name: 'Bruce W.', initials: 'BW', color: 'var(--awd-color-accent-200)' },
  { id: 'as', name: 'Alice S.', initials: 'AS', color: 'var(--awd-color-success-200)' },
  { id: 'mr', name: 'Mark R.', initials: 'MR', color: 'var(--awd-color-secondary-200)' },
];

export const CURRENT_USER_ID = 'yo';

export function member(id: string): Member {
  return MEMBERS.find(m => m.id === id) ?? MEMBERS[0]!;
}

export const PRIORITY_META: Record<TaskPriority, { label: string; color: PaletteColorName }> = {
  high: { label: 'High', color: 'error' },
  medium: { label: 'Medium', color: 'warning' },
  low: { label: 'Low', color: 'info' },
};

/** Left-rail project navigation — plain hierarchy the tree renders. */
export const PROJECT_TREE: NgnTreeItem[] = [
  {
    label: 'Mobile App',
    value: 'mobile',
    items: [
      { label: 'Q3 Roadmap', value: 'mobile-roadmap' },
      { label: 'Sprint 24', value: 'mobile-sprint-24' },
    ],
  },
  {
    label: 'Web Platform',
    value: 'web',
    items: [
      { label: 'Sprint 24', value: 'web-sprint-24' },
      { label: 'Design System', value: 'web-design-system' },
      { label: 'Backlog', value: 'web-backlog', disabled: true },
    ],
  },
  {
    label: 'Marketing',
    value: 'marketing',
    items: [{ label: 'Launch Campaign', value: 'marketing-launch' }],
  },
];

export const BUG_ICON = tablerBug;

function subtasks(...seed: [string, boolean][]): Subtask[] {
  return seed.map(([label, done], i) => ({ id: `s${i}`, label, done }));
}

let taskSeq = 0;
function task(t: Omit<Task, 'id'>): Task {
  return { id: `t${++taskSeq}`, ...t };
}

export const SEED_TASKS: readonly Task[] = [
  task({
    title: 'Redesign onboarding flow',
    description:
      'Rework the first-run experience: fewer steps, clearer copy, and a progress indicator so new users know how far they have left.',
    columnId: 'in-progress',
    priority: 'high',
    labels: [
      { text: 'UX', color: 'accent' },
      { text: 'Design', color: 'primary' },
    ],
    assigneeId: 'jc',
    subtasks: subtasks(
      ['Audit current funnel', true],
      ['Wireframe new steps', true],
      ['Copy review', false],
      ['Dev handoff', false]
    ),
    attachments: [{ id: 'a1', name: 'flow-v3.fig', size: '2.4 MB' }],
    progress: 55,
    due: 'Jul 28',
  }),
  task({
    title: 'Fix avatar overflow on Safari',
    description:
      'Stacked avatars clip on the right edge in Safari 17. Regression from the last release.',
    columnId: 'review',
    priority: 'medium',
    labels: [{ text: 'Bug', color: 'error' }],
    assigneeId: 'bw',
    subtasks: subtasks(['Reproduce', true], ['Patch clip path', true]),
    attachments: [],
    progress: 90,
    due: 'Jul 21',
    overdue: true,
  }),
  task({
    title: 'Ship dark-mode token pass',
    description:
      'Reconcile the remaining surface + border tokens so dark mode stops leaking light shades.',
    columnId: 'backlog',
    priority: 'medium',
    labels: [
      { text: 'Theming', color: 'info' },
      { text: 'Tech debt', color: 'surface' },
    ],
    assigneeId: 'as',
    subtasks: subtasks(['List offending tokens', false], ['Map to nova ramp', false]),
    attachments: [],
    progress: 10,
    due: 'Aug 4',
  }),
  task({
    title: 'Draft launch announcement',
    description:
      'Blog post + changelog entry for the 2.0 release. Needs a hero image and three feature callouts.',
    columnId: 'backlog',
    priority: 'low',
    labels: [{ text: 'Marketing', color: 'secondary' }],
    assigneeId: 'mr',
    subtasks: subtasks(['Outline', true], ['First draft', false], ['Review', false]),
    attachments: [{ id: 'a2', name: 'hero-draft.png', size: '840 KB' }],
    progress: 20,
    due: 'Aug 11',
  }),
  task({
    title: 'Add keyboard nav to the board',
    description:
      'Arrow keys move focus between cards; Enter opens the detail drawer. Match the tablist pattern used elsewhere.',
    columnId: 'in-progress',
    priority: 'high',
    labels: [
      { text: 'A11y', color: 'success' },
      { text: 'Feature', color: 'primary' },
    ],
    assigneeId: 'yo',
    subtasks: subtasks(['Roving tabindex', true], ['Enter opens drawer', false]),
    attachments: [],
    progress: 40,
    due: 'Jul 30',
  }),
  task({
    title: 'Migrate table demo to signals',
    description:
      'Drop the last decorator-based inputs in the docs table demo; move to the modern signal API.',
    columnId: 'done',
    priority: 'low',
    labels: [{ text: 'Tech debt', color: 'surface' }],
    assigneeId: 'jc',
    subtasks: subtasks(['Convert inputs', true], ['Update tests', true]),
    attachments: [],
    progress: 100,
    due: 'Jul 15',
  }),
  task({
    title: 'Instrument funnel analytics',
    description:
      'Wire the onboarding steps to the analytics pipeline so we can measure drop-off per step.',
    columnId: 'review',
    priority: 'medium',
    labels: [{ text: 'Data', color: 'info' }],
    assigneeId: 'as',
    subtasks: subtasks(['Define events', true], ['QA in staging', false]),
    attachments: [],
    progress: 75,
    due: 'Jul 24',
  }),
  task({
    title: 'Reduce bundle size on start page',
    description:
      'The start page ships too much eagerly. Defer the heavier demo panels behind interaction.',
    columnId: 'done',
    priority: 'high',
    labels: [{ text: 'Perf', color: 'warning' }],
    assigneeId: 'bw',
    subtasks: subtasks(['Split demo bundles', true], ['Verify LCP', true]),
    attachments: [],
    progress: 100,
    due: 'Jul 12',
  }),
];
