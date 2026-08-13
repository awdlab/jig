import { Component, signal } from '@angular/core';
import tablerDownload from '@iconify/icons-tabler/download';
import tablerLayoutGrid from '@iconify/icons-tabler/layout-grid';
import tablerLayoutList from '@iconify/icons-tabler/layout-list';
import tablerSearch from '@iconify/icons-tabler/search';
import tablerTrash from '@iconify/icons-tabler/trash';
import { JigButton } from '@awdlab/jig/button';
import { JigIcon } from '@awdlab/jig/icon';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigSelectButton } from '@awdlab/jig/select-button';
import { JigTag } from '@awdlab/jig/tag';
import { JigToolbar } from '@awdlab/jig/toolbar';
import { JigTooltip } from '@awdlab/jig/tooltip';

@Component({
  selector: 'jig-demo-toolbar-table-actions',
  imports: [
    JigButton,
    JigIcon,
    JigInput,
    JigInputField,
    JigSelectButton,
    JigTag,
    JigToolbar,
    JigTooltip,
  ],
  template: `<jig-toolbar>
    <jig-tag color="primary">{{ selected() }} selected</jig-tag>
    <button jigButton kind="text" color="surface" aria-label="Export" jigTooltip="Export">
      <jig-icon [icon]="icons.download" />
    </button>
    <button jigButton kind="text" color="error" aria-label="Delete" jigTooltip="Delete">
      <jig-icon [icon]="icons.delete" />
    </button>

    <jig-input-field placement="center" class="w-48">
      <input
        jigInput
        placeholder="Filter rows"
        [value]="query()"
        (valueChange)="query.set($event ?? '')"
      />
      <jig-icon [icon]="icons.search" />
    </jig-input-field>

    <jig-select-button
      placement="end"
      label="Layout"
      [options]="layouts"
      [value]="layout()"
      (valueChange)="layout.set($event)"
    />
  </jig-toolbar>`,
})
export class Demo_Toolbar_TableActions {
  protected readonly icons = {
    download: tablerDownload,
    delete: tablerTrash,
    search: tablerSearch,
  };

  protected readonly layouts = [
    { label: 'List', value: 'list', icon: tablerLayoutList },
    { label: 'Grid', value: 'grid', icon: tablerLayoutGrid },
  ];

  protected readonly selected = signal(3);
  protected readonly query = signal('');
  protected readonly layout = signal('list');
}
