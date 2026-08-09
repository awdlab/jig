import { afterNextRender, Component, DestroyRef, inject, signal, viewChild } from '@angular/core';
import tablerCode from '@iconify/icons-tabler/code';
import tablerCopy from '@iconify/icons-tabler/copy';
import tablerTrash from '@iconify/icons-tabler/trash';
import tablerUser from '@iconify/icons-tabler/user';
import { JigAccordion, JigAccordionPanel } from '@awdlab/jig/accordion';
import { injectThemeColors, injectThemeControlKinds, JigTemplate } from '@awdlab/jig/api/ng';
import { JigAvatar, JigAvatarGroup } from '@awdlab/jig/avatar';
import { type BreadcrumbItem, JigBreadcrumb } from '@awdlab/jig/breadcrumb';
import { JigButton } from '@awdlab/jig/button';
import { JigButtonGroup } from '@awdlab/jig/button-group';
import { JigCalendar } from '@awdlab/jig/calendar';
import { JigCheckbox } from '@awdlab/jig/checkbox';
import { JigChip } from '@awdlab/jig/chip';
import { JigDialog } from '@awdlab/jig/dialog';
import { JigDrawer } from '@awdlab/jig/drawer';
import { JigEditInplace } from '@awdlab/jig/edit-inplace';
import { JigFilter } from '@awdlab/jig/filter';
import { JigHint } from '@awdlab/jig/hint';
import { JigIcon } from '@awdlab/jig/icon';
import { JigInplace } from '@awdlab/jig/inplace';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigItemView } from '@awdlab/jig/item-view';
import { JigListBox } from '@awdlab/jig/list-box';
import { DATE_TIME_MASKS, type MaskInputCfg, JigMaskInput } from '@awdlab/jig/mask-input';
import { type MenuItem, JigMenu } from '@awdlab/jig/menu';
import { JigMessage } from '@awdlab/jig/message';
import { JigNumberInput } from '@awdlab/jig/number-input';
import { JigPaginator } from '@awdlab/jig/paginator';
import { JigPopover } from '@awdlab/jig/popover';
import { JigProgress } from '@awdlab/jig/progress';
import { JigRadio, JigRadioGroup } from '@awdlab/jig/radio';
import { JigSelect } from '@awdlab/jig/select';
import { JigSelectButton } from '@awdlab/jig/select-button';
import { JigSlider } from '@awdlab/jig/slider';
import { injectSnackbarCreator } from '@awdlab/jig/snackbar';
import { JigSpinButtons } from '@awdlab/jig/spin-buttons';
import { JigSpinner } from '@awdlab/jig/spinner';
import { JigSplitterModule } from '@awdlab/jig/splitter';
import { JigSwitch } from '@awdlab/jig/switch';
import { JigTableModule } from '@awdlab/jig/table';
import { JigTab, JigTabs } from '@awdlab/jig/tabs';
import { JigTag } from '@awdlab/jig/tag';
import { injectToastCreator } from '@awdlab/jig/toast';
import { JigToggleButton } from '@awdlab/jig/toggle-button';
import { JigTooltip } from '@awdlab/jig/tooltip';
import { JigTree } from '@awdlab/jig/tree';
import { JigUpload, type JigUploadFile } from '@awdlab/jig/upload';

import { exampleData } from '../helper/data';
import { JigDocsThemePicker } from '../utils/theme-picker/theme-picker';

import type { JigTreeItem } from '@awdlab/jig/api';

/**
 * Unlinked overview page (`/_gallery`) rendering every visual control with
 * realistic data in one themed grid. Exists to eyeball nova-theme consistency
 * across the whole control set at a glance — not part of the docs navigation.
 */
@Component({
  selector: 'jig-docs-gallery',
  templateUrl: './gallery.html',
  imports: [
    JigTemplate,
    JigDocsThemePicker,
    JigAccordion,
    JigAccordionPanel,
    JigAvatar,
    JigAvatarGroup,
    JigBreadcrumb,
    JigButton,
    JigButtonGroup,
    JigCalendar,
    JigCheckbox,
    JigChip,
    JigDialog,
    JigDrawer,
    JigEditInplace,
    JigFilter,
    JigHint,
    JigIcon,
    JigInplace,
    JigInput,
    JigInputField,
    JigItemView,
    JigListBox,
    JigMaskInput,
    JigMenu,
    JigMessage,
    JigNumberInput,
    JigPaginator,
    JigPopover,
    JigProgress,
    JigRadio,
    JigRadioGroup,
    JigSelect,
    JigSelectButton,
    JigSlider,
    JigSpinButtons,
    JigSpinner,
    JigSplitterModule,
    JigSwitch,
    JigTableModule,
    JigTab,
    JigTabs,
    JigTag,
    JigToggleButton,
    JigTooltip,
    JigTree,
    JigUpload,
  ],
  // Scoped positioning for the always-open, top-layer overlays so they sit in
  // grid gaps instead of covering the content being compared. Purely layout —
  // no theming here; colors/surfaces still flow through the theme system.
  styles: `
    :host {
      display: block;
      min-height: 100%;
    }
    /* Pin the force-open dialog into the bottom-right gap, not screen-centre. */
    ::ng-deep .gallery-dialog dialog[popover] {
      inset: auto 1.5rem 1.5rem auto;
      margin: 0;
    }
  `,
})
export class JigDocsGallery {
  // ---- palettes driven by the active theme (kinds × colors matrices) --------
  protected readonly buttonKinds = injectThemeControlKinds('button');
  protected readonly buttonColors = injectThemeColors('button');
  protected readonly tagKinds = injectThemeControlKinds('tag');
  protected readonly tagColors = injectThemeColors('tag');
  protected readonly messageKinds = injectThemeControlKinds('message');
  protected readonly messageColors = injectThemeColors('message');
  protected readonly chipColors = injectThemeColors('chip');
  protected readonly hintKinds = injectThemeControlKinds('hint');

  // ---- realistic example data ----------------------------------------------
  protected readonly items = exampleData.items.flatPreformatted;
  protected readonly itemViewItems = exampleData.items.flat.slice(0, 6);
  protected readonly tableRows = exampleData.table(25);
  protected readonly lorem = exampleData.loremIpsum.words100;
  protected readonly loremShort = exampleData.loremIpsum.full.split(' ').slice(0, 40).join(' ');

  protected readonly selectButtonOptions = [
    { label: 'List', value: 'list' },
    { label: 'Grid', value: 'grid' },
    { label: 'Board', value: 'board' },
  ] as const;

  protected readonly menuItems = signal<MenuItem[]>([
    { id: 'copy', label: 'Copy', icon: tablerCopy },
    { id: 'code', label: 'View source', icon: tablerCode },
    { id: 'delete', label: 'Delete', icon: tablerTrash },
  ]);

  protected readonly breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Home', id: 'home', callback: () => {} },
    { label: 'Projects', id: 'projects', callback: () => {} },
    { label: 'awdlab', id: 'awdlab', callback: () => {} },
    { label: 'jig', id: 'jig' },
  ]);

  protected readonly tree: JigTreeItem[] = [
    {
      label: 'src',
      value: 'src',
      items: [
        { label: 'app.component.ts', value: 'app' },
        { label: 'app.routes.ts', value: 'routes' },
        {
          label: 'controls',
          value: 'controls',
          items: [
            { label: 'button.ts', value: 'button' },
            { label: 'select.ts', value: 'select', disabled: true },
          ],
        },
      ],
    },
    { label: 'package.json', value: 'pkg' },
    { label: 'README.md', value: 'readme' },
  ];

  protected readonly filterData: readonly string[] = [
    'Germany',
    'France',
    'Italy',
    'Spain',
    'Sweden',
    'Greece',
  ];

  protected readonly mask: MaskInputCfg = DATE_TIME_MASKS.date;

  // ---- interactive model values --------------------------------------------
  protected readonly textValue = signal('Jane Cooper');
  protected readonly numberValue = signal<number | null>(42);
  protected readonly maskValue = signal('');
  protected readonly sliderValue = signal(65);
  protected readonly progressValue = signal(70);
  protected readonly radioValue = signal('medium');
  protected readonly editValue = signal('Double-click to edit');
  protected readonly calendarValue = signal<Date | null>(new Date());
  protected readonly checkboxValue = signal(true);
  protected readonly switchValue = signal(true);
  protected readonly dialogOpen = signal(true);
  protected readonly drawerOpen = signal(false);

  protected readonly icons = { user: tablerUser };

  // ---- force-open overlays (see class doc + scoped styles) -----------------
  private readonly _select = viewChild.required<JigSelect<unknown>>('gallerySelect');
  private readonly _tooltip = viewChild.required(JigTooltip);

  private readonly _toasts = injectToastCreator();
  private readonly _snackbars = injectSnackbarCreator();
  private readonly _destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      // Expand the select dropdown and pin the tooltip open for the audit.
      this._select().show();
      this._tooltip().show();

      // Surface a persistent toast + snackbar so their themed surfaces are
      // visible at rest (both are service-driven, corner-anchored controls).
      this._toasts.show({
        header: 'Deployment complete',
        content: 'Your changes are live in production.',
        color: 'success',
        autoHide: false,
      });
      this._snackbars.show({
        header: 'Draft saved',
        content: 'All changes saved just now.',
        autoHide: false,
      });
    });
  }

  protected onUpload(files: JigUploadFile[], up: JigUpload): void {
    for (const file of files) {
      let progress = 0;
      const tick = setInterval(() => {
        progress += 25;
        if (progress >= 100) {
          clearInterval(tick);
          up.markDone(file.id);
        } else {
          up.setProgress(file.id, progress);
        }
      }, 400);
      // Stop the simulated upload if the page is left mid-transfer.
      this._destroyRef.onDestroy(() => clearInterval(tick));
    }
  }
}
