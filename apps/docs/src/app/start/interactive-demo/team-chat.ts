import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  effect,
  type ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import tablerChevronLeft from '@iconify/icons-tabler/chevron-left';
import tablerCopy from '@iconify/icons-tabler/copy';
import tablerCornerUpLeft from '@iconify/icons-tabler/corner-up-left';
import tablerDotsVertical from '@iconify/icons-tabler/dots-vertical';
import tablerLayoutSidebarRight from '@iconify/icons-tabler/layout-sidebar-right';
import tablerMoodSmile from '@iconify/icons-tabler/mood-smile';
import tablerPaperclip from '@iconify/icons-tabler/paperclip';
import tablerPin from '@iconify/icons-tabler/pin';
import tablerSearch from '@iconify/icons-tabler/search';
import tablerSend from '@iconify/icons-tabler/send';
import tablerTrash from '@iconify/icons-tabler/trash';
import type { Openable } from '@awdlab/jig/api/ng';
import { JigAvatar, JigAvatarGroup } from '@awdlab/jig/avatar';
import { JigBadge } from '@awdlab/jig/badge';
import { JigButton } from '@awdlab/jig/button';
import { JigIcon } from '@awdlab/jig/icon';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigListBox } from '@awdlab/jig/list-box';
import { type MenuItem, JigMenu } from '@awdlab/jig/menu';
import { JigPopover } from '@awdlab/jig/popover';
import { JigProgress } from '@awdlab/jig/progress';
import { createConditionalSpinner } from '@awdlab/jig/spinner';
import { JigSplitterModule } from '@awdlab/jig/splitter';
import { JigSwitch } from '@awdlab/jig/switch';
import { JigTag } from '@awdlab/jig/tag';
import { injectToastCreator } from '@awdlab/jig/toast';
import { JigTooltip } from '@awdlab/jig/tooltip';

import {
  type ChatMessage,
  type Conversation,
  CONVERSATIONS,
  CURRENT_USER_ID,
  MESSAGES,
  PINNED,
  PRESENCE_COLOR,
  SHARED_FILES,
  toConversationItems,
  user,
} from './chat-data';

@Component({
  selector: 'jig-docs-team-chat',
  templateUrl: './team-chat.html',
  imports: [
    NgTemplateOutlet,
    JigAvatar,
    JigAvatarGroup,
    JigBadge,
    JigButton,
    JigIcon,
    JigInput,
    JigInputField,
    JigListBox,
    JigMenu,
    JigPopover,
    JigProgress,
    JigSplitterModule,
    JigSwitch,
    JigTag,
    JigTooltip,
  ],
})
export class TeamChat {
  private readonly _injector = inject(Injector);
  private readonly _toastCreator = injectToastCreator();

  protected readonly searchIcon = tablerSearch;
  protected readonly sendIcon = tablerSend;
  protected readonly dotsIcon = tablerDotsVertical;
  protected readonly pinIcon = tablerPin;
  protected readonly paperclipIcon = tablerPaperclip;
  protected readonly detailsIcon = tablerLayoutSidebarRight;
  protected readonly emojiIcon = tablerMoodSmile;
  protected readonly backIcon = tablerChevronLeft;

  /** Below `lg` the 3-pane splitter can't fit; switch to single-pane navigation. */
  protected readonly narrow = signal(
    typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches
  );
  /** Which pane the narrow layout currently shows. */
  protected readonly mobileView = signal<'list' | 'thread' | 'details'>('list');

  /** Theme ramp preview shown by the `palette` widget (primary ramp + a couple of surfaces). */
  protected readonly paletteSwatches: readonly string[] = [
    'var(--jig-color-primary-300)',
    'var(--jig-color-primary-400)',
    'var(--jig-color-primary-500)',
    'var(--jig-color-primary-600)',
    'var(--jig-color-primary-700)',
    'var(--jig-color-surface-200)',
    'var(--jig-color-surface-400)',
  ];

  protected readonly pinned = PINNED;
  protected readonly files = SHARED_FILES;
  /** Quick one-tap reactions shown in the per-message hover toolbar. */
  protected readonly quickEmojis: readonly string[] = ['👍', '❤️', '🎉'];
  /** Wider set shown in the "more emojis" picker popover. */
  protected readonly moreEmojis: readonly string[] = [
    '👍',
    '❤️',
    '🎉',
    '🚀',
    '😂',
    '😍',
    '🙌',
    '🔥',
    '👀',
    '✅',
    '🎨',
    '💡',
    '🙏',
    '😅',
    '🤔',
    '💯',
  ];

  /**
   * Passthrough that scales the actions menu down to the chat's own small type
   * scale — the popover renders in the top layer, so it inherits the document
   * font size (≈16px) and otherwise looks oversized next to the 14px thread.
   */
  protected readonly menuPt = { root: { $styles: { fontSize: 'var(--jig-font-size-sm)' } } };

  /** Drop the list-box's own border — it sits inside the rounded chat card and the doubled,
   *  differently-rounded edge looked off at the corners. */
  protected readonly listBoxPt = { root: { $styles: { borderWidth: '0' } } };

  /** Compact "pill" styling for the hover-reaction bar popover (tight padding, full radius). */
  protected readonly barPt = {
    content: { $styles: { padding: '3px', borderRadius: '9999px' } },
  };

  /**
   * The per-message hover-reaction bar renders in a popover (top layer) so it can't be
   * clipped by the thread's overflow. Each message has its own bar; we drive them
   * IMPERATIVELY (show()/hide()) rather than via an `[open]` binding — a one-way `[open]`
   * fights the popover's internal open/close echo, which would leave the previous bar
   * stuck open when moving between messages. Tracking the single open bar and closing it
   * when another opens keeps exactly one visible, order-independent under fast moves.
   */
  private _openBar: { bar: JigPopover; nested: readonly Openable[] } | null = null;
  private _barCloseTimer: ReturnType<typeof setTimeout> | undefined;

  protected showBar(bar: JigPopover, ...nested: Openable[]): void {
    // The picker/menu float over neighbouring rows, so the gap between them hovers a
    // sibling message: a pinned bar wins over another row's hover.
    if (this._openBar?.bar !== bar && this._pinned()) {
      return;
    }
    clearTimeout(this._barCloseTimer);
    if (this._openBar && this._openBar.bar !== bar) {
      this._hideBar(this._openBar);
    }
    this._openBar = { bar, nested };
    bar.show();
  }

  /** An open emoji picker / actions menu pins the bar, so the gap between them is crossable. */
  private _pinned(): boolean {
    return this._openBar?.nested.some(n => n.open()) ?? false;
  }

  protected hideBarSoon(bar: JigPopover, ...nested: Openable[]): void {
    clearTimeout(this._barCloseTimer);
    if (nested.some(n => n.open())) {
      return;
    }
    this._barCloseTimer = setTimeout(() => this._hideBar({ bar, nested }), 160);
  }

  /** Nested popovers outlive the bar's own close (their content isn't torn down), so close them too. */
  private _hideBar(entry: { bar: JigPopover; nested: readonly Openable[] }): void {
    for (const nested of entry.nested) {
      if (nested.open()) {
        nested.hide();
      }
    }
    entry.bar.hide();
    if (this._openBar?.bar === entry.bar) {
      this._openBar = null;
    }
  }

  /**
   * Auto-contrasting text color for the user's own (primary-filled) bubbles. Pure-CSS relative
   * color — black on a light primary, white on a dark one — so it stays readable for any theme or
   * custom primary, unlike the nova-only `*-contrast` vars. Mirrors the theme's `autoContrast()`.
   */
  protected readonly ownBubbleTextColor =
    'oklch(from var(--jig-color-primary-500) clamp(0, (0.62 - l) * 1e7, 1) 0 h)';
  protected readonly presenceColor = PRESENCE_COLOR;
  protected readonly user = user;

  protected readonly showDetails = signal(true);
  protected readonly notifications = signal(true);

  // -- Conversation list: search + selection --
  protected readonly search = signal('');
  private readonly _searchTerm = signal('');
  protected readonly loading = signal(false);
  private _searchTimeout: ReturnType<typeof setTimeout> | undefined;

  protected readonly activeId = signal<string>('design');
  private readonly _unread = signal<Record<string, number>>(
    Object.fromEntries(CONVERSATIONS.map(c => [c.id, c.unread]))
  );

  // -- Threads (mutable copy of the seed so sending appends live) --
  private readonly _messages = signal<Record<string, ChatMessage[]>>(structuredClone(MESSAGES));
  protected readonly draft = signal('');

  private readonly _threadScroll = viewChild<ElementRef<HTMLElement>>('threadScroll');

  constructor() {
    createConditionalSpinner(this.loading, {
      element: '.team-chat-list-area',
      debounce: false,
    });

    // Opening a conversation clears its unread badge. Do it for the initial one too.
    this._unread.update(map => ({ ...map, [this.activeId()]: 0 }));

    inject(DestroyRef).onDestroy(() => clearTimeout(this._barCloseTimer));

    afterNextRender(() => {
      const mq = window.matchMedia('(max-width: 1023px)');
      this.narrow.set(mq.matches);
      mq.addEventListener('change', e => this.narrow.set(e.matches));
    });

    // Keep the thread pinned to the newest message on send / conversation switch —
    // but NOT on in-place edits (reactions, poll votes) which replace the messages
    // array with a new reference yet append nothing. Scroll only when the active
    // conversation changes or a message is actually added.
    let prev: { id: string; count: number } | null = null;
    effect(() => {
      const id = this.activeId();
      const count = this.activeMessages().length;
      const el = this._threadScroll()?.nativeElement;
      // Only advance `prev` once the scroll element exists, so a first run before
      // the viewChild resolves doesn't swallow the initial scroll-to-bottom.
      if (!el) {
        return;
      }
      const scroll = !prev || prev.id !== id || count > prev.count;
      prev = { id, count };
      if (scroll) {
        queueMicrotask(() => (el.scrollTop = el.scrollHeight));
      }
    });
  }

  protected readonly conversationItems = computed(() => {
    const term = this._searchTerm().trim().toLowerCase();
    const list = term
      ? CONVERSATIONS.filter(c => c.name.toLowerCase().includes(term))
      : CONVERSATIONS;
    return toConversationItems(list);
  });

  protected readonly active = computed(
    () => CONVERSATIONS.find(c => c.id === this.activeId()) ?? CONVERSATIONS[0]!
  );

  protected readonly activeMessages = computed(() => this._messages()[this.activeId()] ?? []);

  protected readonly members = computed(() => this.active().memberIds.map(user));

  /** The (fake) "someone is typing" author: first online member other than you. */
  protected readonly typingUser = computed(
    () => this.members().find(m => m.id !== CURRENT_USER_ID && m.presence === 'online') ?? null
  );

  /** Everyone but you — shown as tiny "seen by" avatars under your last message. */
  protected readonly readers = computed(() => this.members().filter(m => m.id !== CURRENT_USER_ID));

  /** Id of your most recent message in the active thread (anchors the read receipt). */
  protected readonly lastOwnMessageId = computed(() => {
    const own = this.activeMessages().filter(m => m.own);
    return own.length ? own[own.length - 1]!.id : null;
  });

  protected unreadOf(id: string): number {
    return this._unread()[id] ?? 0;
  }

  /** True when a date divider should render above the message at `index`. */
  protected showDateDivider(index: number): boolean {
    const msgs = this.activeMessages();
    return index === 0 || msgs[index]!.dateGroup !== msgs[index - 1]!.dateGroup;
  }

  protected selectConversation(id: string | null): void {
    if (!id || id.startsWith('grp-')) {
      return;
    }
    this.activeId.set(id);
    this._unread.update(map => ({ ...map, [id]: 0 }));
    if (this.narrow()) {
      this.showMobileView('thread');
    }
  }

  protected onSearch(value: string | null): void {
    this.search.set(value ?? '');
    clearTimeout(this._searchTimeout);
    this.loading.set(true);
    this._searchTimeout = setTimeout(() => {
      this._searchTerm.set(value ?? '');
      this.loading.set(false);
    }, 300);
  }

  protected toggleDetails(): void {
    if (this.narrow()) {
      this.showMobileView('details');
      return;
    }
    this.showDetails.update(v => !v);
  }

  /**
   * Switch the narrow-layout pane. Cancels any pending reaction-bar close first:
   * the thread subtree unmounts on switch, so a deferred `hide()` would run on a
   * disconnected popover.
   */
  protected showMobileView(view: 'list' | 'thread' | 'details'): void {
    clearTimeout(this._barCloseTimer);
    this._openBar = null;
    this.mobileView.set(view);
  }

  protected sendMessage(): void {
    const text = this.draft().trim();
    if (!text) {
      return;
    }
    const cid = this.activeId();
    const list = this._messages()[cid] ?? [];
    const nextId = list.reduce((max, m) => Math.max(max, m.id), 0) + 1;
    const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const message: ChatMessage = {
      id: nextId,
      authorId: CURRENT_USER_ID,
      text,
      time,
      dateGroup: 'Today',
      reactions: [],
      own: true,
    };
    this._messages.update(map => ({ ...map, [cid]: [...(map[cid] ?? []), message] }));
    this.draft.set('');
  }

  /** Add or remove the current user's reaction with `emoji` on a message (idempotent toggle). */
  protected toggleReaction(message: ChatMessage, emoji: string): void {
    const cid = this.activeId();
    this._messages.update(map => ({
      ...map,
      [cid]: (map[cid] ?? []).map(m => {
        if (m.id !== message.id) {
          return m;
        }
        const existing = m.reactions.find(r => r.emoji === emoji);
        if (!existing) {
          return { ...m, reactions: [...m.reactions, { emoji, count: 1, reacted: true }] };
        }
        const count = existing.count + (existing.reacted ? -1 : 1);
        const reactions =
          count <= 0
            ? m.reactions.filter(r => r.emoji !== emoji)
            : m.reactions.map(r => (r.emoji === emoji ? { ...r, count, reacted: !r.reacted } : r));
        return { ...m, reactions };
      }),
    }));
  }

  /** Total votes across a poll's options. */
  protected pollTotal(message: ChatMessage): number {
    return (message.poll?.options ?? []).reduce((sum, o) => sum + o.votes, 0);
  }

  /** A poll option's share of the total, 0-100. */
  protected pollPercent(message: ChatMessage, optionId: string): number {
    const total = this.pollTotal(message);
    const option = message.poll?.options.find(o => o.id === optionId);
    return total > 0 && option ? Math.round((option.votes / total) * 100) : 0;
  }

  /** Cast (or move) the current user's vote in a message's poll. Re-clicking clears it. */
  protected votePoll(message: ChatMessage, optionId: string): void {
    const cid = this.activeId();
    this._messages.update(map => ({
      ...map,
      [cid]: (map[cid] ?? []).map(m => {
        if (m.id !== message.id || !m.poll) {
          return m;
        }
        const prev = m.poll.myVote;
        const next = prev === optionId ? undefined : optionId;
        const options = m.poll.options.map(o => {
          let votes = o.votes;
          if (o.id === prev) {
            votes -= 1;
          }
          if (o.id === next) {
            votes += 1;
          }
          return { ...o, votes };
        });
        return { ...m, poll: { ...m.poll, options, myVote: next } };
      }),
    }));
  }

  protected messageMenuItems(message: ChatMessage): MenuItem[] {
    return [
      { id: 'reply', label: 'Reply', icon: tablerCornerUpLeft, callback: () => {} },
      { id: 'copy', label: 'Copy text', icon: tablerCopy, callback: () => this.copyText(message) },
      { id: 'pin', label: 'Pin to channel', icon: tablerPin, callback: () => {} },
      { separator: true },
      {
        id: 'delete',
        label: 'Delete',
        icon: tablerTrash,
        callback: () => this.deleteMessage(message),
      },
    ];
  }

  private copyText(message: ChatMessage): void {
    this._toastCreator.show({ header: 'Copied', content: 'Message copied to clipboard.' });
    void message;
  }

  private deleteMessage(message: ChatMessage): void {
    const cid = this.activeId();
    this._messages.update(map => ({
      ...map,
      [cid]: (map[cid] ?? []).filter(m => m.id !== message.id),
    }));
    this._toastCreator.show({ header: 'Message deleted', content: 'The message was removed.' });
  }

  /** Whether a "New messages" divider should render above this message id. */
  protected isFirstUnread(id: number): boolean {
    return this.active().firstUnreadId === id;
  }

  protected isChannel(conversation: Conversation): boolean {
    return conversation.kind === 'channel';
  }

  /** The other participant of a DM (everyone who isn't the current user). */
  protected dmPartner(conversation: Conversation) {
    return user(conversation.memberIds.find(id => id !== CURRENT_USER_ID) ?? CURRENT_USER_ID);
  }
}
