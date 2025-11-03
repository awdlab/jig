import { Demo_Avatar_Base } from '../../../demos/avatar/base';
import { Demo_Avatar_Group } from '../../../demos/avatar/group';
import { Demo_Avatar_Icon } from '../../../demos/avatar/icon';
import { Demo_Avatar_Image } from '../../../demos/avatar/image';
import { Demo_Avatar_Size } from '../../../demos/avatar/size';
import { NgnDocsPage } from '../../../utils/page/types';

export const AvatarPage: NgnDocsPage = {
  title: `Avatar`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Examples',
      mdFile: 'components/avatar/index.md',
      components: [
        Demo_Avatar_Base,
        Demo_Avatar_Image,
        Demo_Avatar_Size,
        Demo_Avatar_Icon,
        Demo_Avatar_Group,
      ],
    },
    {
      title: 'API',
      mdFile: 'components/avatar/api.md',
    },
  ],
};
