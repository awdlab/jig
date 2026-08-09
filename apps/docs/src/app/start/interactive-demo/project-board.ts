import { Component, computed, signal } from '@angular/core';
import tablerClipboardList from '@iconify/icons-tabler/clipboard-list';
import tablerCopy from '@iconify/icons-tabler/copy';
import tablerDotsVertical from '@iconify/icons-tabler/dots-vertical';
import tablerLayoutKanban from '@iconify/icons-tabler/layout-kanban';
import tablerList from '@iconify/icons-tabler/list';
import tablerPaperclip from '@iconify/icons-tabler/paperclip';
import tablerPlus from '@iconify/icons-tabler/plus';
import tablerSubtask from '@iconify/icons-tabler/subtask';
import tablerSwitchHorizontal from '@iconify/icons-tabler/switch-horizontal';
import tablerTrash from '@iconify/icons-tabler/trash';
import { NgnAvatar, NgnAvatarGroup } from '@awdlab/jig/avatar';
import { NgnButton } from '@awdlab/jig/button';
import { NgnCheckbox } from '@awdlab/jig/checkbox';
import { NgnDrawer } from '@awdlab/jig/drawer';
import { NgnEditInplace } from '@awdlab/jig/edit-inplace';
import { NgnFilter } from '@awdlab/jig/filter';
import { NgnIcon } from '@awdlab/jig/icon';
import { type MenuItem, NgnMenu } from '@awdlab/jig/menu';
import { NgnMessage } from '@awdlab/jig/message';
import { NgnRadio, NgnRadioGroup } from '@awdlab/jig/radio';
import { NgnSelectButton } from '@awdlab/jig/select-button';
import { NgnSlider } from '@awdlab/jig/slider';
import { injectSnackbarCreator } from '@awdlab/jig/snackbar';
import { NgnTab, NgnTabs } from '@awdlab/jig/tabs';
import { NgnTag } from '@awdlab/jig/tag';
import { NgnTree } from '@awdlab/jig/tree';
import { NgnToggleButton } from '@awdlab/jig/toggle-button';
import { NgnTooltip } from '@awdlab/jig/tooltip';
import { NgnAccordion, NgnAccordionPanel } from '@awdlab/jig/accordion';
import { NgnUpload, type NgnUploadFile } from '@awdlab/jig/upload';

import {
  BUG_ICON,
  type ColumnId,
  COLUMNS,
  CURRENT_USER_ID,
  member,
  MEMBERS,
  PRIORITY_META,
  PROJECT_TREE,
  SEED_TASKS,
  type Subtask,
  type Task,
} from './board-data';

/** How dense the board cards render — toggled by the toolbar select-button. */
type Density = 'comfortable' | 'compact';

@Component({
  selector: 'awd-docs-project-board',
  templateUrl: './project-board.html',
  imports: [
    NgnAccordion,
    NgnAccordionPanel,
    NgnAvatar,
    NgnAvatarGroup,
    NgnButton,
    NgnCheckbox,
    NgnDrawer,
    NgnEditInplace,
    NgnFilter,
    NgnIcon,
    NgnMenu,
    NgnMessage,
    NgnRadio,
    NgnRadioGroup,
    NgnSelectButton,
    NgnSlider,
    NgnTab,
    NgnTabs,
    NgnTag,
    NgnToggleButton,
    NgnTree,
    NgnTooltip,
    NgnUpload,
  ],
})
export class ProjectBoard {
  private readonly _snackbar = injectSnackbarCreator();

  protected readonly bugIcon = BUG_ICON;
  protected readonly plusIcon = tablerPlus;
  protected readonly listIcon = tablerList;
  protected readonly boardIcon = tablerLayoutKanban;
  protected readonly subtaskIcon = tablerSubtask;
  protected readonly paperclipIcon = tablerPaperclip;
  protected readonly clipboardIcon = tablerClipboardList;
  protected readonly trashIcon = tablerTrash;
  protected readonly dotsIcon = tablerDotsVertical;

  /** Segmented density options for the select-button. */
  protected readonly densityOptions = [
    { label: 'Cozy', value: 'comfortable' },
    { label: 'Compact', value: 'compact' },
  ] as const;

  protected readonly columns = COLUMNS;
  protected readonly members = MEMBERS;
  protected readonly projectTree = PROJECT_TREE;
  protected readonly priorityMeta = PRIORITY_META;
  protected readonly member = member;

  /** Sidebar tree is decorative: all groups expanded, the active board fixed-selected. */
  protected readonly selectedProject = 'web-sprint-24';
  protected readonly expandedProjects = ['mobile', 'web', 'marketing'];

  /** Drop the tree's own border/background so it blends into the sidebar panel. */
  protected readonly treePt = { root: { $styles: { border: 'none', background: 'transparent' } } };

  /** Keep the toggle label on one line. */
  protected readonly nowrapPt = { root: { $styles: { whiteSpace: 'nowrap' } } };

  /** Radio options for the detail drawer's status picker. */
  protected readonly statusOptions = COLUMNS.map(c => ({ value: c.id, title: c.title }));

  /** Mutable board state — the seed cloned so edits (status moves, subtasks) stay local. */
  private readonly _tasks = signal<Task[]>(structuredClone(SEED_TASKS as Task[]));

  /** Board / List view switch — bound to the tabs' activeTab model. */
  protected readonly view = signal('board');
  protected readonly density = signal<Density>('comfortable');
  protected readonly boardTitle = signal('Sprint 24');

  /** Show only cards assigned to the current user. */
  protected readonly myTasksOnly = signal(false);

  // -- Quick filter (awd-filter over task titles) --
  protected readonly filterResult = signal<readonly string[] | null>(null);
  protected readonly taskTitles = computed(() => this._tasks().map(t => t.title));

  // -- Detail drawer --
  protected readonly drawerOpen = signal(false);
  private readonly _selectedId = signal<string | null>(null);
  protected readonly selectedTask = computed(
    () => this._tasks().find(t => t.id === this._selectedId()) ?? null
  );

  // -- Drag & drop (native HTML5 — no dependency) --
  private readonly _draggingId = signal<string | null>(null);
  protected readonly dragOverCol = signal<ColumnId | null>(null);
  protected isDragging(id: string): boolean {
    return this._draggingId() === id;
  }

  private _newSeq = 0;

  /** Tasks passing the active filter + "my tasks" toggle. */
  private readonly _visible = computed(() => {
    const allowed = this.filterResult();
    const titleSet = allowed ? new Set(allowed) : null;
    const mine = this.myTasksOnly();
    return this._tasks().filter(t => {
      if (titleSet && !titleSet.has(t.title)) {
        return false;
      }
      if (mine && t.assigneeId !== CURRENT_USER_ID) {
        return false;
      }
      return true;
    });
  });

  protected tasksIn(columnId: ColumnId): Task[] {
    return this._visible().filter(t => t.columnId === columnId);
  }

  protected countIn(columnId: ColumnId): number {
    return this.tasksIn(columnId).length;
  }

  /** Flat, filter-aware list used by the List tab. */
  protected readonly visibleTasks = computed(() => this._visible());

  protected readonly overdueCount = computed(() => this._visible().filter(t => t.overdue).length);

  protected doneCount(task: Task): number {
    return task.subtasks.filter(s => s.done).length;
  }

  protected columnTitle(id: ColumnId): string {
    return COLUMNS.find(c => c.id === id)?.title ?? id;
  }

  protected openTask(id: string): void {
    this._selectedId.set(id);
    this.drawerOpen.set(true);
  }

  protected onDragStart(event: DragEvent, task: Task): void {
    this._draggingId.set(task.id);
    event.dataTransfer?.setData('text/plain', task.id);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  protected onDragEnd(): void {
    this._draggingId.set(null);
    this.dragOverCol.set(null);
  }

  protected onDrop(columnId: ColumnId): void {
    const id = this._draggingId();
    this.dragOverCol.set(null);
    this._draggingId.set(null);
    if (!id) {
      return;
    }
    const task = this._tasks().find(t => t.id === id);
    if (task) {
      this.moveWithUndo(task, columnId);
    }
  }

  /** Add a blank card to a column and immediately open it for editing. */
  protected addTask(columnId: ColumnId = 'backlog'): void {
    const id = `new-${++this._newSeq}`;
    const task: Task = {
      id,
      title: 'Untitled task',
      description: 'Add a description…',
      columnId,
      priority: 'medium',
      labels: [],
      assigneeId: CURRENT_USER_ID,
      subtasks: [],
      attachments: [],
      progress: 0,
      due: '—',
    };
    this._tasks.update(tasks => [...tasks, task]);
    this.openTask(id);
  }

  protected deleteTask(id: string): void {
    const task = this._tasks().find(t => t.id === id);
    this._tasks.update(tasks => tasks.filter(t => t.id !== id));
    this.drawerOpen.set(false);
    if (task) {
      this._snackbar.show({
        content: `Deleted "${task.title}".`,
        autoHide: 5000,
        actions: [
          { label: 'Undo', value: 'undo', action: () => this._tasks.update(t => [...t, task]) },
        ],
      });
    }
  }

  protected reassign(task: Task, memberId: string): void {
    this.mutate(task.id, t => (t.assigneeId = memberId));
  }

  protected duplicateTask(task: Task): void {
    const id = `new-${++this._newSeq}`;
    this._tasks.update(tasks => [
      ...tasks,
      { ...structuredClone(task), id, title: `${task.title} (copy)` },
    ]);
  }

  /** Context menu for a card: move-to submenu, duplicate, delete. */
  protected cardMenuItems(task: Task): MenuItem[] {
    return [
      {
        id: 'move',
        label: 'Move to',
        icon: tablerSwitchHorizontal,
        children: this.columns
          .filter(c => c.id !== task.columnId)
          .map(c => ({
            id: `move-${c.id}`,
            label: c.title,
            callback: () => this.moveWithUndo(task, c.id),
          })),
      },
      {
        id: 'duplicate',
        label: 'Duplicate',
        icon: tablerCopy,
        callback: () => this.duplicateTask(task),
      },
      { separator: true },
      {
        id: 'delete',
        label: 'Delete',
        icon: this.trashIcon,
        callback: () => this.deleteTask(task.id),
      },
    ];
  }

  /** Assignee picker menu, anchored to a card's avatar. */
  protected assigneeMenuItems(task: Task): MenuItem[] {
    return this.members.map(m => ({
      id: `assign-${m.id}`,
      label: m.name,
      callback: () => this.reassign(task, m.id),
    }));
  }

  private mutate(id: string, fn: (task: Task) => void): void {
    this._tasks.update(tasks =>
      tasks.map(t => {
        if (t.id !== id) {
          return t;
        }
        const next = structuredClone(t);
        fn(next);
        return next;
      })
    );
  }

  protected toggleSubtask(task: Task, subtask: Subtask, done: boolean): void {
    this.mutate(task.id, t => {
      const target = t.subtasks.find(s => s.id === subtask.id);
      if (target) {
        target.done = done;
      }
    });
  }

  protected setProgress(task: Task, progress: number): void {
    this.mutate(task.id, t => (t.progress = progress));
  }

  protected setStatus(task: Task, columnId: ColumnId): void {
    this.moveWithUndo(task, columnId);
  }

  /** Move a task to another column and offer an Undo via the snackbar. */
  private moveWithUndo(task: Task, columnId: ColumnId): void {
    const from = task.columnId;
    if (from === columnId) {
      return;
    }
    this.mutate(task.id, t => (t.columnId = columnId));
    this._snackbar.show({
      content: `Moved "${task.title}" to ${this.columnTitle(columnId)}.`,
      autoHide: 5000,
      actions: [
        {
          label: 'Undo',
          value: 'undo',
          action: () => this.mutate(task.id, t => (t.columnId = from)),
        },
      ],
    });
  }

  protected renameTask(task: Task, title: string): void {
    const next = title.trim();
    if (next) {
      this.mutate(task.id, t => (t.title = next));
    }
  }

  /** Simulated attachment upload — appends the file and reports fake progress. */
  protected onUpload(files: NgnUploadFile[], task: Task, up: NgnUpload): void {
    for (const file of files) {
      let progress = 0;
      const tick = setInterval(() => {
        progress += 25;
        if (progress >= 100) {
          clearInterval(tick);
          up.markDone(file.id);
          this.mutate(task.id, t =>
            t.attachments.push({
              id: file.id,
              name: file.file.name,
              size: `${Math.max(1, Math.round(file.file.size / 1024))} KB`,
            })
          );
        } else {
          up.setProgress(file.id, progress);
        }
      }, 300);
    }
  }
}
