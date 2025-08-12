import { ComponentStories } from '../_base/all';

export const stories: ComponentStories = {
  id: 'avatar',
  name: 'Avatar',
  stories: [
    {
      fileName: 'base',
      title: 'Basic',
      component: () => import('./base-demo').then(x => x.Avatar_Base_Component),
    },
    {
      fileName: 'image',
      title: 'Image',
      component: () => import('./image-demo').then(x => x.Avatar_Image_Component),
    },
    {
      fileName: 'size',
      title: 'Size',
      component: () => import('./size-demo').then(x => x.Avatar_Size_Component),
    },
    {
      fileName: 'icon',
      title: 'Icon',
      component: () => import('./icon-demo').then(x => x.Avatar_Icon_Component),
    },
  ],
};
