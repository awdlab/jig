import { createControlTemplate } from '@ngneers/controls-themes/api';

export const uploadControlTemplate = createControlTemplate({
  scope: 'upload',
  classNames: [
    'root',
    // state (toggled on the host)
    'dragover',
    'disabled',
    'clickable',
    'draggable',
    'has-files',
    // file-list placement (relative to the drop zone)
    'list-top',
    'list-bottom',
    'list-left',
    'list-right',
    // the projected native input, hidden but kept accessible
    'native',
    // drop zone + its column (zone + manual footer)
    'main',
    'zone',
    'icon',
    'placeholder',
    // file list
    'list',
    'item',
    'item-pending',
    'item-uploading',
    'item-done',
    'item-failed',
    'status',
    'file',
    'name',
    'size',
    'progress',
    'actions',
    'action',
    // manual footer
    'footer',
    'trigger',
  ],
});
