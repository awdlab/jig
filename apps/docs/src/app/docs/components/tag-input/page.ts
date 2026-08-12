import { JigDocsTagInputPlayground } from './playground';
import { Demo_TagInput_Base } from '../../../demos/tag-input/base';
import { Demo_TagInput_Delimiters } from '../../../demos/tag-input/delimiters';
import { Demo_TagInput_Duplicates } from '../../../demos/tag-input/duplicates';
import { Demo_TagInput_MaxTags } from '../../../demos/tag-input/max-tags';
import { Demo_TagInput_Multiline } from '../../../demos/tag-input/multiline';
import { Demo_TagInput_Rejected } from '../../../demos/tag-input/rejected';
import { Demo_TagInput_States } from '../../../demos/tag-input/states';
import { Demo_TagInput_SuggestionsAsync } from '../../../demos/tag-input/suggestions-async';
import { Demo_TagInput_SuggestionsStatic } from '../../../demos/tag-input/suggestions-static';
import { Demo_TagInput_TagLength } from '../../../demos/tag-input/tag-length';
import { Demo_TagInput_Templates } from '../../../demos/tag-input/templates';
import { Demo_TagInput_Validation } from '../../../demos/tag-input/validation';
import { i18nKeys } from '../../../utils/i18n-doc';

import type { JigDocsPage } from '../../../utils/page/types';

export const TagInputPage: JigDocsPage = {
  title: `Tag Input`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/tag-input/index.md',
      components: [
        Demo_TagInput_Base,
        Demo_TagInput_Multiline,
        Demo_TagInput_Delimiters,
        Demo_TagInput_Duplicates,
        Demo_TagInput_MaxTags,
        Demo_TagInput_TagLength,
        Demo_TagInput_SuggestionsStatic,
        Demo_TagInput_SuggestionsAsync,
        Demo_TagInput_Templates,
        Demo_TagInput_Validation,
        Demo_TagInput_Rejected,
        Demo_TagInput_States,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: JigDocsTagInputPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/tag-input/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/tag-input/a11y.md' },
    i18nKeys(
      'tagInput',
      {
        remove: 'Accessible label for a tag’s remove button.',
        duplicate: 'Announced when a tag is refused because it is already present.',
        tooShort: 'Announced when typed text is shorter than the per-tag minimum.',
        tooLong: 'Announced when text pasted or picked exceeds the per-tag maximum.',
        maxTags: 'Announced when the tag limit has been reached.',
        added: 'Announced when a tag is added.',
        removed: 'Announced when a tag is removed.',
        suggestions: 'Accessible name for the suggestion list.',
        errors: {
          required: 'Validation message shown when no tag has been added.',
          tagCount: 'Validation message shown when the number of tags is out of bounds.',
          tagLength: 'Validation message shown when a tag’s length is out of bounds.',
        },
      },
      ['dropdown-list', 'list-box']
    ),
  ],
};
