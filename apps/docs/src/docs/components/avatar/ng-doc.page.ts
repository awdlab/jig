import { NgDocPage } from '@ng-doc/core';
import { NgnAvatar } from '@ngneers/controls/avatar';

import { Demo_Avatar_Base } from '../../../app/demos/avatar/base';
import { Demo_Avatar_Group } from '../../../app/demos/avatar/group';
import { Demo_Avatar_Icon } from '../../../app/demos/avatar/icon';
import { Demo_Avatar_Image } from '../../../app/demos/avatar/image';
import { Demo_Avatar_Size } from '../../../app/demos/avatar/size';
import ComponentsCategory from '../../categories/components/ng-doc.category';

const AvatarPage: NgDocPage = {
  title: `Avatar`,
  mdFile: './index.md',
  category: ComponentsCategory,
  demos: {
    Demo_Avatar_Base,
    Demo_Avatar_Image,
    Demo_Avatar_Size,
    Demo_Avatar_Icon,
    Demo_Avatar_Group,
  },
  playgrounds: {
    AvatarPlayground: {
      target: NgnAvatar,
      template: `<ng-doc-selector></ng-doc-selector>`,
    },
  },
};

export default AvatarPage;
