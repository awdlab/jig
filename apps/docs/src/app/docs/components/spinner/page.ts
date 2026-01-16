import { Demo_Spinner_Base } from '../../../demos/spinner/base';
import { Demo_Spinner_Colors } from '../../../demos/spinner/colors';
import { Demo_Spinner_Creator } from '../../../demos/spinner/creator';
import { Demo_Spinner_Sizes } from '../../../demos/spinner/sizes';
import { Demo_Spinner_Thickness } from '../../../demos/spinner/thickness';
import { NgnDocsPage } from '../../../utils/page/types';

export const SpinnerPage: NgnDocsPage = {
  title: `Spinner`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/spinner/index.md',
      components: [
        Demo_Spinner_Base,
        Demo_Spinner_Sizes,
        Demo_Spinner_Thickness,
        Demo_Spinner_Colors,
        Demo_Spinner_Creator,
      ],
    },
    {
      title: 'API',
      mdFile: 'components/spinner/api.md',
    },
  ],
};
