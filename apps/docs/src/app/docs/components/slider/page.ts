import { Demo_Slider_Base } from '../../../demos/slider/base';
import { Demo_Slider_MinMax } from '../../../demos/slider/min-max';
import { Demo_Slider_States } from '../../../demos/slider/states';
import { Demo_Slider_Vertical } from '../../../demos/slider/vertical';
import { NgnDocsPage } from '../../../utils/page/types';

export const SliderPage: NgnDocsPage = {
  title: `Slider`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/slider/index.md',
      components: [Demo_Slider_Base, Demo_Slider_MinMax, Demo_Slider_Vertical, Demo_Slider_States],
    },
    {
      title: 'API',
      mdFile: 'components/slider/api.md',
    },
  ],
};
