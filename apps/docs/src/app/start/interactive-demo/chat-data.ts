import type { JigItem } from '@awdlab/jig/api';

import type { PaletteColorName } from './data';

/** Presence state shown as a colored dot on a member's avatar. */
export type Presence = 'online' | 'away' | 'offline';

export interface ChatUser {
  id: string;
  name: string;
  initials: string;
  /** Avatar background — a soft `--jig-color-*-200` CSS variable (dark initials stay readable). */
  color: string;
  presence: Presence;
  /** Role shown in the channel members list. */
  role: string;
}

/** An emoji reaction aggregated across a message's readers. */
export interface Reaction {
  emoji: string;
  count: number;
  /** Whether the current user is among the reactors (drives the highlighted pill). */
  reacted: boolean;
}

/** A single option in a {@link Poll}. */
export interface PollOption {
  id: string;
  label: string;
  votes: number;
}

/** An inline poll widget rendered inside a message bubble. */
export interface Poll {
  question: string;
  options: PollOption[];
  /** Option id the current user picked, if any (drives the highlighted result). */
  myVote?: string;
}

export interface ChatMessage {
  id: number;
  authorId: string;
  text: string;
  /** Pre-formatted clock label, e.g. `9:41 AM`. */
  time: string;
  /** Day bucket used to render date dividers, e.g. `Today` / `Yesterday`. */
  dateGroup: string;
  reactions: Reaction[];
  /** True for the current user's own messages (right-aligned, primary bubble). */
  own: boolean;
  /**
   * Optional rich content rendered with the message: `palette` appends a swatch
   * strip of the theme ramp, `poll` renders an interactive {@link poll} widget.
   */
  widget?: 'palette' | 'poll';
  /** Poll data, required when {@link widget} is `poll`. */
  poll?: Poll;
}

export type ConversationKind = 'channel' | 'dm';

export interface Conversation {
  id: string;
  kind: ConversationKind;
  /** Display name — `# design` for channels, a person's name for DMs. */
  name: string;
  memberIds: string[];
  /** Seed unread count; drives the sidebar badge and the "New messages" divider. */
  unread: number;
  /** Message id the "New messages" divider is rendered before (when the convo has unread). */
  firstUnreadId?: number;
  lastMessage: string;
  lastTime: string;
  /** Channel topic shown in the header + About panel. */
  topic: string;
}

export interface SharedFile {
  name: string;
  meta: string;
  icon: PaletteColorName;
  /** When set (0-100) the file row renders an upload progress bar instead of a size. */
  progress?: number;
}

export const CURRENT_USER_ID = 'me';

export const USERS: Record<string, ChatUser> = {
  me: {
    id: 'me',
    name: 'You',
    initials: 'YO',
    color: 'var(--jig-color-primary-200)',
    presence: 'online',
    role: 'You',
  },
  alex: {
    id: 'alex',
    name: 'Alex Rivera',
    initials: 'AR',
    color: 'var(--jig-color-info-200)',
    presence: 'online',
    role: 'Product Designer',
  },
  sam: {
    id: 'sam',
    name: 'Sam Chen',
    initials: 'SC',
    color: 'var(--jig-color-success-200)',
    presence: 'online',
    role: 'Frontend Engineer',
  },
  maya: {
    id: 'maya',
    name: 'Maya Patel',
    initials: 'MP',
    color: 'var(--jig-color-accent-200)',
    presence: 'away',
    role: 'Product Manager',
  },
  leo: {
    id: 'leo',
    name: 'Leo Novak',
    initials: 'LN',
    color: 'var(--jig-color-warning-200)',
    presence: 'offline',
    role: 'Backend Engineer',
  },
  nina: {
    id: 'nina',
    name: 'Nina Berg',
    initials: 'NB',
    color: 'var(--jig-color-secondary-200)',
    presence: 'online',
    role: 'QA Engineer',
  },
};

export function user(id: string): ChatUser {
  return USERS[id] ?? USERS['me']!;
}

export const CONVERSATIONS: readonly Conversation[] = [
  {
    id: 'design',
    kind: 'channel',
    name: '# design',
    memberIds: ['me', 'alex', 'maya', 'sam'],
    unread: 3,
    firstUnreadId: 4,
    lastMessage: 'You: Quick poll — ship the dark-mode pass Friday?',
    lastTime: '9:43 AM',
    topic: 'UI, UX & the design system',
  },
  {
    id: 'general',
    kind: 'channel',
    name: '# general',
    memberIds: ['me', 'alex', 'sam', 'maya', 'leo', 'nina'],
    unread: 0,
    lastMessage: 'Leo: Thanks Nina 🙏',
    lastTime: 'Yesterday',
    topic: 'Company-wide announcements',
  },
  {
    id: 'engineering',
    kind: 'channel',
    name: '# engineering',
    memberIds: ['me', 'sam', 'leo', 'nina'],
    unread: 0,
    lastMessage: 'Leo: Deploy is green ✅',
    lastTime: 'Yesterday',
    topic: 'Builds, deploys & architecture',
  },
  {
    id: 'dm-alex',
    kind: 'dm',
    name: 'Alex Rivera',
    memberIds: ['me', 'alex'],
    unread: 2,
    firstUnreadId: 2,
    lastMessage: 'Can you review the mock?',
    lastTime: '9:38 AM',
    topic: 'Direct message',
  },
  {
    id: 'dm-sam',
    kind: 'dm',
    name: 'Sam Chen',
    memberIds: ['me', 'sam'],
    unread: 0,
    lastMessage: 'You: merged, thanks!',
    lastTime: 'Yesterday',
    topic: 'Direct message',
  },
  {
    id: 'dm-maya',
    kind: 'dm',
    name: 'Maya Patel',
    memberIds: ['me', 'maya'],
    unread: 0,
    lastMessage: 'Maya: 👍',
    lastTime: 'Yesterday',
    topic: 'Direct message',
  },
];

function msg(
  id: number,
  authorId: string,
  text: string,
  time: string,
  dateGroup: string,
  reactions: Reaction[] = []
): ChatMessage {
  return { id, authorId, text, time, dateGroup, reactions, own: authorId === CURRENT_USER_ID };
}

/** Seed threads, keyed by conversation id. The default `design` channel is the richest. */
export const MESSAGES: Record<string, ChatMessage[]> = {
  design: [
    msg(1, 'maya', 'Morning team! Ready to lock the v2 palette today?', '9:02 AM', 'Yesterday'),
    msg(2, 'sam', 'Yep — the contrast checks all pass now.', '9:05 AM', 'Yesterday', [
      { emoji: '🎉', count: 2, reacted: false },
    ]),
    msg(3, 'me', 'Nice. I updated the docs demo to use the new tags.', '9:12 AM', 'Yesterday'),
    {
      ...msg(
        4,
        'alex',
        'Pushed the new tokens 🎨 surface + primary ramps are in.',
        '9:38 AM',
        'Today',
        [
          { emoji: '🚀', count: 3, reacted: true },
          { emoji: '❤️', count: 1, reacted: false },
        ]
      ),
      widget: 'palette',
    },
    msg(5, 'maya', 'Love it. Can we get a dark-mode pass before Friday?', '9:40 AM', 'Today'),
    msg(6, 'alex', 'On it — should be quick with the new scales.', '9:41 AM', 'Today', [
      { emoji: '👍', count: 2, reacted: false },
    ]),
    {
      ...msg(7, 'me', 'Quick poll — ship the dark-mode pass this Friday?', '9:43 AM', 'Today'),
      widget: 'poll',
      poll: {
        question: 'Ship the dark-mode pass this Friday?',
        options: [
          { id: 'yes', label: 'Ship it 🚀', votes: 4 },
          { id: 'wait', label: 'Needs a bit more', votes: 1 },
        ],
      },
    },
  ],
  general: [
    msg(1, 'nina', 'Reminder: standup moved to 10:30 today.', '8:30 AM', 'Yesterday'),
    msg(2, 'leo', 'Thanks Nina 🙏', '8:32 AM', 'Yesterday', [
      { emoji: '👍', count: 1, reacted: false },
    ]),
  ],
  engineering: [
    msg(1, 'sam', 'CI is flaky on webkit again, looking into it.', '11:02 AM', 'Yesterday'),
    msg(2, 'leo', 'Deploy is green ✅ shipping the splitter fix.', '11:20 AM', 'Yesterday', [
      { emoji: '🚀', count: 2, reacted: true },
    ]),
  ],
  'dm-alex': [
    msg(1, 'alex', 'Hey! Got a sec?', '9:30 AM', 'Today'),
    msg(2, 'alex', 'Can you review the mock? Link in the design channel.', '9:38 AM', 'Today'),
  ],
  'dm-sam': [
    msg(1, 'me', 'merged, thanks!', '4:12 PM', 'Yesterday', [
      { emoji: '❤️', count: 1, reacted: false },
    ]),
  ],
  'dm-maya': [msg(1, 'maya', '👍', '2:01 PM', 'Yesterday')],
};

/** Pinned message snippets shown in the details panel (kept generic across channels). */
export const PINNED: readonly { author: string; text: string }[] = [
  { author: 'Maya Patel', text: 'Design review notes → figma.com/awdlab/v2' },
  { author: 'Alex Rivera', text: 'Token naming convention doc (please read before PRs)' },
];

export const SHARED_FILES: readonly SharedFile[] = [
  { name: 'palette-v2.fig', meta: '4.2 MB · Alex', icon: 'accent' },
  { name: 'contrast-audit.pdf', meta: '820 KB · Sam', icon: 'secondary' },
  { name: 'dark-mode-spec.png', meta: 'Uploading…', icon: 'primary', progress: 68 },
];

/**
 * Presence dot color per state. Uses the theme's semantic color when present, with a literal
 * fallback so the dot still renders on monochrome themes (e.g. shade) that don't define
 * `success`/`warning` — otherwise the fill resolves to transparent and the dot looks broken.
 */
export const PRESENCE_COLOR: Record<Presence, string> = {
  online: 'var(--jig-color-success-500, #22c55e)',
  away: 'var(--jig-color-warning-500, #f59e0b)',
  offline: 'var(--jig-color-surface-400, #a1a1aa)',
};

/** Build the grouped list-box items (Channels / Direct Messages) from a set of conversations. */
export function toConversationItems(
  conversations: readonly Conversation[]
): JigItem<Conversation, string>[] {
  const group = (label: string, kind: ConversationKind): JigItem<Conversation, string> => ({
    label,
    value: `grp-${kind}`,
    items: conversations
      .filter(c => c.kind === kind)
      .map(c => ({ label: c.name, value: c.id, data: c })),
  });
  return [group('Channels', 'channel'), group('Direct Messages', 'dm')].filter(
    g => (g.items?.length ?? 0) > 0
  );
}
