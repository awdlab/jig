import {
  Component,
  computed,
  effect,
  type ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import tablerCopy from '@iconify/icons-tabler/copy';
import tablerCornerUpLeft from '@iconify/icons-tabler/corner-up-left';
import tablerDotsVertical from '@iconify/icons-tabler/dots-vertical';
import tablerLayoutSidebarRight from '@iconify/icons-tabler/layout-sidebar-right';
import tablerPaperclip from '@iconify/icons-tabler/paperclip';
import tablerPin from '@iconify/icons-tabler/pin';
import tablerSearch from '@iconify/icons-tabler/search';
import tablerSend from '@iconify/icons-tabler/send';
import tablerTrash from '@iconify/icons-tabler/trash';
import { NgnAvatar, NgnAvatarGroup } from '@ngneers/controls/avatar';
import { NgnButton } from '@ngneers/controls/button';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnListBox } from '@ngneers/controls/list-box';
import { type MenuItem, NgnMenu } from '@ngneers/controls/menu';
import { NgnProgress } from '@ngneers/controls/progress';
import { createConditionalSpinner } from '@ngneers/controls/spinner';
import { NgnSplitterModule } from '@ngneers/controls/splitter';
import { NgnSwitch } from '@ngneers/controls/switch';
import { NgnTag } from '@ngneers/controls/tag';
import { injectToastCreator } from '@ngneers/controls/toast';
import { NgnTooltip } from '@ngneers/controls/tooltip';

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
  selector: 'ngn-docs-team-chat',
  templateUrl: './team-chat.html',
  imports: [
    NgnAvatar,
    NgnAvatarGroup,
    NgnButton,
    NgnIcon,
    NgnInput,
    NgnInputField,
    NgnListBox,
    NgnMenu,
    NgnProgress,
    NgnSplitterModule,
    NgnSwitch,
    NgnTag,
    NgnTooltip,
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

  protected readonly pinned = PINNED;
  protected readonly files = SHARED_FILES;
  /** Quick one-tap reactions shown in the per-message hover toolbar. */
  protected readonly quickEmojis: readonly string[] = ['👍', '❤️', '🎉'];

  /**
   * Auto-contrasting text color for the user's own (primary-filled) bubbles. Pure-CSS relative
   * color — black on a light primary, white on a dark one — so it stays readable for any theme or
   * custom primary, unlike the nova-only `*-contrast` vars. Mirrors the theme's `autoContrast()`.
   */
  protected readonly ownBubbleTextColor =
    'oklch(from var(--ngn-color-primary-500) clamp(0, (0.62 - l) * 1e7, 1) 0 h)';
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

    // Keep the thread pinned to the newest message on send / conversation switch.
    effect(() => {
      this.activeMessages();
      const el = this._threadScroll()?.nativeElement;
      if (el) {
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
    this.showDetails.update(v => !v);
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
