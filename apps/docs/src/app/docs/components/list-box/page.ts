import { Demo_ListBox_Base } from '../../../demos/list-box/base';
import { Demo_ListBox_Fields } from '../../../demos/list-box/fields-demo';
import { Demo_ListBox_Filter } from '../../../demos/list-box/filter';
import { Demo_ListBox_Grouped } from '../../../demos/list-box/grouped-demo';
import { Demo_ListBox_Multiple } from '../../../demos/list-box/multiple';
import { Demo_ListBox_Templates } from '../../../demos/list-box/templates-demo';
import { Demo_ListBox_Value } from '../../../demos/list-box/value-demo';
import { Demo_ListBox_Virtual } from '../../../demos/list-box/virtual-demo';
import { NgnDocsPage } from '../../../utils/page/types';

export const ListBoxPage: NgnDocsPage = {
  title: `List Box`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/list-box/index.md',
      components: [
        Demo_ListBox_Base,
        Demo_ListBox_Fields,
        Demo_ListBox_Grouped,
        Demo_ListBox_Templates,
        Demo_ListBox_Value,
        Demo_ListBox_Virtual,
        Demo_ListBox_Multiple,
        Demo_ListBox_Filter,
      ],
    },
    {
      title: 'API',
      mdFile: 'components/list-box/api.md',
    },
  ],
};
