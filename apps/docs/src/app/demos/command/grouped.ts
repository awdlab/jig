import tablerArchive from '@iconify/icons-tabler/archive.js';
import tablerBell from '@iconify/icons-tabler/bell.js';
import tablerBrush from '@iconify/icons-tabler/brush.js';
import tablerCalendar from '@iconify/icons-tabler/calendar.js';
import tablerCopy from '@iconify/icons-tabler/copy.js';
import tablerDownload from '@iconify/icons-tabler/download.js';
import tablerFile from '@iconify/icons-tabler/file.js';
import tablerFolder from '@iconify/icons-tabler/folder.js';
import tablerFolderPlus from '@iconify/icons-tabler/folder-plus.js';
import tablerGitBranch from '@iconify/icons-tabler/git-branch.js';
import tablerHome from '@iconify/icons-tabler/home.js';
import tablerKey from '@iconify/icons-tabler/key.js';
import tablerLanguage from '@iconify/icons-tabler/language.js';
import tablerMail from '@iconify/icons-tabler/mail.js';
import tablerPencil from '@iconify/icons-tabler/pencil.js';
import tablerPlus from '@iconify/icons-tabler/plus.js';
import tablerRefresh from '@iconify/icons-tabler/refresh.js';
import tablerSearch from '@iconify/icons-tabler/search.js';
import tablerSettings from '@iconify/icons-tabler/settings.js';
import tablerShare from '@iconify/icons-tabler/share.js';
import tablerShieldLock from '@iconify/icons-tabler/shield-lock.js';
import tablerStar from '@iconify/icons-tabler/star.js';
import tablerTag from '@iconify/icons-tabler/tag.js';
import tablerTerminal from '@iconify/icons-tabler/terminal-2.js';
import tablerTrash from '@iconify/icons-tabler/trash.js';
import tablerUpload from '@iconify/icons-tabler/upload.js';
import tablerUser from '@iconify/icons-tabler/user.js';
import tablerUsers from '@iconify/icons-tabler/users.js';
import { Component, signal } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigCommand } from '@awdlab/jig/command';

import type { JigActionItem } from '@awdlab/jig/api';

@Component({
  imports: [JigCommand, JigButton],
  selector: 'jig-demo-command-grouped-demo',
  template: `
    <button jigButton (click)="open.set(true)">Open palette</button>
    <jig-command [items]="items" [(open)]="open" />
  `,
})
export class Demo_Command_Grouped {
  protected readonly open = signal(false);
  protected readonly items: JigActionItem[] = [
    {
      id: 'navigation',
      label: 'Navigation',
      children: [
        { id: 'home', label: 'Home', icon: tablerHome },
        { id: 'inbox', label: 'Inbox', icon: tablerMail },
        { id: 'documents', label: 'Documents', icon: tablerFile },
        { id: 'folders', label: 'Folders', icon: tablerFolder },
        { id: 'favourites', label: 'Favourites', icon: tablerStar },
        { id: 'notifications', label: 'Notifications', icon: tablerBell },
        { id: 'calendar', label: 'Calendar', icon: tablerCalendar },
        { id: 'archive', label: 'Archive', icon: tablerArchive },
        { id: 'tags', label: 'Tags', icon: tablerTag },
      ],
    },
    {
      id: 'actions',
      label: 'Actions',
      children: [
        { id: 'new-file', label: 'New File', icon: tablerPlus },
        { id: 'new-folder', label: 'New Folder', icon: tablerFolderPlus },
        { id: 'copy', label: 'Copy', icon: tablerCopy },
        { id: 'rename', label: 'Rename', icon: tablerPencil },
        { id: 'share', label: 'Share Link', icon: tablerShare },
        { id: 'upload', label: 'Upload Files', icon: tablerUpload },
        { id: 'download', label: 'Download', icon: tablerDownload },
        { id: 'refresh', label: 'Refresh', icon: tablerRefresh },
        { id: 'delete', label: 'Move to Trash', icon: tablerTrash },
      ],
    },
    {
      id: 'developer',
      label: 'Developer',
      children: [
        { id: 'terminal', label: 'Toggle Terminal', icon: tablerTerminal },
        { id: 'branch', label: 'Switch Branch', icon: tablerGitBranch },
        { id: 'search-files', label: 'Search in Files', icon: tablerSearch },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      children: [
        { id: 'profile', label: 'Edit Profile', icon: tablerUser },
        { id: 'members', label: 'Manage Members', icon: tablerUsers },
        { id: 'appearance', label: 'Change Appearance', icon: tablerBrush },
        { id: 'language', label: 'Language & Region', icon: tablerLanguage },
        { id: 'security', label: 'Security', icon: tablerShieldLock },
        { id: 'api-keys', label: 'API Keys', icon: tablerKey },
        { id: 'preferences', label: 'Preferences', icon: tablerSettings },
      ],
    },
  ];
}
